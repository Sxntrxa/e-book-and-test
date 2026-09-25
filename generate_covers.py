import os
import re
import fitz  # PyMuPDF

books_ts_path = 'src/data/books.ts'
public_dir = 'public'
covers_dir = os.path.join(public_dir, 'covers')

if not os.path.exists(covers_dir):
    os.makedirs(covers_dir)

with open(books_ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all blocks that look like a book object
book_pattern = re.compile(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"[^"]+",\s*"pdfUrl":\s*"([^"]+)",\s*"coverColor":\s*"[^"]+",?(?:\s*"coverImageUrl":\s*"[^"]+",?)?\s*"categoryId":\s*"[^"]+"\s*\}')

def replacer(match):
    book_id = match.group(1)
    pdf_url = match.group(2)
    
    # Remove leading slash for local path resolution
    pdf_local_path = os.path.join(public_dir, pdf_url.lstrip('/'))
    
    cover_image_url = None
    
    if os.path.exists(pdf_local_path):
        try:
            print(f"Generating cover for {book_id.encode('utf-8', 'ignore').decode('utf-8')}")
            doc = fitz.open(pdf_local_path)
            if len(doc) > 0:
                page = doc.load_page(0)
                # Zoom a bit for better quality
                zoom = 2.0
                mat = fitz.Matrix(zoom, zoom)
                pix = page.get_pixmap(matrix=mat)
                
                cover_filename = f"{book_id}.jpg"
                cover_local_path = os.path.join(covers_dir, cover_filename)
                pix.save(cover_local_path)
                
                cover_image_url = f"/covers/{cover_filename}"
                print("Saved cover")
            doc.close()
        except Exception as e:
            print(f"Failed to generate cover: {e}")
    else:
        print(f"PDF not found")
    
    # Reconstruct the matched string, injecting coverImageUrl if we generated one
    original_match = match.group(0)
    
    if cover_image_url and '"coverImageUrl"' not in original_match:
        # Insert before categoryId
        new_match = re.sub(
            r'("categoryId":\s*"[^"]+"\s*\})',
            f'"coverImageUrl": "{cover_image_url}",\n        \\1',
            original_match
        )
        return new_match
    
    return original_match

new_content = book_pattern.sub(replacer, content)

with open(books_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done!")

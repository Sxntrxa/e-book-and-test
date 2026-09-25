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

# Expanded regex to capture more properties flexibly, including totalPages
book_pattern = re.compile(r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"[^"]+",\s*"pdfUrl":\s*"([^"]+)",\s*"coverColor":\s*"[^"]+",?(?:\s*"coverImageUrl":\s*"[^"]+",?)?(?:\s*"totalPages":\s*\d+,?)?\s*"categoryId":\s*"[^"]+"\s*\}')

def replacer(match):
    book_id = match.group(1)
    pdf_url = match.group(2)
    
    pdf_local_path = os.path.join(public_dir, pdf_url.lstrip('/'))
    
    total_pages = None
    
    if os.path.exists(pdf_local_path):
        try:
            print(f"Processing {book_id.encode('utf-8', 'ignore').decode('utf-8')}")
            doc = fitz.open(pdf_local_path)
            total_pages = len(doc)
            doc.close()
        except Exception as e:
            print(f"Failed to process {book_id}: {e}")
    
    original_match = match.group(0)
    new_match = original_match
    
    if total_pages is not None:
        if '"totalPages"' in new_match:
            # Replace existing
            new_match = re.sub(
                r'"totalPages":\s*\d+',
                f'"totalPages": {total_pages}',
                new_match
            )
        else:
            # Insert before categoryId
            new_match = re.sub(
                r'("categoryId":\s*"[^"]+"\s*\})',
                f'"totalPages": {total_pages},\n        \\1',
                new_match
            )
            
    return new_match

new_content = book_pattern.sub(replacer, content)

with open(books_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done generating totalPages!")

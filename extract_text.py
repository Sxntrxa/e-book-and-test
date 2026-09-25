import os
import fitz  # PyMuPDF

books_ts_path = 'src/data/books.ts'
public_dir = 'public'
scratch_dir = 'scratch'

if not os.path.exists(scratch_dir):
    os.makedirs(scratch_dir)

# Just hardcode the paths for RAM1201 chapters 1 to 13
prefix = "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
files = [
    f"บทที่ 1 ทฤษฎีการผลิต.pdf",
    f"บทที่ 2 แนวทางการส่งเสริมากพัฒนานวัตกรรม.pdf",
    f"บทที่ 3 ความรู้เบื้องค้นเกี่ยวกับความคิดสร้างสรรค์และนวัตกรรม.pdf",
    f"บทที่ 4 ประเภทของนวัตกรรม.pdf",
    f"บทที่ 5 การเปลี่ยนแปลงทางเทคโนโลยี.pdf",
    f"บทที่ 6 แหล่งที่มาของนวัตกรรม.pdf",
    f"บทที่ 7 นวัตกรรมและการเป็นผู้ประกอบการ.pdf",
    f"บทที่ 8 กระบวนการพัฒนาผลิตภัณฑ์นวัตกรรม.pdf",
    f"บทที่ 9 วิวัฒนาการของเทคโนโลยี.pdf",
    f"บทที่ 10 เทคโนโลยีดิจิทัล.pdf",
    f"บทที่ 11 อุตสาหกรรมอัจฉริยะ.pdf",
    f"บทที่ 12 นวัตกรรมสีเขียว และ นวัตกรรมที่ยั่งยืน.pdf",
    f"บทที่ 13 ความรู้เกี่ยวกับทรัพย์สินทางปัญญา.pdf",
]

for i, filename in enumerate(files):
    ch = i + 1
    pdf_path = os.path.join(public_dir, prefix.lstrip('/'), filename)
    txt_path = os.path.join(scratch_dir, f'ram1201_ch{ch}.txt')
    
    if os.path.exists(pdf_path):
        doc = fitz.open(pdf_path)
        text = ""
        # Extract first 15 pages or all pages if fewer
        for page_num in range(min(15, len(doc))):
            page = doc.load_page(page_num)
            text += page.get_text() + "\n"
        doc.close()
        
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Extracted chapter {ch}")
    else:
        print(f"File not found: {pdf_path}")

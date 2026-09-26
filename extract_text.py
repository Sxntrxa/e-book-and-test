import os
import fitz # PyMuPDF
import json

public_dir = 'public/Ram1203'
scratch_dir = 'scratch/ram1203_texts'

if not os.path.exists(scratch_dir):
    os.makedirs(scratch_dir)

pdf_files = [f for f in os.listdir(public_dir) if f.lower().endswith('.pdf')]
pdf_files.sort()

texts_info = {}

for idx, file in enumerate(pdf_files):
    pdf_path = os.path.join(public_dir, file)
    txt_filename = f"ch{idx+1}.txt"
    txt_path = os.path.join(scratch_dir, txt_filename)
    
    print(f"Extracting {file} to {txt_filename}...")
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    doc.close()
    
    # Clean up empty lines a bit
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    text = '\n'.join(lines)
    
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(text)
        
    texts_info[f"ch{idx+1}"] = {
        "original_file": file,
        "txt_file": txt_path,
        "char_count": len(text)
    }

with open(os.path.join(scratch_dir, 'metadata.json'), 'w', encoding='utf-8') as f:
    json.dump(texts_info, f, ensure_ascii=False, indent=2)

print("Extraction completed!")

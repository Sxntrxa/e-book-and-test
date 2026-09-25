import os
import json
import re

public_dir = os.path.join(os.path.dirname(__file__), 'public')
psych_dir = os.path.join(public_dir, 'psychology-intro')

if not os.path.exists(psych_dir):
    os.makedirs(psych_dir)

# Move PDFs from public to psych_dir
for file in os.listdir(public_dir):
    if file.lower().endswith('.pdf'):
        old_path = os.path.join(public_dir, file)
        new_path = os.path.join(psych_dir, file)
        os.rename(old_path, new_path)

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

category_titles = {
    'psychology-intro': 'PSY1002 จิตวิทยาเบื้องต้น',
    'RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม': 'RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม',
    'Ram1203': 'RAM1203 ศาสตร์การคิดเปลี่ยนโลก'
}

category_quiz_urls = {
    'psychology-intro': '/exam-psychology/index.html',
    'RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม': '/exam-ram1201/index.html'
}

categories = []
for dir_name in os.listdir(public_dir):
    dir_path = os.path.join(public_dir, dir_name)
    if os.path.isdir(dir_path) and not dir_name.startswith('exam-') and dir_name != 'covers':
        pdf_files = [f for f in os.listdir(dir_path) if f.lower().endswith('.pdf') and 'เอกสารประกอบการสอน' not in f]
        pdf_files.sort(key=natural_sort_key)
        
        books = []
        cover_colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-orange-600', 'bg-teal-600', 'bg-indigo-600']
        
        for idx, file in enumerate(pdf_files):
            title = re.sub(r'\.pdf$', '', file, flags=re.IGNORECASE)
            color = cover_colors[idx % len(cover_colors)]
            books.append({
                'id': f"{dir_name}-ch{idx + 1}",
                'title': title,
                'pdfUrl': f"/{dir_name}/{file}",
                'coverColor': color,
                'categoryId': dir_name
            })
            
        categories.append({
            'id': dir_name,
            'title': category_titles.get(dir_name, dir_name),
            'quizUrl': category_quiz_urls.get(dir_name),
            'books': books
        })

categories.sort(key=lambda x: x['id'])

ts_content = f"""export interface Book {{
  id: string;
  title: string;
  pdfUrl: string;
  coverColor: string;
  categoryId: string;
}}

export interface Category {{
  id: string;
  title: string;
  quizUrl?: string;
  books: Book[];
}}

export const categories: Category[] = {json.dumps(categories, ensure_ascii=False, indent=2).replace('"quizUrl": null', '"quizUrl": undefined')};

export function getBookById(id: string): Book | undefined {{
  for (const cat of categories) {{
    const book = cat.books.find(b => b.id === id);
    if (book) return book;
  }}
  return undefined;
}}
"""

ts_path = os.path.join(os.path.dirname(__file__), 'src/data/books.ts')
with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print('Successfully generated books.ts via Python')

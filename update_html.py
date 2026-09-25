import os

file_path = "public/exam-ram1201/index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("PSY1002 จิตวิทยาเบื้องต้น", "RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม")
content = content.replace("PSY1002", "RAM1201")
content = content.replace("จิตวิทยาเบื้องต้น", "ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม")
content = content.replace("const TOTAL_CHAPTERS = 12;", "const TOTAL_CHAPTERS = 13;")
content = content.replace("STORAGE_KEY = 'psyQuizHistory'", "STORAGE_KEY = 'ram1201QuizHistory'")
content = content.replace("psyTheme", "ram1201Theme")
content = content.replace('href="/category/psychology-intro"', 'href="/category/RAM1201%20RAM1201%20%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1"')

# Insert ch13 script
content = content.replace('<script src="questions_ch12.js"></script>', '<script src="questions_ch12.js"></script>\n<script src="questions_ch13.js"></script>')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")

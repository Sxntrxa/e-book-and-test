import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\shotc\Desktop\pdf-reader\public\exam-psychology\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = re.findall(r'<script>(.*?)</script>', text, re.DOTALL)
for i, s in enumerate(scripts):
    print(f"\n--- Script {i} ---")
    print(s[:1000])

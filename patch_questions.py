import json

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Extract json
    import re
    match = re.search(r'const questions_ch\d+ = (\[.*\]);', content, re.DOTALL)
    return json.loads(match.group(1)), content, match.group(1)

def save_json(filepath, original_content, old_json_str, new_data):
    # formatting JSON slightly matches the original
    new_json_str = json.dumps(new_data, ensure_ascii=False, indent=2)
    new_content = original_content.replace(old_json_str, new_json_str)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Patched {filepath}")

# 1. Ch3 Q8 (Mendel)
# 2. Ch3 Q26 (Zygote)
# 3. Ch3 Q37 (Memory)
data_ch3, content_ch3, str_ch3 = load_json('public/exam-psychology/questions_ch3.js')

for q in data_ch3:
    if "โยฮันน์ เมนเดล" in q['options'] or "โยฮันน์ เมนเดล" in q.get('explanation', ''):
        q['question'] = "ใครคือนักพฤกษศาสตร์และนักบวชที่ค้นพบกฎพื้นฐานการถ่ายทอดทางพันธุกรรมเป็นคนแรกของโลก (จากการทดลองในถั่วลันเตา)?"
    
    if "วัยทารกแรกเกิดถึง 2 สัปดาห์แรก" in q['question'] and "ไซโกต" in str(q['options']):
        q['question'] = "ระยะพัฒนาการก่อนคลอดในช่วง 2 สัปดาห์แรกหลังการปฏิสนธิ เรียกว่าระยะใด?"
        
    if "อายุ 60-70 ปี ความจำประเภทใดจะเสื่อมสภาพลงมากที่สุด" in q['question']:
        q['options'][3] = "ความจำเชิงเหตุการณ์ (Episodic memory)"
        q['explanation'] = "เมื่ออายุ 60-70 ปี ความจำเชิงเหตุการณ์ (Episodic memory) และความมั่นใจในการจำจะเสื่อมสภาพลงมากที่สุดเมื่อเทียบกับความจำประเภทอื่นๆ"

save_json('public/exam-psychology/questions_ch3.js', content_ch3, str_ch3, data_ch3)

# 4. Ch4 Q20 (Taste bud / Papillae)
data_ch4, content_ch4, str_ch4 = load_json('public/exam-psychology/questions_ch4.js')
for q in data_ch4:
    if "ตุ่มรับรส" in q['question'] and "Papillae" in str(q['options']):
        q['question'] = "ปุ่มนูนๆ บนลิ้นที่สามารถมองเห็นได้ด้วยตาเปล่า ซึ่งเป็นที่อยู่ของตุ่มรับรส (Taste bud) เรียกว่าอะไร?"
save_json('public/exam-psychology/questions_ch4.js', content_ch4, str_ch4, data_ch4)

# 5. Ch6 Q20 (Math formula -> Algorithm)
data_ch6, content_ch6, str_ch6 = load_json('public/exam-psychology/questions_ch6.js')
for q in data_ch6:
    if "สูตรสำเร็จทางคณิตศาสตร์" in q['question']:
        q['question'] = "ตามการจำแนกประเภทการแก้ปัญหาในตำราเรียน การใช้เครื่องมืออย่างสูตรสำเร็จทางคณิตศาสตร์หรือคอมพิวเตอร์ จัดเป็นการแก้ปัญหาประเภทใด?"
        q['options'][1] = "การแก้ปัญหาแบบขั้นตอนวิธี (Algorithm)"
save_json('public/exam-psychology/questions_ch6.js', content_ch6, str_ch6, data_ch6)

# 6. Ch11 Q14 (Typo ข้อต้อย)
data_ch11, content_ch11, str_ch11 = load_json('public/exam-psychology/questions_ch11.js')
for q in data_ch11:
    for i, opt in enumerate(q['options']):
        if "ข้อต้อย" in opt:
            q['options'][i] = opt.replace("ข้อต้อย", "ข้อตกลง")
    if "ข้อต้อย" in q['explanation']:
        q['explanation'] = q['explanation'].replace("ข้อต้อย", "ข้อตกลง")
save_json('public/exam-psychology/questions_ch11.js', content_ch11, str_ch11, data_ch11)

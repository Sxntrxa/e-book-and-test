import os

files_to_patch = [
    "public/exam-psychology/index.html",
    "public/exam-ram1201/index.html"
]

for file_path in files_to_patch:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Search for the end of renderQuestion
    target_str = "document.getElementById('submit-btn').style.display = isLast ? 'inline-flex' : 'none';\n    }"
    replacement_str = "document.getElementById('submit-btn').style.display = isLast ? 'inline-flex' : 'none';\n        if (typeof renderNavGrid === 'function') renderNavGrid();\n    }"
    
    if target_str in content:
        content = content.replace(target_str, replacement_str)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched renderQuestion in {file_path}")
    else:
        print(f"Target string not found in {file_path}")

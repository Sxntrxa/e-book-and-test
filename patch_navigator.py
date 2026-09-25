import os
import re

css_to_inject = """
        /* ─── Question Navigator ─── */
        .nav-grid-container {
            margin-top: 16px;
            padding: 16px 20px;
            background: var(--surface-solid);
            border-top: 1px solid var(--separator);
        }
        .nav-grid-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-secondary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
            gap: 8px;
        }
        .nav-box {
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            border: 2px solid transparent;
            background: var(--fill);
            color: var(--text-primary);
            transition: all 0.2s ease;
        }
        .nav-box:hover {
            opacity: 0.8;
        }
        .nav-box.answered {
            background: rgba(52,199,89,0.15);
            color: var(--success);
            border-color: rgba(52,199,89,0.3);
        }
        .nav-box.current {
            border-color: var(--accent) !important;
            box-shadow: 0 0 0 2px rgba(0,122,255,0.2);
        }
"""

html_to_inject = """
            <div class="nav-grid-container">
                <div class="nav-grid-title">
                    <span>แผงควบคุมข้อสอบ</span>
                    <span style="font-size: 12px; font-weight: normal;">(เขียว = ตอบแล้ว)</span>
                </div>
                <div class="nav-grid" id="question-nav-grid"></div>
            </div>
"""

js_to_inject = """
    function renderNavGrid() {
        const grid = document.getElementById('question-nav-grid');
        grid.innerHTML = '';
        currentQuestions.forEach((_, i) => {
            const box = document.createElement('div');
            box.className = 'nav-box';
            if (userAnswers[i] !== null) box.classList.add('answered');
            if (i === currentQuestionIndex) box.classList.add('current');
            box.innerText = i + 1;
            box.onclick = () => {
                currentQuestionIndex = i;
                renderQuestion();
            };
            grid.appendChild(box);
        });
    }
"""

files_to_patch = [
    "public/exam-psychology/index.html",
    "public/exam-ram1201/index.html"
]

for file_path in files_to_patch:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Check if already injected
    if "nav-grid-container" in content:
        print(f"Already injected in {file_path}")
        continue
        
    # Inject CSS before </style>
    content = content.replace("</style>", css_to_inject + "\n    </style>")
    
    # Inject HTML below quiz-nav
    content = content.replace('</div>\n    </div>\n\n    <!-- ═══ Screen: Results ═══ -->', 
                              '</div>\n' + html_to_inject + '    </div>\n\n    <!-- ═══ Screen: Results ═══ -->')
                              
    # Inject JS renderNavGrid definition before updateTimerDisplay
    content = content.replace('function updateTimerDisplay()', js_to_inject + '\n    function updateTimerDisplay()')
    
    # Call renderNavGrid at end of renderQuestion
    content = content.replace('checkNavButtons();\n    }', 'checkNavButtons();\n        renderNavGrid();\n    }')
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Patched {file_path}")

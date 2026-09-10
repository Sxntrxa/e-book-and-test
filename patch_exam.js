const fs = require('fs');

let html = fs.readFileSync('public/exam-psychology/index.html', 'utf8');

// 1. Add "Random All Chapters" button in window.onload
const onloadTarget = `btn.style.whiteSpace = 'pre-line';
              }
              container.appendChild(btn);
          }`;
const onloadReplacement = `btn.style.whiteSpace = 'pre-line';
              }
              container.appendChild(btn);
          }
          const randBtn = document.createElement('button');
          randBtn.className = 'chapter-btn';
          randBtn.style.background = 'var(--accent)';
          randBtn.style.color = '#fff';
          randBtn.innerText = 'สุ่มรวมทุกบท';
          randBtn.onclick = () => pickCount('all');
          container.appendChild(randBtn);`;
html = html.replace(onloadTarget, onloadReplacement);

// 2. Add Timer Options UI to screen-count
const screenCountTarget = `<div class="card">
            <div class="card-header">จำนวนข้อที่ต้องการทำ</div>
            <div class="count-grid" id="count-options"></div>
        </div>`;
const screenCountReplacement = `<div class="card">
            <div class="card-header">จำนวนข้อที่ต้องการทำ</div>
            <div class="count-grid" id="count-options"></div>
        </div>
        <div class="card" style="margin-top: 20px;">
            <div class="card-header">กำหนดเวลา (นาที)</div>
            <div class="count-grid" id="time-options">
                <button class="count-btn" id="t-60" onclick="selectTime(60)">60<br><span style="font-size:13px;opacity:0.7">นาที</span></button>
                <button class="count-btn" id="t-90" onclick="selectTime(90)">90<br><span style="font-size:13px;opacity:0.7">นาที</span></button>
                <button class="count-btn" id="t-120" onclick="selectTime(120)">120<br><span style="font-size:13px;opacity:0.7">นาที</span></button>
                <button class="count-btn" id="t-0" onclick="selectTime(0)" style="border-color:var(--accent); background:var(--option-selected-bg)">ไม่จับเวลา</button>
            </div>
        </div>`;
html = html.replace(screenCountTarget, screenCountReplacement);

// 3. Update pickCount and startQuiz functions
const pickCountTarget = `    // ─── Count Picker ───
    function pickCount(chapter) {
        currentChapter = chapter;
        const total = allQuizzes[chapter].length;
        document.getElementById('count-title').innerText = 'บทที่ ' + chapter;
        document.getElementById('count-info').innerText = 'มีทั้งหมด ' + total + ' ข้อในบทนี้ เลือกจำนวนข้อที่ต้องการทำ';

        const opts = document.getElementById('count-options');
        opts.innerHTML = '';
        [10, 20, 30, 40].forEach(n => {
            if (n <= total) {
                const b = document.createElement('button');
                b.className = 'count-btn';
                b.innerHTML = n + '<br><span style="font-size:13px;font-weight:500;opacity:0.7">ข้อ</span>';
                b.onclick = () => startQuiz(chapter, n);
                opts.appendChild(b);
            }
        });
        const allBtn = document.createElement('button');
        allBtn.className = 'count-btn';
        allBtn.innerHTML = 'ทั้งหมด<br><span style="font-size:13px;font-weight:500;opacity:0.7">(' + total + ' ข้อ)</span>';
        allBtn.onclick = () => startQuiz(chapter, total);
        opts.appendChild(allBtn);
        showScreen('count');
    }`;

// Since the original pickCount might be slightly different in whitespace, let's use a regex replace for the whole function block
const pickCountRegex = /\/\/ ─── Count Picker ───[\s\S]*?(?=\/\/ ─── Quiz ───)/;

const newPickCount = `// ─── Count Picker ───
    let selectedTimerMinutes = 0;
    function selectTime(mins) {
        selectedTimerMinutes = mins;
        document.getElementById('t-60').style.background = 'var(--option-bg)';
        document.getElementById('t-90').style.background = 'var(--option-bg)';
        document.getElementById('t-120').style.background = 'var(--option-bg)';
        document.getElementById('t-0').style.background = 'var(--option-bg)';
        document.getElementById('t-60').style.borderColor = 'transparent';
        document.getElementById('t-90').style.borderColor = 'transparent';
        document.getElementById('t-120').style.borderColor = 'transparent';
        document.getElementById('t-0').style.borderColor = 'transparent';
        
        const btn = document.getElementById('t-' + mins);
        btn.style.background = 'var(--option-selected-bg)';
        btn.style.borderColor = 'var(--accent)';
    }

    function pickCount(chapter) {
        currentChapter = chapter;
        let total = 0;
        let optsArray = [];
        
        if (chapter === 'all') {
            total = allQuizzes.reduce((acc, q) => acc + (q ? q.length : 0), 0);
            document.getElementById('count-title').innerText = 'สุ่มรวมทุกบท';
            document.getElementById('count-info').innerText = 'มีทั้งหมด ' + total + ' ข้อ เลือกจำนวนข้อที่ต้องการทำ';
            optsArray = [50, 60, 70, 80, 90, 100];
        } else {
            total = allQuizzes[chapter].length;
            document.getElementById('count-title').innerText = 'บทที่ ' + chapter;
            document.getElementById('count-info').innerText = 'มีทั้งหมด ' + total + ' ข้อในบทนี้ เลือกจำนวนข้อที่ต้องการทำ';
            optsArray = [10, 20, 30, 40];
        }

        const opts = document.getElementById('count-options');
        opts.innerHTML = '';
        optsArray.forEach(n => {
            if (n <= total) {
                const b = document.createElement('button');
                b.className = 'count-btn';
                b.innerHTML = n + '<br><span style="font-size:13px;font-weight:500;opacity:0.7">ข้อ</span>';
                b.onclick = () => startQuiz(chapter, n);
                opts.appendChild(b);
            }
        });
        
        if (chapter !== 'all' || total > 100) {
            const allBtn = document.createElement('button');
            allBtn.className = 'count-btn';
            allBtn.innerHTML = 'ทั้งหมด<br><span style="font-size:13px;font-weight:500;opacity:0.7">(' + total + ' ข้อ)</span>';
            allBtn.onclick = () => startQuiz(chapter, total);
            opts.appendChild(allBtn);
        }
        
        selectTime(0); // reset time
        showScreen('count');
    }

    `;
html = html.replace(pickCountRegex, newPickCount);

// 4. Update startQuiz to handle "all" and timer
const startQuizRegex = /function startQuiz\(chapter, count\) \{[\s\S]*?renderQuestion\(\);\s*\}/;
const newStartQuiz = `let quizTimerInterval = null;
    let quizTimeRemaining = 0;

    function startQuiz(chapter, count) {
        currentChapter = chapter;
        let pool = [];
        if (chapter === 'all') {
            for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
                if (allQuizzes[i]) pool = pool.concat(allQuizzes[i]);
            }
        } else {
            pool = [...allQuizzes[chapter]];
        }
        
        pool.sort(() => Math.random() - 0.5);
        currentQuestions = pool.slice(0, count);
        userAnswers = new Array(currentQuestions.length).fill(null);
        currentQuestionIndex = 0;
        startTime = new Date();
        document.getElementById('quiz-title').innerText = chapter === 'all' ? 'สุ่มรวมทุกบท' : 'บทที่ ' + chapter;
        document.getElementById('total-q-num').innerText = currentQuestions.length;
        
        // Timer logic
        if (quizTimerInterval) clearInterval(quizTimerInterval);
        const timerEl = document.getElementById('quiz-timer-display');
        if (selectedTimerMinutes > 0) {
            quizTimeRemaining = selectedTimerMinutes * 60;
            timerEl.style.display = 'inline-block';
            updateTimerDisplay();
            quizTimerInterval = setInterval(() => {
                quizTimeRemaining--;
                updateTimerDisplay();
                if (quizTimeRemaining <= 0) {
                    clearInterval(quizTimerInterval);
                    alert('หมดเวลา!');
                    finishQuiz();
                }
            }, 1000);
        } else {
            timerEl.style.display = 'none';
        }

        showScreen('quiz');
        renderQuestion();
    }
    
    function updateTimerDisplay() {
        const timerEl = document.getElementById('quiz-timer-display');
        const m = Math.floor(quizTimeRemaining / 60).toString().padStart(2, '0');
        const s = (quizTimeRemaining % 60).toString().padStart(2, '0');
        timerEl.innerText = '⏱ ' + m + ':' + s;
        if (quizTimeRemaining < 60) {
            timerEl.style.color = 'var(--danger)';
        } else {
            timerEl.style.color = 'inherit';
        }
    }
    
    function finishQuiz() {
        if (quizTimerInterval) clearInterval(quizTimerInterval);
        const endTime = new Date();
        const durSec = Math.floor((endTime - startTime) / 1000);
        showScreen('results');
        showResultsAndSave(endTime, durSec);
    }`;
html = html.replace(startQuizRegex, newStartQuiz);

// 5. Add timer display to quiz screen
const quizHeaderTarget = `<span id="quiz-title">บทที่ X</span>
                <span>ข้อที่ <strong id="current-q-num">1</strong> / <span id="total-q-num">40</span></span>`;
const quizHeaderReplacement = `<span id="quiz-title">บทที่ X</span>
                <span id="quiz-timer-display" style="display:none; margin-left:10px; font-weight:bold; color:var(--danger)">⏱ 00:00</span>
                <span style="margin-left:auto">ข้อที่ <strong id="current-q-num">1</strong> / <span id="total-q-num">40</span></span>`;
html = html.replace(quizHeaderTarget, quizHeaderReplacement);

// 6. Fix finish button logic in renderQuestion
const renderQuestionRegex = /const endTime = new Date\(\);[\s\S]*?showResultsAndSave\(endTime, durSec\);/;
const newRenderQuestion = `finishQuiz();`;
html = html.replace(renderQuestionRegex, newRenderQuestion);

fs.writeFileSync('public/exam-psychology/index.html', html, 'utf8');
console.log('Done modifying index.html');

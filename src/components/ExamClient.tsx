"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { categories } from '@/data/books';
import { ArrowLeft, CheckCircle, XCircle, Clock, History, AlertCircle, PlayCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface ExamHistory {
  date: string;
  chapterName: string;
  score: number;
  total: number;
  timeSpentPerQuestion: number[];
  userAnswers: (string | null)[];
  questions: Question[];
}

interface ExamClientProps {
  courseId: string; // e.g. Ram1203
}

const THAI_CHOICES = ['ก.', 'ข.', 'ค.', 'ง.', 'จ.', 'ฉ.'];

export default function ExamClient({ courseId }: ExamClientProps) {
  const category = categories.find(c => c.id.toLowerCase() === courseId.toLowerCase());
  
  const [allQuizzes, setAllQuizzes] = useState<(Question[] | null)[]>([]);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [examState, setExamState] = useState<'SELECT_CHAPTER' | 'SELECT_COUNT' | 'TESTING' | 'SUMMARY' | 'HISTORY'>('SELECT_CHAPTER');
  
  // Selection
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | 'ALL'>('ALL');
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [selectedTimerMinutes, setSelectedTimerMinutes] = useState<number>(0);
  
  // Test Data
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Time Tracking
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<number[]>([]);
  const [globalTimeRemaining, setGlobalTimeRemaining] = useState<number | null>(null);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [examHistories, setExamHistories] = useState<ExamHistory[]>([]);
  const [viewingHistoryIndex, setViewingHistoryIndex] = useState<number | null>(null);

  // Load Quizzes and History
  useEffect(() => {
    if (!category) return;
    
    // Load History safely
    try {
      const savedHistory = localStorage.getItem(`examHistory_${courseId}`);
      if (savedHistory) {
        setExamHistories(JSON.parse(savedHistory));
      }
    } catch (e) {}

    const fetchQuizzes = async () => {
      let folderName = `exam-${courseId.toLowerCase()}`;
      if (category.quizUrl) {
         const match = category.quizUrl.match(/^\/([^\/]+)\//);
         if (match) folderName = match[1];
      }
      const results = await Promise.all(
        category.books.map(async (book) => {
          const chMatch = book.id.match(/-ch(\d+)$/);
          if (!chMatch) return null;
          const chNum = chMatch[1];
          try {
            const res = await fetch(`/${folderName}/questions_ch${chNum}.json`);
            if (!res.ok) return null;
            const data = await res.json();
            return Array.isArray(data) && data.length > 0 ? data : null;
          } catch (e) {
            return null;
          }
        })
      );
      setAllQuizzes(results);
      setLoading(false);
    };
    fetchQuizzes();
  }, [category, courseId]);

  // Timers
  useEffect(() => {
    if (examState !== 'TESTING') return;

    const timer = setInterval(() => {
      // Per question time
      setTimeSpentPerQuestion(prev => {
        const newArr = [...prev];
        newArr[currentIndex] = (newArr[currentIndex] || 0) + 1;
        return newArr;
      });

      // Global time
      setGlobalTimeRemaining(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          return 0; // Just return 0, let the other useEffect handle submit
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState, currentIndex]);

  // Auto-submit when time is up
  useEffect(() => {
    if (globalTimeRemaining === 0 && examState === 'TESTING') {
      handleSubmitTest(true);
    }
  }, [globalTimeRemaining, examState]);

  const totalValidQuestions = useMemo(() => allQuizzes.reduce((acc, q) => acc + (q ? q.length : 0), 0), [allQuizzes]);

  // Optimized available questions calculation
  const availableRaw = useMemo(() => {
    if (examState !== 'SELECT_COUNT') return 0;
    if (selectedChapterIndex === 'ALL') {
      return Array.from(new Map(allQuizzes.filter(q => q !== null).flat().map(item => [item.question, item])).values()).length;
    }
    return Array.from(new Map((allQuizzes[selectedChapterIndex as number] || []).map(item => [item.question, item])).values()).length;
  }, [examState, selectedChapterIndex, allQuizzes]);

  if (!category) return <div className="p-8 text-center">ไม่พบรายวิชา</div>;
  if (loading) return <div className="p-8 flex items-center justify-center min-h-screen text-xl">กำลังโหลดข้อสอบ...</div>;


  const startTest = (count: number) => {
    let pool: Question[] = [];
    if (selectedChapterIndex === 'ALL') {
      pool = allQuizzes.filter(q => q !== null).flat() as Question[];
    } else {
      pool = [...(allQuizzes[selectedChapterIndex as number] || [])];
    }
    
    // Deduplicate by question text
    const uniquePoolMap = new Map();
    pool.forEach(q => {
        if (!uniquePoolMap.has(q.question)) {
            uniquePoolMap.set(q.question, q);
        }
    });
    const uniquePool = Array.from(uniquePoolMap.values());
    
    // Shuffle pool
    const shuffled = uniquePool.sort(() => 0.5 - Math.random());
    const finalCount = count === 0 ? pool.length : count;
    const finalQuestions = shuffled.slice(0, finalCount);
    
    setCurrentQuestions(finalQuestions);
    setUserAnswers(new Array(finalQuestions.length).fill(null));
    setTimeSpentPerQuestion(new Array(finalQuestions.length).fill(0));
    setCurrentIndex(0);
    setGlobalTimeRemaining(selectedTimerMinutes > 0 ? selectedTimerMinutes * 60 : null);
    setViewingHistoryIndex(null);
    setExamState('TESTING');
  };

  const handleSubmitTest = (isAuto = false) => {
    setIsSubmitConfirmOpen(false);
    
    // Save to history
    const chapterName = selectedChapterIndex === 'ALL' 
      ? 'สุ่มรวมทุกบท' 
      : category.books[selectedChapterIndex as number].title;
      
    const score = userAnswers.reduce((s, ans, i) => s + (ans === currentQuestions[i]?.answer ? 1 : 0), 0);
    
    const newHistory: ExamHistory = {
      date: new Date().toISOString(),
      chapterName,
      score,
      total: currentQuestions.length,
      timeSpentPerQuestion,
      userAnswers,
      questions: currentQuestions
    };
    
    const updatedHistories = [newHistory, ...examHistories].slice(0, 30); // Keep last 30
    setExamHistories(updatedHistories);
    
    try {
      localStorage.setItem(`examHistory_${courseId}`, JSON.stringify(updatedHistories));
    } catch (e) {}
    
    setViewingHistoryIndex(0); // View the just saved one
    setExamState('SUMMARY');
  };

  const handleSelectAnswer = (optIndex: number, optText: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = optText;
    setUserAnswers(newAnswers);
    // Auto next after slight delay
    if (currentIndex < currentQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(c => Math.min(currentQuestions.length - 1, c + 1)), 400);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0 วิ";
    if (seconds < 60) return `${seconds} วิ`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} นาที ${s} วิ`;
  };

  const formatGlobalTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (examState === 'SELECT_CHAPTER') {
    return (
      <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.title}</h1>
              <p className="text-muted">เลือกบทที่ต้องการทดสอบ</p>
            </div>
            <div className="flex gap-3">
              {examHistories.length > 0 && (
                <button 
                  onClick={() => { setViewingHistoryIndex(null); setExamState('HISTORY'); }}
                  className="flex items-center gap-2 bg-blue-600/20 text-info hover:bg-blue-600/30 px-4 py-2 rounded-full transition font-medium"
                >
                  <History size={18} /> ประวัติการสอบ
                </button>
              )}
              <Link href={`/category/${courseId}`} className="flex items-center gap-2 glass-button hover:bg-white/10 px-4 py-2 rounded-full transition text-sm">
                <ArrowLeft size={16} /> กลับห้องสมุด
              </Link>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 ">บทเรียนทั้งหมด</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.books.map((book, i) => {
                const data = allQuizzes[i];
                const isReady = data !== null && data.length > 0;
                return (
                  <button
                    key={book.id}
                    disabled={!isReady}
                    onClick={() => { setSelectedChapterIndex(i); setExamState('SELECT_COUNT'); }}
                    className={`p-4 rounded-xl text-sm font-medium transition flex flex-col items-center justify-center min-h-[80px] text-center
                      ${isReady ? 'glass-button hover:bg-white/10 text-info' : 'glass-button text-muted cursor-not-allowed opacity-60'}`}
                  >
                    <span>{book.title}</span>
                    {!isReady && <span className="text-xs mt-1">(ยังไม่พร้อม)</span>}
                  </button>
                );
              })}
              
              <button
                disabled={totalValidQuestions === 0}
                onClick={() => { setSelectedChapterIndex('ALL'); setExamState('SELECT_COUNT'); }}
                className="p-4 rounded-xl text-sm font-bold transition bg-blue-600 hover:bg-blue-500 min-h-[80px] flex flex-col items-center justify-center"
              >
                <span>🎲 สุ่มรวมทุกบท</span>
                <span className="text-xs mt-1 font-normal">({totalValidQuestions} ข้อ)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (examState === 'SELECT_COUNT') {
    const available = selectedChapterIndex === 'ALL' ? Math.min(availableRaw, 100) : availableRaw;
      
    const chapterName = selectedChapterIndex === 'ALL' 
      ? 'สุ่มรวมทุกบท' 
      : category.books[selectedChapterIndex as number].title;

    const countOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const validCounts = countOptions.filter(n => n <= available);
    if (available > 0 && !validCounts.includes(available)) validCounts.push(available);



    return (
      <div className="min-h-screen bg-transparent p-4 flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-2">{chapterName}</h2>
          <p className="text-muted mb-6">มีข้อสอบทั้งหมด {available} ข้อ {selectedChapterIndex === 'ALL' && '(จำกัดสูงสุด 100 ข้อ)'}</p>
          
          <div className="mb-6">
            <label className="block text-sm text-muted mb-3 text-left font-medium">ตั้งเวลาสอบ (นาที)</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 60, 90, 120].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedTimerMinutes(m)}
                  className={`p-2 rounded-lg text-sm font-medium transition ${selectedTimerMinutes === m ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'glass-button text-muted hover:bg-white/10'}`}
                >
                  {m === 0 ? 'ไม่จำกัด' : m}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm text-muted mb-3 text-left font-medium">จำนวนข้อที่ต้องการทดสอบ</label>
            <div className="grid grid-cols-2 gap-3">
              {validCounts.map(n => (
                <button 
                  key={n}
                  onClick={() => setSelectedCount(n)}
                  className={`p-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${(selectedCount === n || (!validCounts.includes(selectedCount) && n === validCounts[0])) ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'glass-button text-muted hover:bg-white/10'}`}
                >
                  {n === available && n !== 100 && !countOptions.includes(n) ? `ทั้งหมด (${n})` : `${n} ข้อ`}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => startTest(validCounts.includes(selectedCount) ? selectedCount : validCounts[0])}
            disabled={available === 0}
            className={`w-full p-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${available > 0 ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/30' : 'glass-button text-muted cursor-not-allowed'}`}
          >
            <PlayCircle size={24} /> เริ่มทำข้อสอบ
          </button>
          
          <button 
            onClick={() => setExamState('SELECT_CHAPTER')}
            className="mt-6 text-muted hover:text-[var(--foreground)] text-sm"
          >
            ← กลับไปเลือกบท
          </button>
        </div>
      </div>
    );
  }

  if (examState === 'TESTING') {
    const q = currentQuestions[currentIndex];
    if (!q) {
      return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center p-8 glass-panel rounded-2xl">
             เกิดข้อผิดพลาดในการโหลดข้อสอบ
             <br/><br/>
             <button onClick={() => setExamState('SELECT_CHAPTER')} className="bg-blue-600 px-6 py-2 rounded-lg">กลับไปเลือกบท</button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-transparent flex flex-col lg:flex-row">
        
        <div className="lg:hidden p-4 glass-panel border-b border-[var(--glass-border)] flex justify-between items-center sticky top-0 z-50">
          <div className="font-bold text-info flex items-center gap-2"><BookOpen size={18}/> ข้อ {currentIndex + 1}/{currentQuestions.length}</div>
          {globalTimeRemaining !== null && (
            <div className={`font-bold flex items-center gap-2 ${globalTimeRemaining < 60 ? 'text-danger animate-pulse' : 'text-info'}`}>
              <Clock size={16} /> {formatGlobalTime(globalTimeRemaining)}
            </div>
          )}
        </div>

        <div className="hidden lg:flex lg:w-1/3 xl:w-[35%] glass-panel border-r border-[var(--glass-border)] flex-col h-screen sticky top-0 overflow-hidden shrink-0 shadow-2xl z-40">
          <div className="p-5 border-b border-[var(--glass-border)] font-bold text-lg flex items-center justify-between text-info">
            <div className="flex items-center gap-2"><BookOpen size={20} /> คำตอบของคุณ</div>
            <div className="text-sm text-muted bg-black/20 px-2 py-1 rounded">{userAnswers.filter(a => a !== null).length}/{currentQuestions.length}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 content-start custom-scrollbar">
            {currentQuestions.map((_, i) => {
              const ansText = userAnswers[i];
              const isCurrent = currentIndex === i;
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left p-2 rounded-xl flex flex-col gap-1 transition border ${
                    isCurrent 
                      ? 'glass-button active text-info' 
                      : ansText 
                        ? 'bg-green-500/20 border-green-500/40 backdrop-blur-md hover:bg-green-500/30' 
                        : 'glass-button border-transparent hover:glass-button'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className={ansText ? 'text-success font-bold' : 'text-muted'}>ข้อ {i + 1}</span>
                    {ansText && <CheckCircle size={12} className="text-success" />}
                  </div>
                  <div className={`text-sm line-clamp-2 leading-snug ${ansText ? '' : 'text-muted'}`}>
                    {ansText ? ansText : 'ยังไม่ได้ตอบ'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative w-full h-full lg:h-screen overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto p-4 md:p-8 flex-1 flex flex-col pb-32">
            
            <div className="hidden lg:flex justify-between items-center mb-8 text-sm text-muted glass-panel p-4 rounded-xl shadow-sm border border-[var(--glass-border)]">
              <button onClick={() => setExamState('SELECT_CHAPTER')} className="hover:text-[var(--foreground)] transition flex items-center gap-1">← กลับหน้าเลือกข้อสอบ</button>
              
              <div className="flex items-center gap-4">
                {globalTimeRemaining !== null && (
                  <div className={`font-bold text-lg flex items-center gap-2 px-3 py-1 rounded-lg glass-panel ${globalTimeRemaining < 60 ? 'text-danger animate-pulse' : 'text-info'}`}>
                    <Clock size={18} /> {formatGlobalTime(globalTimeRemaining)}
                  </div>
                )}
                <span className="font-medium px-3 py-1 glass-button rounded-lg">ข้อ {currentIndex + 1} / {currentQuestions.length}</span>
              </div>
            </div>
            
            <div className="mb-8 text-xl md:text-2xl font-medium leading-relaxed glass-panel p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--glass-border)]/50">
              <span className="text-blue-500 mr-2 font-bold">{currentIndex + 1}.</span> {q.question}
            </div>
            
            <div className="space-y-4 mb-12">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i, opt)}
                  className={`w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 ${
                    userAnswers[currentIndex] === opt 
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                      : 'glass-panel hover:glass-button hover:border-[var(--glass-border)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-colors mt-0.5 ${
                      userAnswers[currentIndex] === opt 
                        ? 'bg-blue-500' 
                        : 'glass-button text-muted'
                    }`}>
                      {THAI_CHOICES[i]?.replace('.', '') || (i+1)}
                    </div>
                    <span className="text-base md:text-lg pt-1 leading-relaxed">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-auto flex justify-between items-center pt-8 border-t border-[var(--glass-border)]/50">
              <button 
                onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                disabled={currentIndex === 0}
                className={`px-6 py-3 rounded-xl font-medium transition ${currentIndex === 0 ? 'opacity-0 cursor-default pointer-events-none' : 'glass-panel hover:glass-button border border-[var(--glass-border)]'}`}
              >
                ← ข้อก่อนหน้า
              </button>
              
              {currentIndex === currentQuestions.length - 1 ? (
                <button 
                  onClick={() => setIsSubmitConfirmOpen(true)}
                  className="px-8 py-3 rounded-xl bg-green-500 hover:bg-green-400 font-bold text-gray-900 transition shadow-lg shadow-green-500/20"
                >
                  ส่งคำตอบ
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIndex(c => Math.min(currentQuestions.length - 1, c + 1))}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-600/20"
                >
                  ข้อถัดไป →
                </button>
              )}
            </div>
          </div>
          
          <div className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3">
             <button 
                onClick={() => {
                  const el = document.getElementById('mobile-sidebar');
                  if (el) el.classList.toggle('hidden');
                }}
                className="w-14 h-14 glass-button rounded-full flex items-center justify-center shadow-2xl border border-[var(--glass-border)]"
              >
                <BookOpen size={24} />
             </button>
          </div>

          <div id="mobile-sidebar" className="hidden lg:hidden fixed inset-0 z-50 bg-modal flex flex-col">
            <div className="p-4 border-b border-[var(--glass-border)] flex justify-between items-center glass-panel">
              <div className="font-bold text-lg text-info flex items-center gap-2"><BookOpen size={20} /> คำตอบของคุณ</div>
              <button onClick={() => document.getElementById('mobile-sidebar')?.classList.add('hidden')} className="p-2 glass-button rounded-lg"><XCircle size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
              {currentQuestions.map((_, i) => {
                const ansText = userAnswers[i];
                const isCurrent = currentIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => { setCurrentIndex(i); document.getElementById('mobile-sidebar')?.classList.add('hidden'); }}
                    className={`w-full text-left p-2 rounded-xl flex flex-col gap-1 transition border ${
                      isCurrent 
                        ? 'glass-button active text-info' 
                        : ansText 
                          ? 'bg-green-500/20 border-green-500/40 backdrop-blur-md hover:bg-green-500/30' 
                          : 'glass-button border-transparent hover:glass-button'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={ansText ? 'text-success font-bold' : 'text-muted'}>ข้อ {i + 1}</span>
                      {ansText && <CheckCircle size={12} className="text-success" />}
                    </div>
                    <div className={`text-sm line-clamp-2 leading-snug ${ansText ? '' : 'text-muted'}`}>
                      {ansText ? ansText : 'ยังไม่ได้ตอบ'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {isSubmitConfirmOpen && (
          <div className="fixed inset-0 bg-modal flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="glass-panel p-8 rounded-3xl max-w-sm w-full text-center border border-[var(--glass-border)] shadow-2xl">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3">ยืนยันการส่งคำตอบ?</h3>
              <p className="text-muted mb-8 text-lg">คุณทำไปแล้ว <span className="text-[var(--foreground)] font-bold text-xl">{userAnswers.filter(a => a !== null).length}</span> จาก <span className="text-[var(--foreground)] font-bold text-xl">{currentQuestions.length}</span> ข้อ</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleSubmitTest(false)} className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition shadow-lg shadow-blue-600/20">ส่งคำตอบเลย</button>
                <button onClick={() => setIsSubmitConfirmOpen(false)} className="w-full p-4 rounded-xl bg-transparent hover:glass-button text-muted font-medium transition">ทบทวนอีกครั้ง</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (examState === 'SUMMARY' || examState === 'HISTORY') {
    const historyData = viewingHistoryIndex !== null ? examHistories[viewingHistoryIndex] : null;
    
    if (examState === 'HISTORY' && viewingHistoryIndex === null) {
      return (
        <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3"><History className="text-blue-500"/> ประวัติการสอบ</h2>
              <button onClick={() => setExamState('SELECT_CHAPTER')} className="text-muted hover:text-[var(--foreground)] flex items-center gap-1 transition">
                <ArrowLeft size={16} /> กลับ
              </button>
            </div>
            
            {examHistories.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl text-center text-muted">
                <Clock size={48} className="mx-auto mb-4 opacity-20" />
                <p>ยังไม่มีประวัติการสอบ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {examHistories.map((hist, i) => (
                  <div key={i} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between border border-[var(--glass-border)] hover:border-[var(--glass-border)] transition">
                    <div className="mb-4 md:mb-0">
                      <div className="text-sm text-muted mb-1">{new Date(hist.date).toLocaleString('th-TH')}</div>
                      <div className="text-lg font-bold">{hist.chapterName}</div>
                      <div className="text-sm text-muted mt-1 flex gap-4">
                        <span>เวลาเฉลี่ย: {formatTime(Math.floor(hist.timeSpentPerQuestion.reduce((a,b)=>a+b,0)/hist.total))} / ข้อ</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className={`text-3xl font-black ${hist.score / hist.total >= 0.5 ? 'text-success' : 'text-danger'}`}>
                          {hist.score}
                        </div>
                        <div className="text-xs text-muted">จาก {hist.total}</div>
                      </div>
                      <button 
                        onClick={() => setViewingHistoryIndex(i)}
                        className="px-6 py-2 rounded-xl glass-button hover:bg-white/10 transition font-medium"
                      >
                        ดูเฉลย
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (!historyData) return null;

    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-7xl relative">
          <div className="flex justify-end mb-6 md:absolute md:top-0 md:right-16 lg:right-0 z-10">
            <button 
              onClick={() => {setViewingHistoryIndex(null); setExamState('HISTORY');}} 
              className="flex items-center gap-2 px-4 py-2 glass-button rounded-xl transition font-medium"
            >
              <History size={18}/> กลับไปประวัติ
            </button>
          </div>
          <div className="text-center mb-12 pt-4 md:pt-0">
            <h2 className="text-4xl font-bold mb-4">{examState === 'SUMMARY' ? 'ผลการทดสอบ' : 'เฉลยข้อสอบ'}</h2>
            <div className="inline-block glass-panel px-10 py-6 rounded-3xl shadow-xl border border-[var(--glass-border)]">
              <div className="text-muted mb-2">{historyData.chapterName}</div>
              <div className={`text-6xl font-black mb-2 ${historyData.score / historyData.total >= 0.5 ? 'text-success' : 'text-danger'}`}>
                {historyData.score} <span className="text-3xl text-muted">/ {historyData.total}</span>
              </div>
              <div className="text-muted text-sm flex gap-4 justify-center">
                <span>ความแม่นยำ: {Math.round((historyData.score / historyData.total) * 100)}%</span>
                <span>•</span>
                <span>เวลาทำรวม: {formatTime(historyData.timeSpentPerQuestion.reduce((a,b)=>a+b,0))}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyData.questions.map((q, i) => {
              const uAns = historyData.userAnswers[i];
              const isCorrect = uAns === q.answer;
              const isUnanswered = uAns === null;

              return (
                <div key={i} className={`p-6 rounded-2xl border flex flex-col h-full shadow-md ${isCorrect ? 'bg-green-500/10 border-green-500/30 backdrop-blur-md' : (isUnanswered ? 'glass-panel' : 'bg-red-500/10 border-red-500/30 backdrop-blur-md')}`}>
                  <div className="flex justify-between items-start mb-4 gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      {isCorrect ? <CheckCircle className="text-success shrink-0" size={20}/> : <XCircle className="text-danger shrink-0" size={20}/>}
                      <span className="font-bold ">ข้อ {i + 1}</span>
                    </div>
                    <div className="text-xs bg-black/30 px-2 py-1 rounded text-muted flex items-center gap-1">
                      <Clock size={12}/> {formatTime(historyData.timeSpentPerQuestion[i] || 0)}
                    </div>
                  </div>
                  
                  <div className="text-base font-medium mb-5  flex-1">{q.question}</div>
                  
                  <div className="space-y-2 mt-auto">
                    {q.options.map((opt, j) => {
                      let optClass = "p-3 rounded-xl border text-sm transition-colors ";
                      let icon = null;
                      if (opt === q.answer) {
                        optClass += "bg-green-500/20 border-green-500 text-success font-medium";
                        icon = <CheckCircle size={14} className="shrink-0" />;
                      } else if (opt === uAns) {
                        optClass += "bg-red-500/20 border-red-500 text-danger";
                        icon = <XCircle size={14} className="shrink-0" />;
                      } else {
                        optClass += "bg-black/20 border-transparent text-muted";
                      }
                      return (
                        <div key={j} className={optClass + " flex items-start gap-2"}>
                          <span className="font-bold text-muted pt-0.5 opacity-60">{THAI_CHOICES[j] || (j+1)}</span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {icon && <div className="mt-0.5">{icon}</div>}
                        </div>
                      );
                    })}
                  </div>
                  
                  {q.explanation && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-info text-sm">
                      <strong>คำอธิบาย:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-center gap-4 pb-12">
            <button 
              onClick={() => setExamState('SELECT_CHAPTER')}
              className="px-8 py-4 rounded-xl glass-button hover:bg-white/10 font-bold text-lg transition flex items-center justify-center gap-2"
            >
              ทำแบบทดสอบใหม่
            </button>
            <button 
              onClick={() => {setViewingHistoryIndex(null); setExamState('HISTORY');}}
              className="px-8 py-4 rounded-xl bg-blue-600/20 text-info hover:bg-blue-600/30 font-bold text-lg transition flex items-center justify-center gap-2"
            >
              <History size={20} /> กลับไปประวัติ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

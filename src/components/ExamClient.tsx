"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  
  useEffect(() => {
    if (globalTimeRemaining === 0 && examState === 'TESTING') {
      handleSubmitTest(true);
    }
  }, [globalTimeRemaining, examState]);

  if (!category) return;
    
    // Load History
    const savedHistory = localStorage.getItem(`examHistory_${courseId}`);
    if (savedHistory) {
      try {
        setExamHistories(JSON.parse(savedHistory));
      } catch (e) {}
    }

    const fetchQuizzes = async () => {
      const folderName = `exam-${courseId.toLowerCase()}`;
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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState, currentIndex]);


  useEffect(() => {
    if (globalTimeRemaining === 0 && examState === 'TESTING') {
      handleSubmitTest(true);
    }
  }, [globalTimeRemaining, examState]);

  if (!category) return <div className="p-8 text-white text-center">ไม่พบรายวิชา</div>;
  if (loading) return <div className="p-8 flex items-center justify-center min-h-screen text-white text-xl">กำลังโหลดข้อสอบ...</div>;

  const totalValidQuestions = allQuizzes.reduce((acc, q) => acc + (q ? q.length : 0), 0);

  const startTest = (count: number) => {
    let pool: Question[] = [];
    if (selectedChapterIndex === 'ALL') {
      pool = allQuizzes.filter(q => q !== null).flat() as Question[];
    } else {
      pool = [...(allQuizzes[selectedChapterIndex as number] || [])];
    }
    
    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    // Limit to 100 max if count is 0 (ALL)
    const finalCount = count === 0 ? Math.min(pool.length, 100) : count;
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
      
    const score = userAnswers.reduce((s, ans, i) => s + (ans === currentQuestions[i].answer ? 1 : 0), 0);
    
    const newHistory: ExamHistory = {
      date: new Date().toISOString(),
      chapterName,
      score,
      total: currentQuestions.length,
      timeSpentPerQuestion,
      userAnswers,
      questions: currentQuestions
    };
    
    const updatedHistories = [newHistory, ...examHistories].slice(0, 20); // Keep last 20
    setExamHistories(updatedHistories);
    localStorage.setItem(`examHistory_${courseId}`, JSON.stringify(updatedHistories));
    
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
    if (seconds < 60) return `${seconds} วิ`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} นาที ${s} วิ`;
  };

  const formatGlobalTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (examState === 'SELECT_CHAPTER') {
    return (
      <div className="min-h-screen bg-[#0f1115] text-white p-4 md:p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.title}</h1>
              <p className="text-gray-400">เลือกบทที่ต้องการทดสอบ</p>
            </div>
            <div className="flex gap-3">
              {examHistories.length > 0 && (
                <button 
                  onClick={() => setExamState('HISTORY')}
                  className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-4 py-2 rounded-full transition font-medium"
                >
                  <History size={18} /> ประวัติการสอบ
                </button>
              )}
              <Link href={`/category/${courseId}`} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition text-sm">
                <ArrowLeft size={16} /> กลับห้องสมุด
              </Link>
            </div>
          </div>

          <div className="bg-[#1c1f26] p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">บทเรียนทั้งหมด</h2>
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
                      ${isReady ? 'bg-[#2a2d35] hover:bg-[#3a3d45] text-blue-400' : 'bg-[#202228] text-gray-600 cursor-not-allowed opacity-60'}`}
                  >
                    <span>{book.title}</span>
                    {!isReady && <span className="text-xs mt-1">(ยังไม่พร้อม)</span>}
                  </button>
                );
              })}
              
              <button
                disabled={totalValidQuestions === 0}
                onClick={() => { setSelectedChapterIndex('ALL'); setExamState('SELECT_COUNT'); }}
                className="p-4 rounded-xl text-sm font-bold transition bg-blue-600 hover:bg-blue-500 text-white min-h-[80px] flex flex-col items-center justify-center"
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
    const availableRaw = selectedChapterIndex === 'ALL' 
      ? totalValidQuestions 
      : (allQuizzes[selectedChapterIndex as number]?.length || 0);
    const available = selectedChapterIndex === 'ALL' ? Math.min(availableRaw, 100) : availableRaw;
      
    const chapterName = selectedChapterIndex === 'ALL' 
      ? 'สุ่มรวมทุกบท' 
      : category.books[selectedChapterIndex as number].title;

    const countOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const validCounts = countOptions.filter(n => n <= available);
    if (available > 0 && !validCounts.includes(available)) validCounts.push(available); // Add exact max if not in list

    // Default to max if available < 10, else 10
    useEffect(() => {
      if (examState === 'SELECT_COUNT' && validCounts.length > 0) {
        if (!validCounts.includes(selectedCount)) {
          setSelectedCount(validCounts[0]);
        }
      }
    }, [examState, validCounts]);

    return (
      <div className="min-h-screen bg-[#0f1115] text-white p-4 flex items-center justify-center">
        <div className="bg-[#1c1f26] p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-2">{chapterName}</h2>
          <p className="text-gray-400 mb-6">มีข้อสอบทั้งหมด {available} ข้อ {selectedChapterIndex === 'ALL' && '(สูงสุด 100 ข้อ)'}</p>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-3 text-left font-medium">ตั้งเวลาสอบ (นาที)</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 60, 90, 120].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedTimerMinutes(m)}
                  className={`p-2 rounded-lg text-sm font-medium transition ${selectedTimerMinutes === m ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-[#2a2d35] text-gray-400 hover:bg-[#3a3d45]'}`}
                >
                  {m === 0 ? 'ไม่จำกัด' : m}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-3 text-left font-medium">จำนวนข้อที่ต้องการทดสอบ</label>
            <div className="grid grid-cols-2 gap-3">
              {validCounts.map(n => (
                <button 
                  key={n}
                  onClick={() => setSelectedCount(n)}
                  className={`p-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${selectedCount === n ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-[#2a2d35] text-gray-400 hover:bg-[#3a3d45]'}`}
                >
                  {n === available && n !== 100 && !countOptions.includes(n) ? `ทั้งหมด (${n})` : `${n} ข้อ`}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => startTest(selectedCount)}
            disabled={available === 0}
            className={`w-full p-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${available > 0 ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30' : 'bg-[#202228] text-gray-600 cursor-not-allowed'}`}
          >
            <PlayCircle size={24} /> เริ่มทำข้อสอบ
          </button>
          
          <button 
            onClick={() => setExamState('SELECT_CHAPTER')}
            className="mt-6 text-gray-400 hover:text-white text-sm"
          >
            ← กลับไปเลือกบท
          </button>
        </div>
      </div>
    );
  }
if (examState === 'TESTING') {
    const q = currentQuestions[currentIndex];
    
    return (
      <div className="min-h-screen bg-[#0f1115] text-white flex">
        
        {/* Left Sidebar (Selected Options) */}
        <div className="hidden lg:flex w-64 bg-[#1c1f26] border-r border-gray-800 flex-col h-screen sticky top-0 overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-800 font-bold text-lg flex items-center gap-2 text-blue-400">
            <BookOpen size={20} /> คำตอบของคุณ
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {currentQuestions.map((_, i) => {
              const ansText = userAnswers[i];
              let shortAns = "-";
              if (ansText) {
                const optIdx = currentQuestions[i].options.indexOf(ansText);
                if (optIdx !== -1) shortAns = THAI_CHOICES[optIdx];
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left p-2 rounded flex items-center justify-between text-sm transition ${currentIndex === i ? 'bg-blue-600/20 text-blue-400 font-bold' : 'hover:bg-[#2a2d35]'}`}
                >
                  <span className="text-gray-400">ข้อ {i + 1}</span>
                  <span className={`font-medium ${ansText ? 'text-green-400' : 'text-gray-600'}`}>{shortAns}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative w-full">
          <div className="w-full max-w-3xl mx-auto p-4 flex-1 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 text-sm text-gray-400 bg-[#1c1f26] p-4 rounded-xl shadow-sm">
              <button onClick={() => setExamState('SELECT_CHAPTER')} className="hover:text-white transition flex items-center gap-1">← ออก</button>
              
              <div className="flex items-center gap-4">
                {globalTimeRemaining !== null && (
                  <div className={`font-bold text-lg flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-900 ${globalTimeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                    <Clock size={18} /> {formatGlobalTime(globalTimeRemaining)}
                  </div>
                )}
                <span className="font-medium px-3 py-1 bg-gray-800 rounded-lg">ข้อ {currentIndex + 1} / {currentQuestions.length}</span>
              </div>
            </div>
            
            {/* Question */}
            <div className="mb-8 text-xl md:text-2xl font-medium leading-relaxed bg-[#1c1f26] p-6 rounded-2xl shadow-sm border border-gray-800/50">
              <span className="text-blue-500 mr-2">{currentIndex + 1}.</span> {q.question}
            </div>
            
            {/* Options */}
            <div className="space-y-3 mb-12">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i, opt)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    userAnswers[currentIndex] === opt 
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'border-transparent bg-[#1c1f26] hover:bg-[#2a2d35] hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-colors ${
                      userAnswers[currentIndex] === opt 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {THAI_CHOICES[i]?.replace('.', '')}
                    </div>
                    <span className="text-base pt-1">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Footer Controls */}
            <div className="mt-auto flex justify-between items-center pb-28">
              <button 
                onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                disabled={currentIndex === 0}
                className={`px-6 py-3 rounded-xl font-medium transition ${currentIndex === 0 ? 'opacity-0 cursor-default' : 'bg-[#1c1f26] hover:bg-[#2a2d35]'}`}
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

          {/* Navigation Grid (Bottom Mobile) */}
          <div className="fixed bottom-0 w-full lg:w-[calc(100%-16rem)] bg-[#1c1f26] border-t border-gray-800 p-4 z-40 lg:right-0">
            <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto px-2 pb-2">
              {currentQuestions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all flex items-center justify-center ${
                    currentIndex === i ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1c1f26]' : ''
                  } ${userAnswers[i] ? 'bg-green-600/30 text-green-400 border border-green-600/50' : 'bg-[#2a2d35] hover:bg-[#3a3d45] text-gray-400'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Modal */}
        {isSubmitConfirmOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1c1f26] p-8 rounded-2xl max-w-sm w-full text-center border border-gray-800 shadow-2xl">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">ยืนยันการส่งคำตอบ?</h3>
              <p className="text-gray-400 mb-8">คุณทำไปแล้ว <span className="text-white font-bold">{userAnswers.filter(a => a !== null).length}</span> จาก <span className="text-white font-bold">{currentQuestions.length}</span> ข้อ</p>
              <div className="flex gap-4">
                <button onClick={() => setIsSubmitConfirmOpen(false)} className="flex-1 p-3 rounded-xl bg-[#2a2d35] hover:bg-[#3a3d45] font-medium transition">ทบทวนอีกครั้ง</button>
                <button onClick={() => handleSubmitTest(false)} className="flex-1 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition">ส่งคำตอบเลย</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SUMMARY & HISTORY VIEWER
  if (examState === 'SUMMARY' || examState === 'HISTORY') {
    const historyData = viewingHistoryIndex !== null ? examHistories[viewingHistoryIndex] : null;
    
    // If we are in HISTORY mode but haven't selected a specific history yet, show the list
    if (examState === 'HISTORY' && viewingHistoryIndex === null) {
      return (
        <div className="min-h-screen bg-[#0f1115] text-white p-4 md:p-8 font-sans">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3"><History className="text-blue-500"/> ประวัติการสอบ</h2>
              <button onClick={() => setExamState('SELECT_CHAPTER')} className="text-gray-400 hover:text-white flex items-center gap-1 transition">
                <ArrowLeft size={16} /> กลับ
              </button>
            </div>
            
            {examHistories.length === 0 ? (
              <div className="bg-[#1c1f26] p-12 rounded-2xl text-center text-gray-500">
                <Clock size={48} className="mx-auto mb-4 opacity-20" />
                <p>ยังไม่มีประวัติการสอบ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {examHistories.map((hist, i) => (
                  <div key={i} className="bg-[#1c1f26] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between border border-gray-800 hover:border-gray-700 transition">
                    <div className="mb-4 md:mb-0">
                      <div className="text-sm text-gray-400 mb-1">{new Date(hist.date).toLocaleString('th-TH')}</div>
                      <div className="text-lg font-bold text-white">{hist.chapterName}</div>
                      <div className="text-sm text-gray-400 mt-1 flex gap-4">
                        <span>เวลาเฉลี่ย: {formatTime(Math.floor(hist.timeSpentPerQuestion.reduce((a,b)=>a+b,0)/hist.total))} / ข้อ</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className={`text-3xl font-black ${hist.score / hist.total >= 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                          {hist.score}
                        </div>
                        <div className="text-xs text-gray-500">จาก {hist.total}</div>
                      </div>
                      <button 
                        onClick={() => setViewingHistoryIndex(i)}
                        className="px-6 py-2 rounded-xl bg-[#2a2d35] hover:bg-[#3a3d45] transition font-medium"
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
      <div className="min-h-screen bg-[#0f1115] text-white flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{examState === 'SUMMARY' ? 'ผลการทดสอบ' : 'เฉลยข้อสอบ'}</h2>
            <div className="inline-block bg-[#1c1f26] px-10 py-6 rounded-3xl shadow-xl border border-gray-800">
              <div className="text-gray-400 mb-2">{historyData.chapterName}</div>
              <div className={`text-6xl font-black mb-2 ${historyData.score / historyData.total >= 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                {historyData.score} <span className="text-3xl text-gray-500">/ {historyData.total}</span>
              </div>
              <div className="text-gray-400 text-sm flex gap-4 justify-center">
                <span>ความแม่นยำ: {Math.round((historyData.score / historyData.total) * 100)}%</span>
                <span>•</span>
                <span>เวลาทำรวม: {formatTime(historyData.timeSpentPerQuestion.reduce((a,b)=>a+b,0))}</span>
              </div>
            </div>
          </div>

          {/* GRID 3 COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyData.questions.map((q, i) => {
              const uAns = historyData.userAnswers[i];
              const isCorrect = uAns === q.answer;
              const isUnanswered = uAns === null;

              return (
                <div key={i} className={`p-6 rounded-2xl border flex flex-col h-full shadow-md ${isCorrect ? 'border-green-500/20 bg-[#16221c]' : (isUnanswered ? 'border-gray-700 bg-[#1c1f26]' : 'border-red-500/20 bg-[#24171a]')}`}>
                  <div className="flex justify-between items-start mb-4 gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      {isCorrect ? <CheckCircle className="text-green-500 shrink-0" size={20}/> : <XCircle className="text-red-500 shrink-0" size={20}/>}
                      <span className="font-bold text-gray-300">ข้อ {i + 1}</span>
                    </div>
                    <div className="text-xs bg-black/30 px-2 py-1 rounded text-gray-400 flex items-center gap-1">
                      <Clock size={12}/> {formatTime(historyData.timeSpentPerQuestion[i] || 0)}
                    </div>
                  </div>
                  
                  <div className="text-base font-medium mb-5 text-gray-100 flex-1">{q.question}</div>
                  
                  <div className="space-y-2 mt-auto">
                    {q.options.map((opt, j) => {
                      let optClass = "p-3 rounded-xl border text-sm transition-colors ";
                      let icon = null;
                      if (opt === q.answer) {
                        optClass += "bg-green-500/20 border-green-500 text-green-300 font-medium";
                        icon = <CheckCircle size={14} className="shrink-0" />;
                      } else if (opt === uAns) {
                        optClass += "bg-red-500/20 border-red-500 text-red-300";
                        icon = <XCircle size={14} className="shrink-0" />;
                      } else {
                        optClass += "bg-black/20 border-transparent text-gray-500";
                      }
                      return (
                        <div key={j} className={optClass + " flex items-start gap-2"}>
                          <span className="font-bold text-gray-500 pt-0.5">{THAI_CHOICES[j]}</span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {icon && <div className="mt-0.5">{icon}</div>}
                        </div>
                      );
                    })}
                  </div>
                  
                  {q.explanation && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-sm">
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
              className="px-8 py-4 rounded-xl bg-[#2a2d35] hover:bg-[#3a3d45] font-bold text-lg transition flex items-center justify-center gap-2"
            >
              ทำแบบทดสอบใหม่
            </button>
            
          </div>
        </div>
      </div>
    );
  }

  return null;
}

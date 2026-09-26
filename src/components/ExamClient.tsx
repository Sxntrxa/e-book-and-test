"use client";

import React, { useState, useEffect } from 'react';
import { categories } from '@/data/books';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface ExamClientProps {
  courseId: string; // e.g. Ram1203
}

export default function ExamClient({ courseId }: ExamClientProps) {
  const category = categories.find(c => c.id.toLowerCase() === courseId.toLowerCase());
  
  const [allQuizzes, setAllQuizzes] = useState<(Question[] | null)[]>([]);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [examState, setExamState] = useState<'SELECT_CHAPTER' | 'SELECT_COUNT' | 'TESTING' | 'SUMMARY'>('SELECT_CHAPTER');
  
  // Selection
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | 'ALL'>('ALL');
  const [selectedCount, setSelectedCount] = useState<number>(10);
  
  // Test Data
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // UI State
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);

  useEffect(() => {
    if (!category) return;
    
    const fetchQuizzes = async () => {
      const folderName = `exam-${courseId.toLowerCase()}`;
      const results = await Promise.all(
        category.books.map(async (book) => {
          // extract ch1 from Ram1203-ch1
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

  if (!category) return <div className="p-8 text-white text-center">ไม่พบรายวิชา</div>;
  if (loading) return <div className="p-8 flex items-center justify-center min-h-screen text-white text-xl">กำลังโหลดข้อสอบ...</div>;

  const totalValidQuestions = allQuizzes.reduce((acc, q) => acc + (q ? q.length : 0), 0);

  // LOGICAL ORDER SORTING
  // For Ram1203 specifically, we had a display order. To make it generic, we could just display them as they are in books.ts, 
  // because books.ts already dictates an order! Let's just use the books.ts order (which might be alphabetical).
  // Wait, I can just map them in their array order!

  const startTest = (count: number) => {
    let pool: Question[] = [];
    if (selectedChapterIndex === 'ALL') {
      pool = allQuizzes.filter(q => q !== null).flat() as Question[];
    } else {
      pool = [...(allQuizzes[selectedChapterIndex as number] || [])];
    }
    
    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const finalQuestions = shuffled.slice(0, count === 0 ? pool.length : count);
    
    setCurrentQuestions(finalQuestions);
    setUserAnswers(new Array(finalQuestions.length).fill(null));
    setCurrentIndex(0);
    setExamState('TESTING');
  };

  const handleSelectAnswer = (ans: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = ans;
    setUserAnswers(newAnswers);
    // Auto next
    if (currentIndex < currentQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(c => c + 1), 300);
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, ans, i) => {
      return ans === currentQuestions[i].answer ? score + 1 : score;
    }, 0);
  };

  if (examState === 'SELECT_CHAPTER') {
    return (
      <div className="min-h-screen bg-[#0f1115] text-white p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.title}</h1>
              <p className="text-gray-400">เลือกบทที่ต้องการทดสอบ</p>
            </div>
            <Link href={`/category/${courseId}`} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition text-sm">
              <ArrowLeft size={16} /> กลับห้องสมุด
            </Link>
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
    const available = selectedChapterIndex === 'ALL' 
      ? totalValidQuestions 
      : (allQuizzes[selectedChapterIndex as number]?.length || 0);
      
    const chapterName = selectedChapterIndex === 'ALL' 
      ? 'สุ่มรวมทุกบท' 
      : category.books[selectedChapterIndex as number].title;

    return (
      <div className="min-h-screen bg-[#0f1115] text-white p-4 flex items-center justify-center">
        <div className="bg-[#1c1f26] p-8 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2">{chapterName}</h2>
          <p className="text-gray-400 mb-8">มีข้อสอบทั้งหมด {available} ข้อ</p>
          
          <div className="space-y-3">
            {[10, 20, 30].map(n => (
              <button 
                key={n}
                disabled={available < n}
                onClick={() => startTest(n)}
                className={`w-full p-4 rounded-xl font-medium transition ${available >= n ? 'bg-[#2a2d35] hover:bg-blue-600' : 'bg-[#202228] text-gray-600 cursor-not-allowed'}`}
              >
                ทดสอบ {n} ข้อ
              </button>
            ))}
            <button 
              onClick={() => startTest(0)}
              className="w-full p-4 rounded-xl font-medium transition bg-blue-600 hover:bg-blue-500"
            >
              ทดสอบทั้งหมด ({available} ข้อ)
            </button>
          </div>
          
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
      <div className="min-h-screen bg-[#0f1115] text-white flex flex-col items-center">
        <div className="w-full max-w-3xl p-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-400 bg-[#1c1f26] p-4 rounded-xl">
            <button onClick={() => setExamState('SELECT_CHAPTER')} className="hover:text-white transition">← ออก</button>
            <span>ข้อ {currentIndex + 1} / {currentQuestions.length}</span>
          </div>
          
          {/* Question */}
          <div className="mb-8 text-xl md:text-2xl font-medium leading-relaxed">
            {currentIndex + 1}. {q.question}
          </div>
          
          {/* Options */}
          <div className="space-y-3 mb-12">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectAnswer(opt)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  userAnswers[currentIndex] === opt 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-transparent bg-[#1c1f26] hover:bg-[#2a2d35]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${userAnswers[currentIndex] === opt ? 'border-blue-500' : 'border-gray-500'}`}>
                    {userAnswers[currentIndex] === opt && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                  </div>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Footer Controls */}
          <div className="mt-auto flex justify-between items-center pb-24">
            <button 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-xl transition ${currentIndex === 0 ? 'opacity-0' : 'bg-[#1c1f26] hover:bg-[#2a2d35]'}`}
            >
              ← ก่อนหน้า
            </button>
            
            {currentIndex === currentQuestions.length - 1 ? (
              <button 
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="px-8 py-3 rounded-xl bg-green-500 hover:bg-green-400 font-bold text-gray-900 transition"
              >
                ส่งคำตอบ
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIndex(c => Math.min(currentQuestions.length - 1, c + 1))}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium"
              >
                ถัดไป →
              </button>
            )}
          </div>
        </div>

        {/* Navigation Grid (Bottom) */}
        <div className="fixed bottom-0 w-full bg-[#1c1f26] border-t border-gray-800 p-4 z-40">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
            {currentQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                  currentIndex === i ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1c1f26]' : ''
                } ${userAnswers[i] ? 'bg-green-600/30 text-green-400 border border-green-600/50' : 'bg-[#2a2d35] hover:bg-[#3a3d45]'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Modal */}
        {isSubmitConfirmOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1c1f26] p-8 rounded-2xl max-w-sm w-full text-center">
              <h3 className="text-xl font-bold mb-2">ยืนยันการส่งคำตอบ?</h3>
              <p className="text-gray-400 mb-6">คุณตอบไปแล้ว {userAnswers.filter(a => a !== null).length} จาก {currentQuestions.length} ข้อ</p>
              <div className="flex gap-4">
                <button onClick={() => setIsSubmitConfirmOpen(false)} className="flex-1 p-3 rounded-xl bg-[#2a2d35] hover:bg-[#3a3d45] transition">ยกเลิก</button>
                <button onClick={() => { setIsSubmitConfirmOpen(false); setExamState('SUMMARY'); }} className="flex-1 p-3 rounded-xl bg-green-500 hover:bg-green-400 text-gray-900 font-bold transition">ส่งเลย</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (examState === 'SUMMARY') {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-[#0f1115] text-white flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">ผลการทดสอบ</h2>
            <div className="inline-block bg-[#1c1f26] px-8 py-6 rounded-3xl">
              <div className="text-6xl font-black text-blue-500 mb-2">{score} <span className="text-3xl text-gray-500">/ {currentQuestions.length}</span></div>
              <div className="text-gray-400">คะแนนของคุณ</div>
            </div>
          </div>

          <div className="space-y-6">
            {currentQuestions.map((q, i) => {
              const isCorrect = userAnswers[i] === q.answer;
              const isUnanswered = userAnswers[i] === null;

              return (
                <div key={i} className={`p-6 rounded-2xl border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <div className="flex gap-4 mb-4">
                    <div className="mt-1">
                      {isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                    </div>
                    <div>
                      <div className="text-lg font-medium mb-4">{i + 1}. {q.question}</div>
                      <div className="space-y-2">
                        {q.options.map((opt, j) => {
                          let optClass = "p-3 rounded-xl border ";
                          if (opt === q.answer) {
                            optClass += "bg-green-500/20 border-green-500 text-green-300"; // Correct answer is highlighted green
                          } else if (opt === userAnswers[i]) {
                            optClass += "bg-red-500/20 border-red-500 text-red-300"; // Wrong selected answer is red
                          } else {
                            optClass += "bg-[#1c1f26] border-transparent opacity-50";
                          }
                          return (
                            <div key={j} className={optClass}>
                              {opt}
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
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center pb-12">
            <button 
              onClick={() => setExamState('SELECT_CHAPTER')}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition"
            >
              กลับไปหน้าเลือกข้อสอบ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { categories } from '@/data/books';
import { BookOpen, ArrowLeft, FolderOpen } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = decodeURIComponent(params.categoryId as string);
  
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-50 text-gray-800">
        <h1 className="text-2xl mb-4 text-red-500 font-bold">ไม่พบหมวดหมู่นี้</h1>
        <Link href="/" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-blue-900 p-6 shadow-md relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 hover:text-blue-300 transition mr-4"
            >
              <ArrowLeft size={24} />
            </button>
            <FolderOpen size={32} className="text-blue-300" />
            <h1 className="text-2xl font-bold tracking-wide">หมวดหมู่: {category.title}</h1>
          </div>
          
          {category.quizUrl && (
            <a 
              href={category.quizUrl}
              className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-full font-bold shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
            >
              ทำแบบทดสอบ
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 mt-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2 flex items-center justify-between">
          <span>เลือกบทเรียนที่ต้องการอ่าน</span>
          <span className="text-sm font-normal text-muted">ทั้งหมด {category.books.length} บท</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {category.books.map((book) => (
            <Link 
              href={`/read/${book.id}`} 
              key={book.id}
              className="group flex flex-col items-center bg-white rounded-lg p-3 shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* หน้าปกจำลอง หรือ หน้าปกจริง */}
              <div className={`w-full aspect-[1/1.4] ${book.coverImageUrl ? 'bg-gray-100' : book.coverColor} rounded-md shadow-inner flex items-center justify-center mb-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                {book.coverImageUrl ? (
                  <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={48} className="text-white/50" />
                )}
                <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end z-20">
                  {book.totalPages && (
                    <div className="bg-black/60 text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1 backdrop-blur-sm">
                      <BookOpen size={10} /> {book.totalPages} หน้า
                    </div>
                  )}
                  <div className="bg-blue-600/80 text-xs px-2 py-0.5 rounded shadow-sm backdrop-blur-sm font-semibold">
                    PDF
                  </div>
                </div>
              </div>
              
              {/* ชื่อหนังสือ/บทเรียน */}
              <h3 className="text-sm font-semibold text-center line-clamp-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                {book.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { getBookById } from '@/data/books';
import Link from 'next/link';

// โหลด BookReader แบบไม่ใช้ SSR (Server-Side Rendering) เพราะมีการใช้ Canvas และ Window
const BookReader = dynamic(() => import('@/components/BookReader'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-xl text-white">
      กำลังเตรียมหนังสือ...
    </div>
  )
});

export default function ReadPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = decodeURIComponent(params.bookId as string);
  
  const book = getBookById(bookId);

  if (!book) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl mb-4 text-red-500">ไม่พบหนังสือที่คุณต้องการ</h1>
        <Link href="/" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      <BookReader 
        pdfUrl={book.pdfUrl} 
        onBack={() => router.push(`/category/${book.categoryId}`)} 
      />
    </div>
  );
}

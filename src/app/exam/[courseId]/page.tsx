"use client";

import { useParams } from 'next/navigation';
import ExamClient from '@/components/ExamClient';

export default function ExamPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  if (!courseId) return null;
  
  return <ExamClient courseId={courseId} />;
}

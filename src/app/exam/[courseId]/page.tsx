import ExamClient from '@/components/ExamClient';

export default function ExamPage({ params }: { params: { courseId: string } }) {
  return <ExamClient courseId={params.courseId} />;
}

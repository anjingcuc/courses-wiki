'use client';

import Link from 'next/link';
import { Course } from '@/lib/courses';

interface ChapterListProps {
  course: Course;
}

export function ChapterList({ course }: ChapterListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">章节列表</h3>
      {course.chapters.map((chapter, index) => (
        <Link
          key={chapter.id}
          href={`/courses/${course.id}/${chapter.id}`}
          className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-medium mr-3">
            {index + 1}
          </span>
          <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
            {chapter.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

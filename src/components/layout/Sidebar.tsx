'use client';

import Link from 'next/link';
import { Course, Chapter } from '@/lib/courses';

interface SidebarProps {
  course: Course;
  currentChapterId?: string;
}

export function Sidebar({ course, currentChapterId }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{course.title}</h2>
        <nav className="space-y-1">
          {course.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/courses/${course.id}/${chapter.id}`}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                currentChapterId === chapter.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {chapter.order + 1}. {chapter.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

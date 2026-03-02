import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse, courses } from '@/lib/courses';
import { ChapterList } from '@/components/course/ChapterList';

interface CoursePageProps {
  params: Promise<{ course: string }>;
}

export async function generateStaticParams() {
  return courses.map((course) => ({
    course: course.id,
  }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          首页
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{course.title}</span>
      </nav>

      {/* Course Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{course.chapters.length} 个章节</span>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ChapterList course={course} />
        </div>

        {/* Course Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">课程信息</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">课程代码：</span>
              <span className="text-gray-600">{course.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">章节数量：</span>
              <span className="text-gray-600">{course.chapters.length}</span>
            </div>
          </div>

          {/* Quick Start */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">快速开始</h4>
            <Link
              href={`/courses/${courseId}/${course.chapters[0]?.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              开始学习
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

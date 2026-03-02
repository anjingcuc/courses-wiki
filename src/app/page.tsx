import Link from 'next/link';
import { courses, getCourseStats } from '@/lib/courses';
import { CourseTree } from '@/components/course/CourseTree';

export default function HomePage() {
  const stats = getCourseStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          课程资料
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          教学课件网站，涵盖 Python、Web 开发、网络安全等多门课程
        </p>
        <div className="mt-4 text-sm text-gray-500">
          共 {stats.totalCourses} 门课程，{stats.totalChapters} 个章节
        </div>
      </div>

      {/* Course Tree */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">课程结构</h2>
        <CourseTree />
      </div>

      {/* Course Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">课程列表</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="course-card block bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {course.chapters.length} 个章节
                </span>
                <span className="text-blue-600 text-sm font-medium">
                  查看详情 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">幻灯片操作说明</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• 使用 ← → 方向键或空格键切换幻灯片</li>
          <li>• 按 F 键进入/退出全屏模式</li>
          <li>• 部分幻灯片支持垂直切换（↑ ↓ 方向键）</li>
        </ul>
      </div>
    </div>
  );
}

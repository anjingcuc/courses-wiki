import Link from 'next/link';
import { courses, getCourseStats } from '@/lib/courses';
import { CourseTree } from '@/components/course/CourseTree';

export default function HomePage() {
  const stats = getCourseStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          欢迎来到我的课程网站
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          网站主要存放课程相关资料
        </p>
      </div>

      {/* Course Descriptions */}
      <div className="space-y-8 mb-16">
        {/* AISSOP */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title">智能系统安全运维与实践</h2>
          <p className="text-gray-700 leading-relaxed mt-4">
            本课程针对计算机日常使用和维护过程中的关键技术，从应用角度出发，介绍 Windows 操作系统、恶意代码、安全加固等基本概念、原理和技术，并通过实例讲解知识点，将安全理论、安全技术和安全工具有机结合。
          </p>
          <Link
            href="/courses/aissop"
            className="inline-flex items-center mt-4 font-medium transition-colors"
            style={{ color: 'var(--color-primary-light)' }}
          >
            课程相关材料请点击这里
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Python */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="section-title">Python 程序设计</h2>
          <p className="text-gray-700 leading-relaxed mt-4">
            本课程旨在引导学生对 Python 编程语言进行学习，并了解各种实用的 Python 库，能够使用 Python 解决日常生活、学习、工作中的问题。
          </p>
          <Link
            href="/courses/python"
            className="inline-flex items-center mt-4 font-medium transition-colors"
            style={{ color: 'var(--color-primary-light)' }}
          >
            课程相关材料请点击这里
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Web */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="section-title">网页设计与制作</h2>
          <p className="text-gray-700 leading-relaxed mt-4">
            本课程结合实践讲解 HTML、CSS、JavaScript，帮助同学们从零开始学习设计 / 制作网页，课程后期以项目的形式带领同学们一起制作自己的页面或应用。
          </p>
          <Link
            href="/courses/web"
            className="inline-flex items-center mt-4 font-medium transition-colors"
            style={{ color: 'var(--color-primary-light)' }}
          >
            课程资料请点击这里
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Online Publishing */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="section-title">在线出版</h2>
          <p className="text-gray-700 leading-relaxed mt-4">
            本课程介绍在线出版技术与工具，包括 Markdown、Git、GitHub、Hexo、GitBook 等内容，帮助学生掌握现代数字出版的核心技能。
          </p>
          <Link
            href="/courses/online-publishing"
            className="inline-flex items-center mt-4 font-medium transition-colors"
            style={{ color: 'var(--color-primary-light)' }}
          >
            课程资料请点击这里
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* APDMS */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="section-title">数字媒体安全应用与实践</h2>
          <p className="text-gray-700 leading-relaxed mt-4">
            本课程进行 Flask Web 框架开发实践，包括 Jinja2 模板引擎和 WTForms 表单验证等核心内容。
          </p>
          <Link
            href="/courses/apdms"
            className="inline-flex items-center mt-4 font-medium transition-colors"
            style={{ color: 'var(--color-primary-light)' }}
          >
            课程资料请点击这里
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Course Tree */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          课程结构
        </h2>
        <CourseTree />
      </div>

      {/* Course Cards Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          全部课程
        </h2>
        <p className="text-gray-600 mb-6">共 {stats.totalCourses} 门课程，{stats.totalChapters} 个章节</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="course-card block rounded-2xl p-6"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
                  {course.chapters.length} 个章节
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-primary-light)' }}>
                  查看详情 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="info-box">
        <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          幻灯片操作说明
        </h3>
        <ul className="space-y-1 text-sm">
          <li>• 使用 ← → 方向键或空格键切换幻灯片</li>
          <li>• 按 F 键进入/退出全屏模式</li>
          <li>• 部分幻灯片支持垂直切换（↑ ↓ 方向键）</li>
        </ul>
      </div>
    </div>
  );
}

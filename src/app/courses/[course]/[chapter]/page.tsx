import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { getCourse, getChapter } from '@/lib/courses';
import { parseSlideTxt } from '@/lib/slideParser';
import { SlideContainer } from '@/components/slides/SlideContainer';

interface ChapterPageProps {
  params: Promise<{ course: string; chapter: string }>;
}

const SLIDES_BASE_PATH = path.join(process.cwd(), '..', 'courses-wiki', 'docs');

// Pre-defined static params for build
const staticParams = [
  // python
  { course: 'python', chapter: 'introduction' },
  { course: 'python', chapter: 'basic' },
  { course: 'python', chapter: 'data-types-basic' },
  { course: 'python', chapter: 'data-types-advanced' },
  { course: 'python', chapter: 'control-flow' },
  { course: 'python', chapter: 'io-file' },
  { course: 'python', chapter: 'file-and-path' },
  { course: 'python', chapter: 'lib-and-packages' },
  { course: 'python', chapter: 'virtualenvs' },
  { course: 'python', chapter: 'class' },
  { course: 'python', chapter: 'web' },
  { course: 'python', chapter: 'web-and-crawler' },
  { course: 'python', chapter: 'crawler' },
  { course: 'python', chapter: 'data-process-and-visualization' },
  { course: 'python', chapter: 'data-process-and-visualization-example' },
  // web
  { course: 'web', chapter: 'introduction' },
  { course: 'web', chapter: 'html-elements' },
  { course: 'web', chapter: 'css-first-steps' },
  { course: 'web', chapter: 'css-text' },
  { course: 'web', chapter: 'css-box' },
  { course: 'web', chapter: 'css-layout' },
  { course: 'web', chapter: 'javascript-introduction' },
  { course: 'web', chapter: 'javascript-basic' },
  { course: 'web', chapter: 'javascript-blocks' },
  { course: 'web', chapter: 'javascript-API' },
  { course: 'web', chapter: 'javascript-oo' },
  { course: 'web', chapter: 'jQuery' },
  { course: 'web', chapter: 'bootstrap' },
  // aissop
  { course: 'aissop', chapter: 'introduction' },
  { course: 'aissop', chapter: 'windows-intro' },
  { course: 'aissop', chapter: 'windows-install' },
  { course: 'aissop', chapter: 'cmd-scripts' },
  { course: 'aissop', chapter: 'shell' },
  { course: 'aissop', chapter: 'virtualbox' },
  { course: 'aissop', chapter: 'windows-components' },
  { course: 'aissop', chapter: 'maintain' },
  { course: 'aissop', chapter: 'malware-introduction' },
  { course: 'aissop', chapter: 'malware-analysis' },
  { course: 'aissop', chapter: 'cli-to-agent' },
  // online-publishing
  { course: 'online-publishing', chapter: 'introduction' },
  { course: 'online-publishing', chapter: 'git' },
  { course: 'online-publishing', chapter: 'github-gitee' },
  { course: 'online-publishing', chapter: 'hexo' },
  { course: 'online-publishing', chapter: 'gitbook' },
  { course: 'online-publishing', chapter: 'web' },
  { course: 'online-publishing', chapter: 'css' },
  { course: 'online-publishing', chapter: 'digital-book' },
  // apdms
  { course: 'apdms', chapter: 'introduction' },
  { course: 'apdms', chapter: 'flask-getting-start' },
  { course: 'apdms', chapter: 'jinja2' },
  { course: 'apdms', chapter: 'wtforms' },
  // wps
  { course: 'wps', chapter: 'introduction' },
  // substitute
  { course: 'substitute', chapter: 'windbg' },
  { course: 'substitute', chapter: 'windbg-script' },
];

export async function generateStaticParams() {
  return staticParams;
}

function getSlideContent(courseId: string, chapterId: string): string | null {
  const slidePath = path.join(SLIDES_BASE_PATH, courseId, chapterId, 'slide.txt');

  try {
    return fs.readFileSync(slidePath, 'utf-8');
  } catch {
    return null;
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { course: courseId, chapter: chapterId } = await params;
  const course = getCourse(courseId);
  const chapter = getChapter(courseId, chapterId);

  if (!course || !chapter) {
    notFound();
  }

  // Read slide content
  const slideContent = getSlideContent(courseId, chapterId);

  if (!slideContent) {
    notFound();
  }

  const { slides, globalStyle, title } = parseSlideTxt(slideContent);

  // Find previous and next chapters
  const chapterIndex = course.chapters.findIndex(c => c.id === chapterId);
  const prevChapter = chapterIndex > 0 ? course.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < course.chapters.length - 1 ? course.chapters[chapterIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          首页
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href={`/courses/${courseId}`} className="text-blue-600 hover:text-blue-800">
          {course.title}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{chapter.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{chapter.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {course.title} - 第 {chapterIndex + 1} 章
        </p>
      </div>

      {/* Slide Hint */}
      <div className="bg-blue-50 text-blue-800 text-sm px-4 py-2 rounded-lg mb-4">
        使用 ← → 方向键或空格键切换幻灯片，按 F 键全屏查看
        <Link
          href={`/slides/${courseId}/${chapterId}`}
          className="ml-4 text-blue-600 hover:text-blue-800 underline"
        >
          全屏查看
        </Link>
      </div>

      {/* Slide Container */}
      <SlideContainer
        slides={slides}
        globalStyle={globalStyle}
        fullscreen={false}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
        {prevChapter ? (
          <Link
            href={`/courses/${courseId}/${prevChapter.id}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上一章：{prevChapter.title}
          </Link>
        ) : (
          <div />
        )}

        {nextChapter && (
          <Link
            href={`/courses/${courseId}/${nextChapter.id}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            下一章：{nextChapter.title}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

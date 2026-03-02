import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { getCourse, getChapter } from '@/lib/courses';
import { parseSlideTxt } from '@/lib/slideParser';
import { SlideContainer } from '@/components/slides/SlideContainer';

interface SlidePageProps {
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

export default async function SlidePage({ params }: SlidePageProps) {
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

  const { slides, globalStyle } = parseSlideTxt(slideContent);

  return (
    <SlideContainer
      slides={slides}
      globalStyle={globalStyle}
      fullscreen={true}
    />
  );
}

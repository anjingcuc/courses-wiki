import fs from 'fs';
import path from 'path';

const SLIDES_BASE_PATH = path.join(process.cwd(), '..', 'courses-wiki', 'docs');

export function getSlideContent(courseId: string, chapterId: string): string | null {
  const slidePath = path.join(SLIDES_BASE_PATH, courseId, chapterId, 'slide.txt');

  try {
    return fs.readFileSync(slidePath, 'utf-8');
  } catch {
    // Try alternative path
    const altPath = path.join(SLIDES_BASE_PATH, courseId, `${chapterId}/slide.txt`);
    try {
      return fs.readFileSync(altPath, 'utf-8');
    } catch {
      return null;
    }
  }
}

export function getSlidePaths(): { course: string; chapter: string }[] {
  const paths: { course: string; chapter: string }[] = [];

  const courses = fs.readdirSync(SLIDES_BASE_PATH).filter(file => {
    const filePath = path.join(SLIDES_BASE_PATH, file);
    return fs.statSync(filePath).isDirectory() && !file.startsWith('.');
  });

  for (const course of courses) {
    const coursePath = path.join(SLIDES_BASE_PATH, course);
    const chapters = fs.readdirSync(coursePath).filter(file => {
      const chapterPath = path.join(coursePath, file);
      const slidePath = path.join(chapterPath, 'slide.txt');
      return fs.statSync(chapterPath).isDirectory() && fs.existsSync(slidePath);
    });

    for (const chapter of chapters) {
      paths.push({ course, chapter });
    }
  }

  return paths;
}

export function getStaticSlidePaths(): { params: { course: string; chapter: string } }[] {
  const paths = getSlidePaths();
  return paths.map(p => ({ params: p }));
}

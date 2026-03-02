export interface Chapter {
  id: string;
  title: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export const courses: Course[] = [
  {
    id: 'python',
    title: 'Python 程序设计',
    description: 'Python 编程语言基础与实践，涵盖数据类型、控制流、函数、类、文件操作、数据处理和可视化等内容。',
    chapters: [
      { id: 'introduction', title: '课程概述', order: 0 },
      { id: 'basic', title: '基本概念', order: 1 },
      { id: 'data-types-basic', title: '基础数据类型', order: 2 },
      { id: 'data-types-advanced', title: '高级数据类型', order: 3 },
      { id: 'control-flow', title: '控制流', order: 4 },
      { id: 'io-file', title: '输入输出与文件操作', order: 5 },
      { id: 'file-and-path', title: '文件与路径', order: 6 },
      { id: 'lib-and-packages', title: '库与包管理', order: 7 },
      { id: 'virtualenvs', title: '虚拟环境', order: 8 },
      { id: 'class', title: '类与面向对象', order: 9 },
      { id: 'web', title: 'Web 开发入门', order: 10 },
      { id: 'web-and-crawler', title: 'Web 与爬虫', order: 11 },
      { id: 'crawler', title: '网络爬虫', order: 12 },
      { id: 'data-process-and-visualization', title: '数据处理与可视化', order: 13 },
      { id: 'data-process-and-visualization-example', title: '数据处理与可视化实例', order: 14 },
    ],
  },
  {
    id: 'web',
    title: '网页设计与制作',
    description: 'Web 前端开发技术，包括 HTML、CSS、JavaScript 核心知识和 Bootstrap、jQuery 等框架应用。',
    chapters: [
      { id: 'introduction', title: '课程概述', order: 0 },
      { id: 'html-elements', title: 'HTML 元素', order: 1 },
      { id: 'css-first-steps', title: 'CSS 入门', order: 2 },
      { id: 'css-text', title: 'CSS 文本样式', order: 3 },
      { id: 'css-box', title: 'CSS 盒模型', order: 4 },
      { id: 'css-layout', title: 'CSS 布局', order: 5 },
      { id: 'javascript-introduction', title: 'JavaScript 简介', order: 6 },
      { id: 'javascript-basic', title: 'JavaScript 基础', order: 7 },
      { id: 'javascript-blocks', title: 'JavaScript 代码块', order: 8 },
      { id: 'javascript-API', title: 'JavaScript DOM API', order: 9 },
      { id: 'javascript-oo', title: 'JavaScript 面向对象', order: 10 },
      { id: 'jQuery', title: 'jQuery', order: 11 },
      { id: 'bootstrap', title: 'Bootstrap', order: 12 },
    ],
  },
  {
    id: 'aissop',
    title: '智能系统安全运维与实践',
    description: 'Windows 系统安全运维、恶意代码分析、虚拟化技术等实践内容。',
    chapters: [
      { id: 'introduction', title: '课程概述', order: 0 },
      { id: 'windows-intro', title: 'Windows 简介', order: 1 },
      { id: 'windows-install', title: 'Windows 安装', order: 2 },
      { id: 'cmd-scripts', title: 'CMD 脚本', order: 3 },
      { id: 'shell', title: 'Shell 命令', order: 4 },
      { id: 'virtualbox', title: 'VirtualBox 虚拟化', order: 5 },
      { id: 'windows-components', title: 'Windows 组件', order: 6 },
      { id: 'maintain', title: '系统维护', order: 7 },
      { id: 'malware-introduction', title: '恶意软件简介', order: 8 },
      { id: 'malware-analysis', title: '恶意软件分析', order: 9 },
      { id: 'cli-to-agent', title: 'CLI 到 Agent', order: 10 },
    ],
  },
  {
    id: 'online-publishing',
    title: '在线出版',
    description: '在线出版技术与工具，包括 Markdown、Git、GitHub、Hexo、GitBook 等内容。',
    chapters: [
      { id: 'introduction', title: '课程概述', order: 0 },
      { id: 'markdown', title: 'Markdown', order: 1 },
      { id: 'git', title: 'Git 版本控制', order: 2 },
      { id: 'github-gitee', title: 'GitHub 与 Gitee', order: 3 },
      { id: 'hexo', title: 'Hexo 博客框架', order: 4 },
      { id: 'gitbook', title: 'GitBook', order: 5 },
      { id: 'web', title: 'Web 发布', order: 6 },
      { id: 'css', title: 'CSS 样式', order: 7 },
      { id: 'digital-book', title: '数字出版', order: 8 },
    ],
  },
  {
    id: 'apdms',
    title: '数字媒体安全应用与实践',
    description: 'Flask Web 框架开发实践，包括 Jinja2 模板和 WTForms 表单验证。',
    chapters: [
      { id: 'introduction', title: '课程概述', order: 0 },
      { id: 'flask-getting-start', title: 'Flask 入门', order: 1 },
      { id: 'jinja2', title: 'Jinja2 模板', order: 2 },
      { id: 'wtforms', title: 'WTForms 表单', order: 3 },
    ],
  },
  {
    id: 'wps',
    title: 'AI-WPS 辅助办公',
    description: 'WPS Office 与 AI 辅助办公应用。',
    chapters: [
      { id: 'introduction', title: '课程概述', order: 0 },
    ],
  },
  {
    id: 'substitute',
    title: '临时代课',
    description: '临时授课内容，包括 WinDbg 调试等专题。',
    chapters: [
      { id: 'windbg', title: 'WinDbg 调试', order: 0 },
      { id: 'windbg-script', title: 'WinDbg 脚本', order: 1 },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getChapter(courseId: string, chapterId: string): Chapter | undefined {
  const course = getCourse(courseId);
  return course?.chapters.find(c => c.id === chapterId);
}

export function getAllCourses(): Course[] {
  return courses;
}

export function getCourseStats(): { totalCourses: number; totalChapters: number } {
  const totalChapters = courses.reduce((sum, course) => sum + course.chapters.length, 0);
  return {
    totalCourses: courses.length,
    totalChapters,
  };
}

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              课程资料 - 教学课件网站
            </p>
            <p className="text-xs text-gray-400 mt-1">
              基于 Next.js 构建
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/anjingcuc/courses-wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

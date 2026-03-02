'use client';

interface SlideNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function SlideNav({ current, total, onPrev, onNext }: SlideNavProps) {
  return (
    <div className="slide-nav absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/90 px-4 py-2 rounded-full shadow-lg">
      <button
        onClick={onPrev}
        disabled={current <= 1}
        className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="上一页"
      >
        ←
      </button>

      <span className="text-sm text-gray-600 min-w-[60px] text-center">
        {current} / {total}
      </span>

      <button
        onClick={onNext}
        disabled={current >= total}
        className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="下一页"
      >
        →
      </button>
    </div>
  );
}

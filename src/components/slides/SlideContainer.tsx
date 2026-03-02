'use client';

import { useState, useEffect, useCallback } from 'react';
import { Slide } from '@/lib/slideParser';
import { SlideRenderer } from './SlideRenderer';

interface SlideContainerProps {
  slides: Slide[];
  globalStyle?: string;
  fullscreen?: boolean;
}

export function SlideContainer({ slides, globalStyle, fullscreen = false }: SlideContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVertical, setCurrentVertical] = useState(0);

  const slide = slides[currentSlide];
  const hasVertical = slide?.children && slide.children.length > 0;
  const currentContent = hasVertical ? slide.children![currentVertical] : slide;

  const navigate = useCallback((dir: 'prev' | 'next') => {
    if (dir === 'next') {
      if (hasVertical && currentVertical < slide.children!.length - 1) {
        setCurrentVertical(v => v + 1);
      } else if (currentSlide < slides.length - 1) {
        setCurrentSlide(s => s + 1);
        setCurrentVertical(0);
      }
    } else {
      if (hasVertical && currentVertical > 0) {
        setCurrentVertical(v => v - 1);
      } else if (currentSlide > 0) {
        setCurrentSlide(s => s - 1);
        const prevSlide = slides[currentSlide - 1];
        setCurrentVertical(prevSlide.children?.length ? prevSlide.children.length - 1 : 0);
      }
    }
  }, [currentSlide, currentVertical, hasVertical, slides, slide]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigate('next');
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigate('prev');
      } else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  // Calculate display slide number
  const getSlideNumber = () => currentSlide + 1;

  if (!slides.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p className="text-xl">没有幻灯片内容</p>
      </div>
    );
  }

  return (
    <div
      className={`slide-container ${fullscreen ? 'fullscreen' : 'embedded'}`}
      style={fullscreen ? { height: '100vh' } : undefined}
    >
      {globalStyle && <style>{globalStyle}</style>}

      <div className="slide-content">
        {currentContent && <SlideRenderer content={currentContent.content} />}
      </div>

      {/* Navigation */}
      <div className="slide-nav">
        <button
          onClick={() => navigate('prev')}
          disabled={currentSlide === 0 && currentVertical === 0}
          aria-label="上一页"
        >
          ← 上一页
        </button>

        <span className="slide-progress">
          {getSlideNumber()} / {slides.length}
        </span>

        <button
          onClick={() => navigate('next')}
          disabled={currentSlide === slides.length - 1 && (!hasVertical || currentVertical === slide.children!.length - 1)}
          aria-label="下一页"
        >
          下一页 →
        </button>
      </div>

      {/* Vertical slide indicator */}
      {hasVertical && slide.children && (
        <div className="vertical-indicator">
          {slide.children.map((_, idx) => (
            <span
              key={idx}
              className={idx === currentVertical ? 'active' : ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}

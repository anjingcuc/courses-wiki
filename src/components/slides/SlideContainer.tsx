'use client';

import { useState, useEffect, useCallback } from 'react';
import { Slide } from '@/lib/slideParser';
import { SlideRenderer } from './SlideRenderer';
import { SlideNav } from './SlideNav';

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

  // Calculate display slide number (accounting for vertical slides)
  const getSlideNumber = () => {
    return currentSlide + 1;
  };

  if (!slides.length) {
    return <div className="p-8 text-center text-gray-500">没有幻灯片内容</div>;
  }

  return (
    <div className={`slide-container ${fullscreen ? 'fullscreen fixed inset-0 z-50 bg-white' : 'embedded relative rounded-lg border shadow-lg'}`}
         style={fullscreen ? { height: '100vh' } : { height: '450px' }}>
      {globalStyle && <style>{globalStyle}</style>}

      <div className="slide-content flex items-center justify-center h-full p-8 overflow-auto">
        {currentContent && <SlideRenderer content={currentContent.content} />}
      </div>

      <SlideNav
        current={getSlideNumber()}
        total={slides.length}
        onPrev={() => navigate('prev')}
        onNext={() => navigate('next')}
      />

      {/* Vertical slide indicator */}
      {hasVertical && slide.children && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
          {slide.children.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentVertical ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

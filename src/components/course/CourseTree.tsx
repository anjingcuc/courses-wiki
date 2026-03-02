'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { courses } from '@/lib/courses';

export function CourseTree() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Build tree data
    const treeData = {
      name: '课程资料',
      children: courses.map((course) => ({
        name: course.title,
        children: course.chapters.map((chapter) => ({
          name: chapter.title,
          value: 1,
        })),
      })),
    };

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          data: [treeData],
          top: '1%',
          left: '7%',
          bottom: '1%',
          right: '20%',
          symbolSize: 7,
          orient: 'LR',
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 12,
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className="w-full h-96 bg-white rounded-lg shadow"
    />
  );
}

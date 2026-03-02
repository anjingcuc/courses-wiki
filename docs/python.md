---
title: Python 程序设计
---

## 课程简介

本课程旨在引导学生对 Python 编程语言进行学习，并了解各种实用的 Python 库。

课程结构如下：

<div id="tree_chart" style="width: 100%; height: 600px;"></div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  const chartDom = document.getElementById('tree_chart');
  const myChart = echarts.init(chartDom);

  const data = {
    name: "Python 程序设计",
    children: [
      {
        name: "基础篇",
        children: [
          { name: "00-课程概述" },
          { name: "01-基本概念" },
          { name: "02-数据类型基础" },
          { name: "03-程序结构" },
          { name: "04-数据类型进阶" }
        ]
      },
      {
        name: "进阶篇",
        children: [
          { name: "05-输入输出" },
          { name: "06-文件与目录" },
          { name: "07-模块与包" },
          { name: "08-第三方库与虚拟环境" },
          { name: "09-函数进阶与类" }
        ]
      },
      {
        name: "应用篇",
        children: [
          {
            name: "Web 开发",
            children: [
              { name: "10-Web 开发" },
              { name: "11-Web 分析与爬虫" },
              { name: "12-爬虫" }
            ]
          },
          {
            name: "数据处理",
            children: [
              { name: "13-数据处理与可视化" },
              { name: "14-数据处理与可视化实例" }
            ]
          }
        ]
      }
    ]
  };

  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
        fontSize: 13
      }
    },
    series: [
      {
        type: 'tree',
        data: [data],
        left: '10%',
        right: '20%',
        top: '10%',
        bottom: '10%',
        symbol: 'circle',
        symbolSize: 12,
        orient: 'LR',
        expandAndCollapse: true,
        initialTreeDepth: 2,
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 13,
          color: '#333'
        },
        lineStyle: {
          color: '#aaa',
          width: 1.5,
          curveness: 0.5
        },
        itemStyle: {
          color: '#5B8FF9',
          borderColor: '#5B8FF9'
        },
        emphasis: {
          focus: 'descendant',
          itemStyle: {
            color: '#1890ff',
            borderColor: '#1890ff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(24, 144, 255, 0.5)'
          },
          lineStyle: {
            width: 2.5
          },
          label: {
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  };

  myChart.setOption(option);

  // 自适应窗口大小
  window.addEventListener('resize', function() {
    myChart.resize();
  });
});
</script>

### [00-课程概述](python/introduction.md)

### [01-基本概念](python/basic.md)

### [02-数据类型基础](python/data-types-basic.md)

### [03-程序结构](python/control-flow.md)

### [04-数据类型进阶](python/data-types-advanced.md)

### [05-输入输出](python/io-file.md)

### [06-文件与目录](python/file-and-path.md)

### [07-模块与包](python/lib-and-packages.md)

### [08-第三方库与虚拟环境](python/virtualenvs.md)

### [09-函数进阶与类](python/class.md)

### [10-Web 开发](python/web.md)

### [11-Web 分析与爬虫](python/web-and-crawler.md)

### [12-爬虫](python/crawler.md)

### [13-数据处理与可视化](python/data-process-and-visualization.md)

### [14-数据处理与可视化实例](python/data-process-and-visualization-example.md)

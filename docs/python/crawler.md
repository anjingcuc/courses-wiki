---
title: 爬虫
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="slideshow.html" frameborder=0 width=800 height=450></iframe>

## 分析实例代码

### 静态页面

Bilibili 关键词搜索结果抓取示例。

```python
import requests
from bs4 import BeautifulSoup

ua = {
    'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
}

r = requests.get('https://search.bilibili.com/all?keyword=python', headers=ua)

html = BeautifulSoup(r.text, 'html.parser')

video_list = html.select('li.video-item.matrix')

result = []
for video in video_list:
    video_info = {}

    url_element = video.select('div.info > div.headline.clearfix > a')
    video_info['title'] = url_element[0].text
    video_info['url'] = url_element[0]['href']

    play_count_element = video.select(
        'div.info > div.tags > span.watch-num')
    video_info['play_count'] = play_count_element[0].text.strip()

    danmu_element = video.select('div.info > div.tags > span.hide')
    video_info['danmu_count'] = danmu_element[0].text.strip()

    upload_time_element = video.select('div.info > div.tags > span.time')
    video_info['upload_date'] = upload_time_element[0].text.strip()

    up_url_element = video.select('div.info > div.tags > span > a.up-name')
    video_info['author'] = up_url_element[0].text
    video_info['author_url'] = up_url_element[0]['href']

    result.append(video_info)

print(result)
```

### JavaScript 渲染

网易云音乐歌单抓取示例。

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()

driver.get('https://music.163.com/#/discover/playlist')

driver.switch_to.frame("contentFrame")

result = []

try:
    ul = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.ID, "m-pl-container")))

    li_list = ul.find_elements_by_css_selector('li')

    for li in li_list:
        song_list = {}
        a = li.find_elements_by_css_selector('div.u-cover.u-cover-1 > a.msk')
        song_list['title'] = a[0].get_attribute('title')
        song_list['url'] = a[0].get_attribute('href')

        result.append(song_list)
finally:
    driver.quit()

print(result)
```

### 数据接口

知乎精华回答抓取示例。

```python
import requests
import json

ua = {
    'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
}

r = requests.get(
    'https://www.zhihu.com/api/v4/topics/19551137/feeds/essence?limit=10&offset=0',
    headers=ua)

data = json.loads(r.text)

print(data)
```

## 项目 2 - 爬虫

用 Scrapy 抓取自己感兴趣的站点，保存数据到 csv 中。

作业链接: https://classroom.github.com/a/J2oRPdWD

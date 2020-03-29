---
title: 数据类型进阶
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

# 示例代码

## 列表

```python
# 初始选课的同学
students = [20190001 + x for x in range(10)]

# 新增一位
students.append(20191234)

# 新增一批
students.extend(range(20192020, 20192030))

# 把某位同学加到最前面
students.insert(0, 20190000)

# 替换，被替换的长度可以不等于替换内容的长度
students[5:15] = range(20192333, 20192340)

# 有步长的替换则要求两边的序列长度一样
students[0:5:2] = [20195333, 20196333, 20197333]

# 排序和反序
students.sort()
students.reverse()

if 20195333 in students:
  print('你选上了，同学。')

students.remove(20195333)

print('你又退了，同学。')

del students[:]

print(students)

del students

print(students)
```

## 元组

```python
# 元组中可以只有一项内容，单独使用元组时括号可以省略，但逗号是不能省略的
teachers = 'anjing',

# 元组支持拼接操作
more_teachers = teachers + ('Tom', 'Jerry')

# 支持全切片复制元组，但不支持 .copy()
same_teachers = more_teachers[:]

# 支持查找，但不支持排序 .sort()
same_teachers.index('anjing')

# 支持哈希
print(hash(same_teachers))

# 可以整体删除但不支持部分删除
del more_teachers
del teachers
```

## 对于序列的进阶循环技巧

```python
# 同时取出索引数字和对应位置的元素
for index, student in enumerate(students):
    print(index, student)

# 同时循环两个序列
import random
scores = [random.randint(60, 100) for x in range(10)]
students = [20190001 + x for x in range(10)]

for score, student in zip(scores, students):
    print(score, student)
```

## 集合

```python
# 签到的学生
checkin = [20190001, 20190002, 20190003, 20190004, 20190002]

# 一键去重
unique_checkin = list(set(checkin))

# 所有学生名单
all_students = [20190001, 20190002, 20190003, 20190004, 20190005, 20190006]

# 没来的，抓住你了
nauty_kids = set(all_students) - set(checkin)

print(nauty_kids)
```

## 字典

```python
import random

scores = [random.randint(60, 100) for x in range(10)]
students = [20190001 + x for x in range(10)]

transcript = dict(zip(students, scores))

# 传统写法
ranking = sorted(transcript.items(), key=lambda x: x[1], reverse=True)
ranked_transcript = dict(ranking)

# python 3.6+
ranked_transcript = {
    k: v
    for k, v in sorted(
        transcript.items(), key=lambda item: item[1], reverse=True)
}

print(ranked_transcript)
```

## 混合示例

```python
import random

# 生成一个假的名单
# 包含 10 个学生
students = []
for x in range(10):
    # 利用字母对应 ASCII 码增加来自动起名
    name = '小' + chr(ord('A') + x)
    student = {
        'name': name,
        'id': 20190001 + x,  # 按顺序生成学号
        'score': random.randint(60, 100)  # 随机一个成绩
    }

    # 将一名学生对应的字典加入到名单中
    students.append(student)

# 输出名单作为调试信息
print(students)

# 对名单进行排序，排序的key是每个学生的成绩，倒序
students.sort(key=lambda x: x['score'], reverse=True)

# 输出排序后的成绩单
for student in students:
    print(student['id'], student['name'], student['score'])
```
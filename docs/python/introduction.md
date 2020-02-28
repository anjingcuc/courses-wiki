---
title: 课程概述
---

**下方课件区域方向键控制翻页，`f` 键全屏。**

<iframe src="./slideshow.html" frameborder=0 width=800 height=450></iframe>

## 小乌龟实例

该实例演示利用 Python 自带的 turtle 模块画图。

其中心型部分参考了 https://www.youtube.com/watch?v=2STVF2vCx2c

```python
import turtle


# 画一个弧度
def curve(t):
    for i in range(200):
        t.right(1)
        t.forward(1)


# 创建一个空白的窗口
w = turtle.Screen()

# 创建一只小海龟
t = turtle.Turtle()

# 不画线，跑到 x=0 y=128 的位置
t.penup()
t.goto(0, 128)

# 落笔，笔的颜色是蓝色，写 anjingcuc
t.pendown()
t.pencolor('blue')
t.write('anjingcuc',
        False,
        align='center',
        font=('Times New Roman', 64, 'normal'))

# 抬起笔，跑到 x=0 y=-50 的位置
t.penup()
t.goto(0, -50)

# 落笔，且线条颜色为红色，填充颜色为红色
t.pendown()
t.color('red', 'red')

# 花心型并填充
t.begin_fill()
t.left(140)
t.forward(111.65)
curve(t)
t.left(120)
curve(t)
t.forward(111.65)
t.end_fill()

# 抬笔，并跑到 x=0 y=-148 的位置
t.penup()
t.goto(0, -148)

# 落笔，颜色为绿色
t.pendown()
t.pencolor('green')

# 写 bilibili
t.write('bilibili',
        False,
        align='center',
        font=('Times New Roman', 64, 'normal'))

# 隐藏箭头（即小乌龟）
t.hideturtle()

# 显示窗口
w.mainloop()
```

## 日常数据处理

二维码识别学号实现自动考勤打卡，学期结束后使用 pandas 自动生成 excel 来统计大家的出勤情况。

### 考勤部分

```python
from datetime import datetime, date
import os, sys
import atexit
import argparse

import pyzbar.pyzbar as pyzbar
import numpy as np
import cv2
import time

folder_path = os.path.dirname(os.path.realpath(__file__))


def get_students(course):
  students = dict()
  with open(folder_path + '/students@' + course, encoding='utf-8') as fptr:
    student_file = fptr.read().split('\n')
    for student in student_file:
      if student.strip():
        student = student.split(',')
        # 0 => student_id, 1 => name
        students[student[0]] = {'id': student[0], 'name': student[1]}
  return students


def speak(msg):
  if sys.platform == 'darwin':
    os.system('say ' + msg)
  elif sys.platform == 'linux':
    # sudo apt-get install espeak
    os.system('espeak -vzh ' + msg)
  elif sys.platform == 'win32':
    import win32com.client

    speaker = win32com.client.Dispatch('SAPI.SpVoice')
    speaker.Speak(msg)
  else:
    print(sys.platform)


def show_absence(s, a):
  absences = list(set(s.keys()).difference(set(a.keys())))
  print('==============================================')
  print('未签到统计：', len(absences), '人')
  for member in absences:
    print(s[member]['name'])


def exit_shell(s, a):
  show_absence(s, a)


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='签到系统:')
  parser.add_argument('course', metavar='course', type=str, help='课程名称')

  args = parser.parse_args()

  print('欢迎来到 SecCUC 课程签到系统')
  print('==============================================')
  print('请扫描虚拟校园卡二维码')

  if not os.path.exists(folder_path + '/students@' + args.course):
    print('输入错误，没有该课程学生资料。')
    exit()

  attendance = {}
  students = get_students(args.course)

  atexit.register(exit_shell, students, attendance)

  # 使用笔记本内置摄像头直接使用参数 int: 0
  # 使用 IP 摄像头等远程设备使用 str: 'http://username:password@ip:port'
  cap = cv2.VideoCapture(0)
  cap.set(3, 640)
  cap.set(4, 480)

  already_scanned = []
  with open(folder_path + './signin.log', 'a', encoding='utf-8') as logger:
    while (cap.isOpened()):
      ret, frame = cap.read()
      im = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

      decodedObjects = pyzbar.decode(im)
      for decodedObject in decodedObjects:
        student_id = decodedObject.data.decode('utf8')
        if not student_id.isnumeric() and student_id.startswith('http'):
          student_id = student_id.split('/')[-1]
        print(student_id)
        if student_id in already_scanned:
          continue

        log_string = '课程：{}, 学号：{}, 姓名：{}, 时间：{}\n'
        checkin_time = datetime.now()
        if student_id in students.keys():
          student = students[student_id]

          attendance[student_id] = str(checkin_time)
          logger.write(
              log_string.format(args.course, student['id'], student['name'],
                                str(checkin_time)))
          logger.flush()
          speak('{},签到成功!'.format(student['name']))

          already_scanned.append(student_id)
        else:
          logger.write(
              log_string.format(args.course, student_id, str(checkin_time)))
          logger.flush()
          speak('查无此人!')

      cv2.imshow('scaner', frame)
      key = cv2.waitKey(1)
      if key & 0xFF == ord('q'):
        break

    cap.release()
    cv2.destroyAllWindows()
```

### 表格生成部分

```python
from datetime import datetime, date
import os
import pandas as pd
import numpy as np

def get_records(path):
  records = {}
  with open(path, 'r', encoding='utf8') as f:
    for line in f.readlines():
      student_id = line.split(',')[2].strip()
      student_id = student_id.split('：')[1]

      dt = line.split(',')[3].strip()
      dt = dt.split('：')[1]
      record = datetime.strptime(dt, '%Y-%m-%d %H:%M:%S.%f')

      if student_id not in records.keys():
        records[student_id] = {}

      records[student_id][record.strftime('%Y-%m-%d')] = record.strftime('%H:%M:%S')
  return records


def get_students(path):
  students = []
  with open(path, 'r', encoding='utf8') as f:
    for line in f.readlines():
      student_id = line.split(',')[1].strip()
      students.append(student_id)
  return students


r = get_records('signin.log')

for course in ['python']:
  students = get_students('students@'+course)

  date_list = []
  for student in students:
    if student not in r.keys():
      continue

    date_list = list(set(date_list+list(r[student].keys())))

  df = pd.DataFrame(index=students, columns=date_list)

  for student in students:
    if student not in r.keys():
      continue

    for k, v in r[student].items():
      df.loc[student, k] = 1

  df.to_excel(course+'.xlsx')
```

## 人工智能-换脸

一键换装？参考 [萌新如何用 Python 实现人脸替换？](https://juejin.im/post/5ad60e19f265da239707600d) / [matthewearl/faceswap](https://github.com/matthewearl/faceswap) 。

```python
import cv2
import dlib
import numpy

import sys, os

PREDICTOR_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                              "shape_predictor_68_face_landmarks.dat")
SCALE_FACTOR = 1
FEATHER_AMOUNT = 11

# 1-16 脸型
JAW_POINTS = list(range(0, 17))
# 17-21 右边眉毛
RIGHT_BROW_POINTS = list(range(17, 22))
# 22-26 左边眉毛
LEFT_BROW_POINTS = list(range(22, 27))
# 27-35 鼻子
NOSE_POINTS = list(range(27, 35))
# 36-41 眼睛
RIGHT_EYE_POINTS = list(range(36, 42))
# 42-47 眼睛
LEFT_EYE_POINTS = list(range(42, 48))
# 48-68 嘴巴
MOUTH_POINTS = list(range(48, 68))

# 17-68 整个脸
FACE_POINTS = list(range(17, 68))
FACE_END = 68
# Points used to line up the images.
ALIGN_POINTS = (LEFT_BROW_POINTS + RIGHT_EYE_POINTS + LEFT_EYE_POINTS +
                RIGHT_BROW_POINTS + NOSE_POINTS + MOUTH_POINTS)

# Points from the second image to overlay on the first. The convex hull of each
# element will be overlaid.
OVERLAY_POINTS = [FACE_POINTS]

# Amount of blur to use during colour correction, as a fraction of the
# pupillary distance.
COLOUR_CORRECT_BLUR_FRAC = 0.6

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(PREDICTOR_PATH)


class TooManyFaces(Exception):
    pass


class NoFaces(Exception):
    pass


def draw_point(img, p, color):
    cv2.circle(img, (p[0], p[1]), 2, color, cv2.FILLED, cv2.LINE_AA, 0)


def rect_contains(rect, point):
    if point[0] < rect[0]:
        return False
    elif point[1] < rect[1]:
        return False
    elif point[0] > rect[0] + rect[2]:
        return False
    elif point[1] > rect[1] + rect[3]:
        return False
    return True


def measure_triangle(shape, points):
    rect = (0, 0, shape[1], shape[0])

    sub_div = cv2.Subdiv2D(rect)

    for p in points:
        sub_div.insert((p[0], p[1]))
    #sub_div.insert(points)

    triangle_list = sub_div.getTriangleList()

    triangle = []

    for t in triangle_list:
        pt = [(t[0], t[1]), (t[2], t[3]), (t[4], t[5])]

        pt1 = (t[0], t[1])
        pt2 = (t[2], t[3])
        pt3 = (t[4], t[5])

        if rect_contains(rect, pt1) and rect_contains(
                rect, pt2) and rect_contains(rect, pt3):
            ind = []
            for j in range(0, 3):
                for k in range(0, len(points)):
                    if abs(pt[j][0] - points[k][0]) < 1.0 and abs(
                            pt[j][1] - points[k][1]) < 1.0:
                        ind.append(k)
            if len(ind) == 3:
                triangle.append((ind[0], ind[1], ind[2]))

    return triangle


def morph_triangle(src, dst, img, t_src, t_dst, t, alpha):
    r1 = cv2.boundingRect(np.float32([t_src]))
    r2 = cv2.boundingRect(np.float32([t_dst]))
    r = cv2.boundingRect(np.float32([t]))

    t1_rect = []
    t2_rect = []
    t_rect = []

    for i in range(0, 3):
        t_rect.append(((t[i][0] - r[0]), (t[i][1] - r[1])))
        t1_rect.append(((t_src[i][0] - r1[0]), (t_src[i][1] - r1[1])))
        t2_rect.append(((t_dst[i][0] - r2[0]), (t_dst[i][1] - r2[1])))

    mask = np.zeros((r[3], r[2], 3), dtype=np.float32)
    cv2.fillConvexPoly(mask, np.int32(t_rect), (1.0, 1.0, 1.0), 16, 0)

    img1_rect = src[r1[1]:r1[1] + r1[3], r1[0]:r1[0] + r1[2]]
    img2_rect = dst[r2[1]:r2[1] + r2[3], r2[0]:r2[0] + r2[2]]

    size = (r[2], r[3])

    warp_img1 = affine_transform(img1_rect, t1_rect, t_rect, size)
    warp_img2 = affine_transform(img2_rect, t2_rect, t_rect, size)

    img_rect = (1.0 - alpha) * warp_img1 + alpha * warp_img2

    img[r[1]:r[1] + r[3],
        r[0]:r[0] + r[2]] = img[r[1]:r[1] + r[3], r[0]:r[0] +
                                r[2]] * (1 - mask) + img_rect * mask


def affine_triangle(src, dst, t_src, t_dst):
    r1 = cv2.boundingRect(np.float32([t_src]))
    r2 = cv2.boundingRect(np.float32([t_dst]))

    t1_rect = []
    t2_rect = []
    t2_rect_int = []

    for i in range(0, 3):
        t1_rect.append((t_src[i][0] - r1[0], t_src[i][1] - r1[1]))
        t2_rect.append((t_dst[i][0] - r2[0], t_dst[i][1] - r2[1]))
        t2_rect_int.append((t_dst[i][0] - r2[0], t_dst[i][1] - r2[1]))

    mask = np.zeros((r2[3], r2[2], 3), dtype=np.float32)
    cv2.fillConvexPoly(mask, np.int32(t2_rect_int), (1.0, 1.0, 1.0), 16, 0)

    img1_rect = src[r1[1]:r1[1] + r1[3], r1[0]:r1[0] + r1[2]]

    size = (r2[2], r2[3])

    img2_rect = affine_transform(img1_rect, t1_rect, t2_rect, size)
    img2_rect = img2_rect * mask

    dst[r2[1]:r2[1] + r2[3], r2[0]:r2[0] +
        r2[2]] = dst[r2[1]:r2[1] + r2[3], r2[0]:r2[0] + r2[2]] * (
            (1.0, 1.0, 1.0) - mask)

    dst[r2[1]:r2[1] + r2[3], r2[0]:r2[0] +
        r2[2]] = dst[r2[1]:r2[1] + r2[3], r2[0]:r2[0] + r2[2]] + img2_rect


def affine_transform(src, src_tri, dst_tri, size):
    warp_mat = cv2.getAffineTransform(np.float32(src_tri), np.float32(dst_tri))

    dst = cv2.warpAffine(src,
                         warp_mat, (size[0], size[1]),
                         None,
                         flags=cv2.INTER_LINEAR,
                         borderMode=cv2.BORDER_REFLECT_101)

    return dst


def get_landmarks(im):
    rects = detector(im, 1)

    if len(rects) > 1:
        raise TooManyFaces
    if len(rects) == 0:
        raise NoFaces

    # 特征提取器（predictor）要一个粗糙的边界框作为算法输入，由传统的能返回一个矩形列表的人脸检测器（detector）提供，其每个矩形列表在图像中对应一个脸。
    return numpy.matrix([[p.x, p.y] for p in predictor(im, rects[0]).parts()])


def draw_convex_hull(im, points, color):
    points = cv2.convexHull(points)
    cv2.fillConvexPoly(im, points, color=color)


# 用普氏分析法（Procrustes Analysis）实现人脸对齐
def transformation_from_points(points1, points2):
    """
    Return an affine transformation [s * R | T] such that:

        sum ||s*R*p1,i + T - p2,i||^2

    is minimized.

    """
    # Solve the procrustes problem by subtracting centroids, scaling by the
    # standard deviation, and then using the SVD to calculate the rotation. See
    # the following for more details:
    #   https://en.wikipedia.org/wiki/Orthogonal_Procrustes_problem

    # 1.将2个图片的脸部浮点转换成矩阵
    points1 = points1.astype(numpy.float64)
    points2 = points2.astype(numpy.float64)

    # 2.将每一个点集减去它的矩心。一旦为这两个新的点集找到了一个最佳的缩放和旋转方法，这两个矩心c1和c2就可以用来找到完整的解决方案。
    c1 = numpy.mean(points1, axis=0)
    c2 = numpy.mean(points2, axis=0)
    points1 -= c1
    points2 -= c2

    # 3.同样，将每一个点集除以它的标准偏差。这消除了缩放偏差。
    s1 = numpy.std(points1)
    s2 = numpy.std(points2)
    points1 /= s1
    points2 /= s2

    # 4.使用奇异值分解（singular value decomposition）计算旋转部分。请参阅维基百科有关Orthogonal Procrustes Problem的文章，以了解它的具体工作原理。
    U, S, Vt = numpy.linalg.svd(points1.T * points2)

    # The R we seek is in fact the transpose of the one given by U * Vt. This
    # is because the above formulation assumes the matrix goes on the right
    # (with row vectors) where as our solution requires the matrix to be on the
    # left (with column vectors).
    R = (U * Vt).T

    # 5.将整个变换过程以仿射变换矩阵形式返回。
    return numpy.vstack([
        numpy.hstack(((s2 / s1) * R, c2.T - (s2 / s1) * R * c1.T)),
        numpy.matrix([0., 0., 1.])
    ])


def read_im_and_landmarks(fname):
    im = cv2.imread(fname, cv2.IMREAD_COLOR)
    im = cv2.resize(im,
                    (im.shape[1] * SCALE_FACTOR, im.shape[0] * SCALE_FACTOR))
    s = get_landmarks(im)

    return im, s


def warp_im(im, M, dshape):
    output_im = numpy.zeros(dshape, dtype=im.dtype)
    cv2.warpAffine(im,
                   M[:2], (dshape[1], dshape[0]),
                   dst=output_im,
                   borderMode=cv2.BORDER_TRANSPARENT,
                   flags=cv2.WARP_INVERSE_MAP)
    return output_im


def get_face_mask(im, landmarks):
    im = numpy.zeros(im.shape[:2], dtype=numpy.float64)

    for group in OVERLAY_POINTS:
        draw_convex_hull(im, landmarks[group], color=1)

    im = numpy.array([im, im, im]).transpose((1, 2, 0))

    im = (cv2.GaussianBlur(im, (FEATHER_AMOUNT, FEATHER_AMOUNT), 0) > 0) * 1.0
    im = cv2.GaussianBlur(im, (FEATHER_AMOUNT, FEATHER_AMOUNT), 0)

    return im


def correct_colours(im1, im2, landmarks1):
    blur_amount = COLOUR_CORRECT_BLUR_FRAC * numpy.linalg.norm(
        numpy.mean(landmarks1[LEFT_EYE_POINTS], axis=0) -
        numpy.mean(landmarks1[RIGHT_EYE_POINTS], axis=0))
    blur_amount = int(blur_amount)
    if blur_amount % 2 == 0:
        blur_amount += 1
    im1_blur = cv2.GaussianBlur(im1, (blur_amount, blur_amount), 0)
    im2_blur = cv2.GaussianBlur(im2, (blur_amount, blur_amount), 0)

    # Avoid divide-by-zero errors.
    im2_blur += (128 * (im2_blur <= 1.0)).astype(im2_blur.dtype)

    return (im2.astype(numpy.float64) * im1_blur.astype(numpy.float64) /
            im2_blur.astype(numpy.float64))


def change_face(src_img, dst_img, out_img):
    # 一、将face变形成model的形状
    # 1.将两张图片转化成numpy数组，并返回一个68 x2元素矩阵，输入图像的每个特征点对应每行的一个x，y坐标。
    model_img, model_landmarks = read_im_and_landmarks(src_img)
    face_img, face_landmarks = read_im_and_landmarks(dst_img)

    # 2.用普氏分析法（Procrustes Analysis）实现人脸对齐
    M = transformation_from_points(model_landmarks[ALIGN_POINTS],
                                   face_landmarks[ALIGN_POINTS])

    mask = get_face_mask(face_img, face_landmarks)
    warped_mask = warp_im(mask, M, model_img.shape)
    combined_mask = numpy.max(
        [get_face_mask(model_img, model_landmarks), warped_mask], axis=0)

    warped_im2 = warp_im(face_img, M, model_img.shape)
    warped_corrected_im2 = correct_colours(model_img, warped_im2,
                                           model_landmarks)

    output_im = model_img * (
        1.0 - combined_mask) + warped_corrected_im2 * combined_mask

    cv2.imwrite(out_img, output_im)


if __name__ == '__main__':
    change_face('target.jpg', 'face.jpg', 'output.jpg')
```

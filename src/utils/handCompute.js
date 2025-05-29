// 计算两点间距离 (3D)
export function dist3D(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2))
}

// 计算角度
export function angle(p1, p2, p3) {
  const a = dist3D(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z)
  const b = dist3D(p1.x, p1.y, p2.z, p2.x, p2.y, p2.z)
  const c = dist3D(p3.x, p3.y, p3.z, p2.x, p2.y, p2.z)

  const cosA = (b * b + c * c - a * a) / (2 * c * b)
  return cosA
}

// 手势识别逻辑
export function isFistGesture(landmarks) {
  // 获取食指关键点信息
  const indexFigure1 = landmarks[8];
  const indexFigure2 = landmarks[7];
  const indexFigure3 = landmarks[6];
  const indexFigure4 = landmarks[5];

  //拇指
  const thumb1 = landmarks[4];
  const thumb2 = landmarks[3];
  const thumb3 = landmarks[2];
  const thumb4 = landmarks[1];

  //指尖
  const thumbTip = landmarks[4];
  const middleFingerTip = landmarks[12];
  const ringFingerTip = landmarks[16];
  const pinkyTip = landmarks[20];

  // 获取中指关键点信息
  const middleFinger1 = landmarks[12];
  const middleFinger2 = landmarks[11];
  const middleFinger3 = landmarks[10];
  const middleFinger4 = landmarks[9];

  //获取无名指关键点信息
  const ringFinger1 = landmarks[16];
  const ringFinger2 = landmarks[15];
  const ringFinger3 = landmarks[14];
  const ringFinger4 = landmarks[13];

  //获取小指关键点信息
  const pinky1 = landmarks[20];
  const pinky2 = landmarks[19];
  const pinky3 = landmarks[18];
  const pinky4 = landmarks[17];

  //手腕
  const figure0 = landmarks[0];

  // 判断手势一
  if (
    //食指 第二 三指节为打直状态
    angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
    //大拇指 第一 二指节弯曲
    (angle(thumb1, thumb2, thumb3) > -0.9 ||
      angle(thumb2, thumb3, thumb4) > -0.9) &&
    angle(pinky2, pinky3, pinky4) > -0.8 &&
    //无名指 小指 第二三指节 弯曲
    //无名指
    angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
    angle(pinky2, pinky3, pinky4) > -0.5 &&
    //中指弯曲
    angle(middleFinger2, middleFinger3, middleFinger4) > -0.5
    //拇指
  ) {
    return 1;
  } else if (
    //食指 中指 无名指打直
    //食指 第二 三指节为打直状态
    angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
    //中指 第二 三指节为打直状态
    angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
    //无名指 第二 三指节为打直状态
    angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
    //拇指 小指弯曲
    (angle(thumb1, thumb2, thumb3) > -0.9 ||
      angle(thumb2, thumb3, thumb4) > -0.9) &&
    angle(pinky2, pinky3, pinky4) > -0.8
  ) {
    return 3;
  } else if (
    // 手势四
    //食指 第二 三指节为打直状态
    angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
    //中指 第二 三指节为打直状态
    angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
    //无名指 第二 三指节为打直状态
    angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
    //小指 打直
    angle(pinky2, pinky3, pinky4) < -0.8 &&
    //拇指弯曲
    angle(thumb1, thumb2, thumb3) > -0.9
  ) {
    return 4;
  } else if (
    //食指 第二 三指节为打直状态
    angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
    //中指 第二 三指节为打直状态
    angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
    //无名指 第二 三指节为打直状态
    angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
    //小指 打直
    angle(pinky2, pinky3, pinky4) < -0.8 &&
    //拇指直
    angle(thumb1, thumb2, thumb3) < -0.8
  ) {
    return 5;
  } else if (
    //食指 弯曲
    angle(indexFigure2, indexFigure3, indexFigure4) > -0.5 &&
    //中指弯曲
    angle(middleFinger2, middleFinger3, middleFinger4) > -0.5 &&
    //无名指弯曲
    angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
    //小指弯曲
    angle(pinky2, pinky3, pinky4) > -0.5 &&
    //拇指伸直
    angle(thumb1, thumb2, thumb3) < -0.8
  ) {
    //竖大拇指
    return 101;
  } else if (
    //食指 伸直
    angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
    //中指弯曲
    angle(middleFinger2, middleFinger3, middleFinger4) > -0.5 &&
    //无名指弯曲
    angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
    //小指弯曲
    angle(pinky2, pinky3, pinky4) > -0.5 &&
    //拇指伸直
    angle(thumb1, thumb2, thumb3) < -0.8
  ) {
    //竖大拇指并伸出食指
    return 102;
  } else if (
    //食指 伸直
    angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
    //中指伸直
    angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
    //无名指弯曲
    angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
    //小指弯曲
    angle(pinky2, pinky3, pinky4) > -0.5 &&
    //拇指弯曲
    (angle(thumb1, thumb2, thumb3) > -0.9 ||
      angle(thumb2, thumb3, thumb4) > -0.9) &&
    angle(indexFigure1, middleFinger4, middleFinger1) > 0.995
  ) {
    //伸出食指中指，并拢
    return 201;
  } else if (
    // 手势二
    //中指打直
    angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
    //食指 第二 三指节为打直状态
    angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
    //大拇指 第一 二指节弯曲
    (angle(thumb1, thumb2, thumb3) > -0.9 ||
      angle(thumb2, thumb3, thumb4) > -0.9) &&
    //无名指 小指 第二三指节 弯曲
    //无名指
    angle(ringFinger2, ringFinger3, ringFinger4) > -0.8 &&
    angle(pinky2, pinky3, pinky4) > -0.8 &&
    angle(landmarks[6], landmarks[0], landmarks[10]) < 0.99
  ) {
    return 2;
  }

  return false;
}

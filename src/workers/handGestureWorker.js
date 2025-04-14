// 手势识别Worker
// 负责处理手部关键点数据并识别手势

// 接收消息
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  if (type === 'processLandmarks') {
    const { landmarks, handedness } = data;
    
    // 在Worker中处理手势识别
    const gesture = isFistGesture(landmarks);
    
    if (gesture) {
      self.postMessage({
        type: 'gestureDetected',
        data: {
          hand: handedness,
          gesture: gesture,
          landmarks: landmarks
        }
      });
    }
  }
};

// 计算两点间距离 (3D)
function dist3D(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
}

// 计算角度
function angle(p1, p2, p3) {
  const a = dist3D(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z);
  const b = dist3D(p1.x, p1.y, p2.z, p2.x, p2.y, p2.z);
  const c = dist3D(p3.x, p3.y, p3.z, p2.x, p2.y, p2.z);
  
  const cosA = (b * b + c * c - a * a) / (2 * c * b);
  return cosA;
}

// 手势识别逻辑
function isFistGesture(landmarks) {
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

  // 判断手势
  if (
    //判断手势一
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
  } 
  
  // 这里可以添加其他手势识别逻辑
  // 例如手势2、手势3等判断条件
  
  return false;
} 
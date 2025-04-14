// 手势识别Worker文件
self.importScripts('http://172.0.0.1:10000/hands.js');

let hands = null;
let gestureMarked = null;
let gestureMarked1 = null;
let timeMarked = new Date().getTime();

// 初始化手势识别
self.addEventListener('message', function(e) {
  const { type, data } = e.data;
  
  if (type === 'init') {
    // 初始化MediaPipe Hands
    const mpHands = self.Hands;
    hands = new mpHands.Hands({
      locateFile: (file) => {
        return `http://172.0.0.1:10000/${file}`;
      }
    });
    
    hands.setOptions({
      selfieMode: true,
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandedness) {
        const gestures = processHandLandmarks(results);
        self.postMessage({ type: 'results', data: { 
          results,
          gestures
        }});
      } else {
        self.postMessage({ type: 'results', data: { results, gestures: [] }});
      }
    });
    
    self.postMessage({ type: 'initialized' });
  } else if (type === 'frame') {
    // 处理视频帧
    if (hands) {
      hands.send({ image: data.imageData });
    }
  }
});

// 计算两点间距离 (2D)
function dist2D(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

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

// 识别手势
function isFistGesture(landmarks) {
  // 获取各指关键点信息
  const indexFigure1 = landmarks[8];
  const indexFigure2 = landmarks[7];
  const indexFigure3 = landmarks[6];
  const indexFigure4 = landmarks[5];
  
  const thumb1 = landmarks[4];
  const thumb2 = landmarks[3];
  const thumb3 = landmarks[2];
  const thumb4 = landmarks[1];
  
  const middleFinger1 = landmarks[12];
  const middleFinger2 = landmarks[11];
  const middleFinger3 = landmarks[10];
  const middleFinger4 = landmarks[9];
  
  const ringFinger1 = landmarks[16];
  const ringFinger2 = landmarks[15];
  const ringFinger3 = landmarks[14];
  const ringFinger4 = landmarks[13];
  
  const pinky1 = landmarks[20];
  const pinky2 = landmarks[19];
  const pinky3 = landmarks[18];
  const pinky4 = landmarks[17];
  
  // 使用预计算的角度值来优化性能
  const indexFingerAngle = angle(indexFigure2, indexFigure3, indexFigure4);
  const thumbAngle1 = angle(thumb1, thumb2, thumb3);
  const thumbAngle2 = angle(thumb2, thumb3, thumb4);
  const pinkyAngle = angle(pinky2, pinky3, pinky4);
  const ringFingerAngle = angle(ringFinger2, ringFinger3, ringFinger4);
  const middleFingerAngle = angle(middleFinger2, middleFinger3, middleFinger4);
  
  // 手势判断逻辑
  // 手势一
  if (indexFingerAngle < -0.8 && 
      (thumbAngle1 > -0.9 || thumbAngle2 > -0.9) && 
      pinkyAngle > -0.8 && 
      ringFingerAngle > -0.5 && 
      pinkyAngle > -0.5 && 
      middleFingerAngle > -0.5) {
    return 1;
  }
  
  // 其他手势判断逻辑...
  // 这里省略其他手势的判断代码，实际应从原代码移植过来
  
  return false;
}

function processHandLandmarks(results) {
  const gestures = [];
  
  for (let index = 0; index < results.multiHandLandmarks.length; index++) {
    const classification = results.multiHandedness[index];
    const isRightHand = classification.label === "Right";
    const landmarks = results.multiHandLandmarks[index];
    
    const gesture = isFistGesture(landmarks);
    
    if (gesture) {
      gestures.push({
        hand: classification.label,
        gesture: gesture,
        landmarks: landmarks
      });
    }
  }
  
  return gestures;
} 
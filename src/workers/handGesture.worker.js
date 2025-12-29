// 手势识别Worker
// 负责处理手部关键点数据并识别手势
import { isFistGesture } from '../utils/handCompute.js'
// 接收消息
self.onmessage = function (e) {
  const { type, data } = e.data

  if (type === 'processLandmarks') {
    const { landmarks, handedness } = data

    // 在Worker中处理手势识别
    const gesture = isFistGesture(landmarks)

    if (gesture) {
      self.postMessage({
        type: 'gestureDetected',
        data: {
          hand: handedness,
          gesture: gesture,
          landmarks: landmarks
        }
      })
    }
  }
}

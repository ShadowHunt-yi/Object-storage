/**
 * 手势识别Worker
 * 版本: 1.0.0
 * 支持的手势: 1,2,3,4,5,101,102,201
 */

// Worker配置
const WORKER_CONFIG = {
    debug: true,
    gestureTypes: {
        1: '单指点击',
        2: '双指点击',
        3: '三指点击',
        4: '四指点击',
        5: '五指点击',
        101: '拳头手势',
        102: '指向手势',
        201: '特殊手势'
    }
}

// 计算两点间距离 (3D)
function dist3D(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2))
}

// 计算角度
function angle(p1, p2, p3) {
    const a = dist3D(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z)
    const b = dist3D(p1.x, p1.y, p2.z, p2.x, p2.y, p2.z)
    const c = dist3D(p3.x, p3.y, p3.z, p2.x, p2.y, p2.z)
    const cosA = (b * b + c * c - a * a) / (2 * c * b)
    return cosA
}

// 手势识别逻辑
function isFistGesture(landmarks) {
    const indexFigure2 = landmarks[7];
    const indexFigure3 = landmarks[6];
    const indexFigure4 = landmarks[5];
    const thumb1 = landmarks[4];
    const thumb2 = landmarks[3];
    const thumb3 = landmarks[2];
    const thumb4 = landmarks[1];
    const middleFinger2 = landmarks[11];
    const middleFinger3 = landmarks[10];
    const middleFinger4 = landmarks[9];
    const ringFinger2 = landmarks[15];
    const ringFinger3 = landmarks[14];
    const ringFinger4 = landmarks[13];
    const pinky2 = landmarks[19];
    const pinky3 = landmarks[18];
    const pinky4 = landmarks[17];

    // 判断手势一
    if (
        angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        (angle(thumb1, thumb2, thumb3) > -0.9 || angle(thumb2, thumb3, thumb4) > -0.9) &&
        angle(pinky2, pinky3, pinky4) > -0.8 &&
        angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
        angle(pinky2, pinky3, pinky4) > -0.5 &&
        angle(middleFinger2, middleFinger3, middleFinger4) > -0.5
    ) {
        return 1;
    } else if (
        angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
        (angle(thumb1, thumb2, thumb3) > -0.9 || angle(thumb2, thumb3, thumb4) > -0.9) &&
        angle(pinky2, pinky3, pinky4) > -0.8
    ) {
        return 3;
    } else if (
        angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
        angle(pinky2, pinky3, pinky4) < -0.8 &&
        angle(thumb1, thumb2, thumb3) > -0.9
    ) {
        return 4;
    } else if (
        angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
        angle(pinky2, pinky3, pinky4) < -0.8 &&
        angle(thumb1, thumb2, thumb3) < -0.8
    ) {
        return 5;
    } else if (
        angle(indexFigure2, indexFigure3, indexFigure4) > -0.5 &&
        angle(middleFinger2, middleFinger3, middleFinger4) > -0.5 &&
        angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
        angle(pinky2, pinky3, pinky4) > -0.5 &&
        angle(thumb1, thumb2, thumb3) < -0.8
    ) {
        return 101;
    } else if (
        angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        angle(middleFinger2, middleFinger3, middleFinger4) > -0.5 &&
        angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
        angle(pinky2, pinky3, pinky4) > -0.5 &&
        angle(thumb1, thumb2, thumb3) < -0.8
    ) {
        return 102;
    } else if (
        angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
        angle(pinky2, pinky3, pinky4) > -0.5 &&
        (angle(thumb1, thumb2, thumb3) > -0.9 || angle(thumb2, thumb3, thumb4) > -0.9) &&
        angle(landmarks[8], landmarks[9], landmarks[12]) > 0.995
    ) {
        return 201;
    } else if (
        angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        (angle(thumb1, thumb2, thumb3) > -0.9 || angle(thumb2, thumb3, thumb4) > -0.9) &&
        angle(ringFinger2, ringFinger3, ringFinger4) > -0.8 &&
        angle(pinky2, pinky3, pinky4) > -0.8 &&
        angle(landmarks[6], landmarks[0], landmarks[10]) < 0.99
    ) {
        return 2;
    }
    return false;
}

console.log('👷 手势识别Worker已启动 - 版本1.0.0')

self.onmessage = function (e) {
    if (WORKER_CONFIG.debug) {
        console.log('🔄 Worker收到消息:', e.data.type)
    }
    const { type, data } = e.data

    if (type === 'test') {
        console.log('🧪 收到测试消息:', data)
        self.postMessage({ type: 'test', data: 'Worker响应正常 - 版本1.0.0' })
        return
    }

    if (type === 'processLandmarks') {
        const { landmarks, handedness } = data
        if (WORKER_CONFIG.debug) {
            console.log('🤲 开始处理' + handedness + '手的关键点数据...')
        }

        try {
            const gesture = isFistGesture(landmarks)
            if (WORKER_CONFIG.debug) {
                const gestureDesc = gesture ? WORKER_CONFIG.gestureTypes[gesture] || `手势${gesture}` : '无手势'
                console.log('🎯 手势识别结果: ' + handedness + '手 - ' + gestureDesc)
            }

            if (gesture) {
                const gestureDesc = WORKER_CONFIG.gestureTypes[gesture] || `手势${gesture}`
                console.log('✅ 识别到手势，发送回主线程: ' + handedness + '手 - ' + gestureDesc)
                self.postMessage({
                    type: 'gestureDetected',
                    data: {
                        hand: handedness,
                        gesture: gesture,
                        gestureType: gestureDesc,
                        landmarks: landmarks
                    }
                })
            }
        } catch (error) {
            console.error('❌ Worker处理' + handedness + '手时发生错误:', error)
            self.postMessage({
                type: 'error',
                data: {
                    hand: handedness,
                    error: error.message
                }
            })
        }
    }
}

self.onerror = function (error) {
    console.error('❌ Worker全局错误:', error)
} 
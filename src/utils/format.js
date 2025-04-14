/**
 * 格式化文件大小
 * @param {Number} byte 文件大小（字节）
 * @returns {String} 格式化后的文件大小
 */
export function formatFileSize(byte) {
  if (byte > 1024 * 1024) {
    return parseFloat(byte / 1024 / 1024).toFixed(2) + ' MB'
  }
  if (byte > 1024) {
    return parseFloat(byte / 1024).toFixed(2) + ' KB'
  }
  return parseFloat(byte).toFixed(2) + ' B'
}

/**
 * 格式化时间
 * @param {String} time 时间字符串
 * @returns {String} 格式化后的时间
 */
export function formatTime(time) {
  const dayjs = require('dayjs')
  const utc = require('dayjs/plugin/utc')
  const timezone = require('dayjs/plugin/timezone')

  dayjs.extend(utc)
  dayjs.extend(timezone)
  return dayjs(time).tz('Asia/Shanghai').format()
}

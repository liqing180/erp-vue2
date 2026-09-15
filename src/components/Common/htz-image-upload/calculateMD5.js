import SparkMD5 from 'spark-md5' // 如果你使用的是ES6模块
// 或者 const SparkMD5 = require('spark-md5'); // 如果你使用的是CommonJS模块

export default function calculateMD5(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    reader.onload = (e) => {
      spark.append(e.target.result) // Append array buffer
      if (reader.readyState === 2) {
        // DONE state
        const md5 = spark.end()
        resolve(md5)
      }
    }
    reader.onerror = () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Error reading the file.')
      reader.abort()
    }
    reader.readAsArrayBuffer(file) // Read as ArrayBuffer
  })
}

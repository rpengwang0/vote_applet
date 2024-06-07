//获取时间戳
const gerTimestamp = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return '' + year + month + day + hour + minute + second
}
const getNowTimes = date => {
  console.log(date)
  let t = new Date()
  t.setDate(t.getDate() + date)
  
  const y = t.getFullYear();
  const m = (t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1; //获取当前月份的日期 
  const d = t.getDate() < 10 ? '0' + t.getDate() : t.getDate();
  const h = t.getHours() < 10 ? '0' + t.getHours() : t.getHours();
  const mi = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
  return y + '-' + m + '-' + d + ' ' + h + ':' + mi
}
module.exports = {
  gerTimestamp: gerTimestamp,
  getNowTimes: getNowTimes
}
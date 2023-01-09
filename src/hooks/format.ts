export function useFormat({ dat, dateDelimiter = '-', timeDelimiter = ':', midDelimiter = ' ' }) {
  // 获取年月日，时间
  const year = dat.getFullYear()
  const mon = dat.getMonth() + 1 < 10 ? `0${dat.getMonth() + 1}` : dat.getMonth() + 1
  const data = dat.getDate() < 10 ? `0${dat.getDate()}` : dat.getDate()
  const hour = dat.getHours() < 10 ? `0${dat.getHours()}` : dat.getHours()
  const min = dat.getMinutes() < 10 ? `0${dat.getMinutes()}` : dat.getMinutes()
  const sec = dat.getSeconds() < 10 ? `0${dat.getSeconds()}` : dat.getSeconds()

  const newDate =
    year + dateDelimiter + mon + dateDelimiter + data + midDelimiter + hour + timeDelimiter + min + timeDelimiter + sec
  return newDate
}

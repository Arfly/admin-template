import { FormRules } from 'element-plus'

const timeRange = (rule, value, callback) => {
  if (!value) {
    callback()
  }

  const [startTime, endTime] = value || []
  const range = 3600 * 1000 * 24 * 30
  const res = new Date(endTime).getTime() - new Date(startTime).getTime() <= range
  if (res) {
    callback()
  } else {
    callback(new Error('查询时间范围过大，请将起止时间调整为一个月以内!'))
  }
}

export const TIME_RANGE_VALIDATOR: FormRules = {
  time: [
    {
      validator: timeRange,
      trigger: 'blur'
    }
  ]
}

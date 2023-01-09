export const TIME_SHORTCUTS = [
  {
    text: '今天',
    value: () => {
      const start = new Date(new Date().setHours(0, 0, 0, 0))
      const end = new Date(new Date().setHours(23, 59, 59))
      return [start, end]
    }
  },
  {
    text: '昨天',
    value: () => {
      const start = new Date(new Date().setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1)
      const end = new Date(new Date().setHours(23, 59, 59) - 3600 * 1000 * 24 * 1)
      return [start, end]
    }
  },
  {
    text: '近三天',
    value: () => {
      const start = new Date(new Date().setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 2)
      const end = new Date(new Date().setHours(23, 59, 59))
      return [start, end]
    }
  },
  {
    text: '近一周',
    value: () => {
      const start = new Date(new Date().setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 6)
      const end = new Date(new Date().setHours(23, 59, 59))
      return [start, end]
    }
  }
]

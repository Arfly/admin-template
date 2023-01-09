export const HTTP_LOADING_LIST = [
  '/user/list',
  '/uc/organization-tree',
  '/user/detail',
  '/user/bind-org',
  '/user/edit',
  '/user/position/existed',
  '/user/organization/existed',
  '/uc/organization-list',
  '/uc/organization-user-detail',
  '/uc/organization-detail'
]

export const needLoadingStatus = (url: string) => {
  let matched = false
  for (let i = 0; i < HTTP_LOADING_LIST.length; i++) {
    if (url.includes(HTTP_LOADING_LIST[i])) {
      matched = true
      break
    }
  }
  return matched
}

import useCookie from '@/hooks/useCookie'
const { remove, getCookie } = useCookie()

export const cleanSystem = (search = { loginType: null, backurl: null }) => {
  const cookie = getCookie()
  const method = search.loginType || cookie.loginType
  const systemCode = cookie.systemCode ? `?systemCode=${cookie.systemCode}` : ''
  const rebound = search.backurl ? '&rebound=1' : ''
  sessionStorage.clear()
  remove('token')
  remove('userLevel')
  localStorage.clear()
  if (method === 'uniform_identity') {
    const url = encodeURIComponent(`${import.meta.env.VITE_APP_REDIRECT_URL}${systemCode}${rebound}`)
    location.assign(
      `${import.meta.env.VITE_APP_URL}/zwrz/rz/sso/logout?client_id=${
        import.meta.env.VITE_APP_CLIENT_ID
      }&backurl=${url}`
    )
    return false
  }
  if (search.backurl) {
    location.href = decodeURIComponent(search.backurl)
    return false
  }
  return true
}

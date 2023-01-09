import { checkNameExist, checkPhoneExist, checkUniformIdExist, SUCCESS_CODE } from '@/api'
import { FormItemRule } from 'element-plus'

export type Validator = FormItemRule[]
// 手机号的表单校验
export const PHONE_VALIDATOR: Validator = [
  {
    required: true,
    message: '请输入手机号',
    trigger: 'blur'
  },
  {
    required: true,
    trigger: 'blur',
    pattern: /^[1][3-9][0-9]{9}$/,
    message: '请输入正确的手机号码'
  }
]
// 密码的表单校验
export const PWD_VALIDATOR: Validator = [
  {
    required: true,
    trigger: 'blur',
    message: '请输入密码'
  },
  { min: 8, max: 20, message: '密码长度要在8-20位', trigger: 'blur' },
  {
    required: true,
    trigger: 'blur',
    message: '密码不符合要求，需要具备字母、数字，长度不少于8位',
    pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/
  }
]

export const EMAIL_VALIDATOR: Validator = [
  {
    trigger: 'blur',
    message: '请输入正确的邮箱地址',
    pattern: /^([\w-]+)*@[\w-]+(\.[\w-]+)+$/
  }
]

// 用户姓名表单校验
export const REAL_NAME_VALIDATOR: Validator = [
  { required: true, message: '请输入姓名', trigger: 'blur' },
  { max: 10, message: '姓名长度不能超过10个字符' }
]

export const VERIFY_NUMBER: Validator = [
  { trigger: 'blur', message: '证件长度限制为18位', len: 18 },
  {
    trigger: 'blur',
    message: '证件证长度限制为18位，包含大写字母或数字',
    pattern: /^[0-9A-Z]{1,18}$/
  }
]

export const PASSPORT_VALIDATOR: Validator = [
  { trigger: 'blur', message: '护照长度限制为9位，', len: 9 },
  {
    trigger: 'blur',
    message: '护照证长度限制为9位，包含大写字母或数字',
    pattern: /^[0-9A-Z]{1,9}$/
  }
]

export const UNIFORM_ID: Validator = [
  { trigger: 'blur', message: '22位数字和小写字母', len: 22 },
  { trigger: 'blur', message: '22位数字和小写字母', pattern: /^[a-z0-9]{22}$/ }
]

export const getUniformIdValidator = (userId?: string) => {
  const validator: FormItemRule = {
    validator: (rule, value, callback) => {
      if (value) {
        if (!/^[a-z0-9]{22}$/.test(value)) {
          callback(new Error('22位数字和小写字母'))
        } else {
          checkUniformIdExist(userId ? { userId, uniformId: value } : { uniformId: value }).then(res => {
            if (res.code === SUCCESS_CODE && res.data) {
              callback(new Error('省认证用户ID已存在'))
            } else {
              callback()
            }
          })
        }
      } else {
        callback()
      }
    }
  }
  return [validator]
}

export const getMobileValidator = (userId?: string) => {
  const validator: FormItemRule = {
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (value) {
        if (!/^[1][3-9][0-9]{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          checkPhoneExist(userId ? { userId, mobile: value } : { mobile: value }).then(res => {
            if (res.code === SUCCESS_CODE && res.data) {
              callback(new Error('手机号已绑定'))
            } else {
              callback()
            }
          })
        }
      } else {
        callback(new Error('请输入手机号'))
      }
    }
  }
  return [validator]
}
export const getNameValidator = (userId?: string) => {
  const validator: FormItemRule = {
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (value) {
        if (`${value}`.length > 20) {
          callback(new Error('用户名长度不能超过20个字符'))
        } else if (!/^[0-9a-zA-Z._-]{1,20}$/.test(value)) {
          callback(new Error('用户名不可包含$￥?等特殊字符及空格'))
        } else {
          checkNameExist(userId ? { userId, name: value } : { name: value }).then(res => {
            if (res.code === SUCCESS_CODE && res.data) {
              callback(new Error('用户名已存在'))
            } else {
              callback()
            }
          })
        }
      } else {
        callback(new Error('请输入用户名'))
      }
    }
  }
  return [validator]
}

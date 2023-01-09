import { EditUserParamsForSuper, NewUserData } from '@/api'
import { regToPassword } from '@/common/utils'
import {
  EMAIL_VALIDATOR,
  getMobileValidator,
  getNameValidator,
  getUniformIdValidator,
  PHONE_VALIDATOR,
  PWD_VALIDATOR,
  REAL_NAME_VALIDATOR,
  UNIFORM_ID,
  Validator
} from './common'

export const NEW_USER_VALIDATOR: { [key in keyof NewUserData]?: Validator } = {
  realName: REAL_NAME_VALIDATOR,
  pwd: PWD_VALIDATOR,
  organizationId: [
    {
      required: true,
      message: '请选择所属组织',
      trigger: 'blur'
    }
  ],
  email: EMAIL_VALIDATOR,
  name: getNameValidator(),
  mobile: getMobileValidator(),
  uniformId: getUniformIdValidator()
}

export function useUserValidator(userId?: string) {
  return {
    ...EDIT_USER_VALIDATOR,
    name: getNameValidator(userId),
    mobile: getMobileValidator(userId),
    uniformId: getUniformIdValidator(userId)
  }
}

export const EDIT_USER_VALIDATOR: {
  [key in keyof EditUserParamsForSuper]?: Validator
} = {
  email: EMAIL_VALIDATOR,
  mobile: PHONE_VALIDATOR,
  realName: REAL_NAME_VALIDATOR,
  uniformId: UNIFORM_ID,
  credentialsCode: []
}

// 重置密码
const equalToPassword = (rule, value, callback) => {
  const msg = regToPassword(value)
  msg ? callback(new Error(msg)) : callback()
}
export const RESET_PWD: { [key: string]: Validator } = {
  newPwd: [
    { min: 8, max: 20, message: '密码长度要在8-20位', trigger: 'blur' },
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度要在8-20位', trigger: 'blur' }
  ]
}

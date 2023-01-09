import { regToPassword } from '@/common/utils'
import { FormRules } from 'element-plus'

const equalToPassword = (rule, value, callback) => {
  const msg = regToPassword(value)
  if (value === '********' || !msg) {
    callback()
  } else {
    callback(new Error(msg))
  }
}

export const EDIT_SYS_VALIDATOR = {
  name: [
    { required: true, message: '请输入系统名称', trigger: 'blur' },
    { max: 20, message: '系统名称应小于等于20个字符', trigger: 'blur' }
  ],
  adminPwd: [
    { required: true, message: '请输入管理员密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度要在8-20位', trigger: 'blur' },
    {
      required: true,
      validator: equalToPassword,
      message: '密码不符合要求，需要具备大小写字母、符号、数字，长度在8-20位之间',
      trigger: 'blur'
    }
  ],
  adminName: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { max: 20, message: '管理员账号应小于等于20个字符', trigger: 'blur' }
  ],
  unitBelong: [{ required: true, message: '请输入归属单位', trigger: 'blur' }],
  redirectUrl: [{ required: true, message: '请输入回调地址', trigger: 'blur' }]
}

export const NEW_SYS_VALIDATOR: FormRules = {
  name: [
    { required: true, message: '请输入系统名称', trigger: 'blur' },
    { max: 20, message: '系统名称应小于等于20个字符', trigger: 'blur' }
  ],
  adminPwd: [
    { required: true, message: '请输入管理员密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度要在8-20位', trigger: 'blur' },
    {
      required: true,
      validator: equalToPassword,
      message: '密码不符合要求，需要具备大小写字母、符号、数字，长度在8-20位之间',
      trigger: 'blur'
    }
  ],
  adminName: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { max: 20, message: '管理员账号应小于等于20个字符', trigger: 'blur' }
  ],
  contactCode: [
    { required: true, message: '请输入系统编码', trigger: 'blur' },
    { min: 8, max: 40, message: '系统编码长度需在8-40位', trigger: 'blur' },
    {
      required: true,
      pattern: /^(?![a-z]+$)[a-z-]{8,40}$/,
      trigger: 'blur',
      message: '系统编码使用小写字母包含中划线，8-40位'
    }
  ],
  unitBelong: [{ required: true, message: '请输入归属单位', trigger: 'blur' }],
  redirectUrl: [{ required: true, message: '请输入回调地址', trigger: 'blur' }]
}

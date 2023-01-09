import { FormRules } from 'element-plus'

export const NEW_ORG_VALIDATOR: FormRules = {
  name: [
    {
      required: true,
      message: '请输入组织名称',
      trigger: 'blur'
    },
    {
      trigger: 'blur',
      max: 20,
      message: '组织名称不超过20个字'
    }
  ],
  unitTypeCode: [
    {
      required: true,
      message: '请选择组织类型',
      trigger: 'blur'
    }
  ],
  creditCode: [
    {
      len: 18,
      message: '请输入正确的统一信用代码'
    },
    {
      message: '请输入正确的统一信用代码',
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Z]{1,18}$/,
      trigger: 'blur'
    }
  ]
}

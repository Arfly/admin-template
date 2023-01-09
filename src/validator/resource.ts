import { FormRules } from 'element-plus'

export const NEW_RESOURCE_VALIDATOR: FormRules = {
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择父级资源', trigger: 'blur' }],
  systemId: [{ required: true, message: '请选择归属系统', trigger: 'blur' }],
  resourceType: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入资源编码', trigger: 'blur' },
    { min: 8, max: 40, message: '资源编码长度需在8-40位', trigger: 'blur' },
    {
      pattern: /^[a-z-]{8,40}$/,
      message: '8-40位小写字母+中划线组成',
      trigger: 'blur'
    }
  ]
}

export const EDIT_RESOURCE_VALIDATOR: FormRules = {
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }]
}

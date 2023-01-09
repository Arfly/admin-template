import { FormRules } from 'element-plus'
import { REAL_NAME_VALIDATOR, EMAIL_VALIDATOR, UNIFORM_ID } from './common'

export const EDIT_PERSON_VALIDATOR: FormRules = {
  realName: REAL_NAME_VALIDATOR,
  email: EMAIL_VALIDATOR,
  uniformId: UNIFORM_ID
}

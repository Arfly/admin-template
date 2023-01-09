import { ElTableColumn } from 'element-plus'
import { VNode } from 'vue'

interface OptionsAttr {
  label: string
  prop: string
  type: string
  width: number
  attr: {
    [key in keyof InstanceType<typeof ElTableColumn>['$props']]: InstanceType<typeof ElTableColumn>['$props'][key]
  }
  customerRender: (row) => VNode
}

export type TableColumn = Partial<OptionsAttr>

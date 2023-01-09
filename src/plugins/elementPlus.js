import { ElDialog, ElTable, ElTableColumn } from 'element-plus'
import { app } from './app'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

ElTableColumn.props.showOverflowTooltip = {
  type: Boolean,
  default: true
}

ElDialog.props.closeOnClickModal = {
  type: Boolean,
  default: false
}

ElTable.props.border = {
  type: Boolean,
  default: true
}
app.component('Search', Search)
app.component('RefreshLeft', RefreshLeft)

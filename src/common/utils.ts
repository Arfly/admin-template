/**
 * @Description: 工具类
 * @Author: zengqingkai
 * @Date: 2022/9/5
 */

import { DefaultOrgTreeItem } from '@/api'

export const regToPassword = value => {
  let result = ''
  const exp = /^(?=.*?[A-Z])(?=(.*[a-z])+)(?=(.*[\d])+)(?=(.*[\W])+)(?!.*\s).{8,20}$/
  if (!exp.test(value)) {
    result = '需要同时包含大小写字母，数字和符号四种元素'
  }
  return result
}

export const RegToCode = value => {
  let result = ''
  const exp = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{8,20}$/
  if (!exp.test(value)) {
    result = '系统联系码需要具备字母、数字'
  }
  return result
}

export function getTreeDeep(tree: DefaultOrgTreeItem): number {
  let deep = 0
  if (!tree) {
    return deep
  }
  function walk(tree: DefaultOrgTreeItem): number {
    deep++
    if (tree.children && tree.children.length > 0) {
      const childrenDeepArr = tree.children.map(child => getTreeDeep(child))
      deep += Math.max(...childrenDeepArr)
    }
    return deep
  }

  return walk(tree)
}

export const getTreeParentPath = (treeNode: DefaultOrgTreeItem) => {
  const result = []
  const ids = []
  function getParent(data) {
    if (data.id) {
      result.splice(0, 0, data.name)
      ids.splice(0, 0, data.id)
    }

    if (data.parentTreeNode) {
      getParent(data.parentTreeNode)
    }
  }
  getParent(treeNode)

  return {
    path: result.join('/'),
    ids: ids.join(',')
  }
}

interface TreeNode {
  id: string
  name: string
  parentName: string
  children: TreeNode[]
}
export function walkTreeForParentName(tree: TreeNode) {
  function walk(data: TreeNode) {
    if (data.children) {
      data.children.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        item.parentName = data.name
        walk(item)
      })
    }
  }
  walk(tree)
}

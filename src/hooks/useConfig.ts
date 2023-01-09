/**
 * @Description:
 * @Author: fei.han
 * @Date: 2022/11/15
 */
export enum RESOURCES_TYPE {
  '菜单' = 1,
  '按钮',
  '页面',
  'tab'
}

export enum USER_STATUS {
  '停用' = 0,
  '启用',
  '全部'
}

export enum SOURCE_TYPE {
  '内部新增' = 0,
  '来源2',
  '市统一认证',
  '全部'
}

export enum CREDENTIALS_TYPE {
  '身份证' = 1,
  '军官证',
  '士官证',
  '义务兵证',
  '港澳台居民居住证',
  '外籍人士在我国永久居住证',
  '护照',
  '其他'
}

export enum UNIT_TYPE {
  '单位' = 10,
  '内设机构' = 11,
  '其他' = 99
}

/**
 * 将枚举类型转换为对象数组
 * @param enumVal 枚举类型
 */
function convertEnumToObject(enumVal: {
  [key: string | number]: string | number;
}) {
  const keys = Object.values(enumVal).filter(item => typeof item === 'string');
  return keys.map(key => ({
    key: enumVal[key],
    value: key
  }));
}

export const UNIT_TYPE_LIST = convertEnumToObject(UNIT_TYPE);
export const USER_STATUS_LIST = convertEnumToObject(USER_STATUS);
export const USER_SOURCE_LIST = convertEnumToObject(SOURCE_TYPE);
export const CREDENTIALS_TYPE_LIST = convertEnumToObject(CREDENTIALS_TYPE);
export const RESOURCES_TYPE_LIST = convertEnumToObject(RESOURCES_TYPE);

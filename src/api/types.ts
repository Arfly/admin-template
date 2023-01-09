/**
 * 组织来源（0=来源1，1=来源2，2=来源3）
 */
export type Source = 0 | 1 | 2

/**
 * 要修改的目标状态 1:启用，2:停用
 */
export type TargetStatus = 1 | 2

/**
 * 临时权限，0-否，1-是
 */
export type Brief = 0 | 1

/**
 * 临时权限期限，3-三天，7-七天
 */
export type TimeLimit = '3' | '7'

/**
 * 绑定标识，如果角色关联了，则为1.没有关联则为0
 */
export type BindTag = 0 | 1

/**
 * 证件类型，1-身份证，2-军官证，3-士官证，4-义务兵证，5-港澳台居民居住证，6-外籍人士在我国永久居住证，7-护照，8-其他
 */
export type CredentialsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/**
 * 是否主要组织，1-是，0-否
 */
export type Major = 0 | 1

/**
 * 性别，1-男，2女
 */
export type Gender = 1 | 2

/**
 * 组织类型代码（10=单位；11=内设机构；99=其他）
 */
export type UnitTypeCode = '10' | '11' | '99'

/**
 * 启用命令：0-启用，1-停用
 */
export type SystemCmd = 0 | 1

/**
 * 状态（1=启用；0=禁用）
 */
export type Status = 0 | 1

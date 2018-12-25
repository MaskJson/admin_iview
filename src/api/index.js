// 统一请求路径前缀在libs/axios.js中修改
import { deleteRequest, getRequest, postRequest, uploadFileRequest } from '@/libs/axios'

// 个人中心编辑
export const userInfoEdit = (params) => {
  return postRequest('/user/edit', params)
}
// 个人中心修改密码
export const changePass = (params) => {
  return postRequest('/user/modifyPass', params)
}
// 解锁
export const unlock = (params) => {
  return postRequest('/user/unlock', params)
}

// 绑定账号
export const relate = (params) => {
  return postRequest('/social/relate', params)
}
// 获取JWT
export const getJWT = (params) => {
  return getRequest('/social/getJWT', params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
  return getRequest('/user/getAll', params)
}

// 启用用户
export const enableUser = (id, params) => {
  return postRequest(`/user/sys/enable/${id}`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
  return postRequest(`/user/sys/disable/${id}`, params)
}

// 分页获取日志数据
export const getLogListData = (params) => {
  return getRequest('/log/getAllByPage', params)
}
// 搜索获取日志数据
export const getSearchLogData = (params) => {
  return getRequest('/log/search', params)
}
// 删除日志
export const deleteLog = (ids, params) => {
  return deleteRequest(`/log/delByIds/${ids}`, params)
}
// 清空日志
export const deleteAllLog = (params) => {
  return deleteRequest('/log/delAll', params)
}

/********************************系统api**********************************/
export const getMenuList = (userId) => {
  return getRequest('/console/sys/permission/getMenuListByUserId/' + userId)
}

// 登陆
export const login = (params) => {
  return postRequest('/console/sys/user/login', params)
}
// 获取用户登录信息
export const getUserInfo = (params) => {
  return getRequest('/console/sys/user/getUserInfo', params)
}
// 获取用户数据 多条件
export const getUserListData = (params) => {
  return getRequest('/console/sys/user/getByCondition', params)
}
// 添加用户
export const addUser = (params) => {
  return postRequest('/console/sys/user/add', params)
}
// 编辑用户
export const editUser = (params) => {
  return postRequest('/console/sys/user/edit', params)
}
// 获取全部角色数据
export const getAllRoleList = (params) => {
  return getRequest('/console/sys/role/getAllList', params)
}
// 分页获取角色数据
export const getRoleByPage = (params) => {
  return getRequest('/console/sys/role/getRoleByPage', params)
}
// 添加角色
export const addRole = (params) => {
  return postRequest('/console/sys/role/add', params)
}
// 编辑角色
export const editRole = (params) => {
  return postRequest('/console/sys/role/edit', params)
}
// 删除用户
export const deleteUser = (ids, params) => {
  return deleteRequest(`/console/sys/role/delByIds/${ids}`, params)
}
// 分配角色权限
export const editRolePerm = (id, params) => {
  return postRequest(`/console/sys/role/editRolePerm/${id}`, params)
}
// 删除角色
export const deleteRole = (ids, params) => {
  return deleteRequest(`/console/sys/role/delAllByIds/${ids}`, params)
}

// 获取全部权限数据
export const getAllPermissionList = (params) => {
  return getRequest('/console/sys/permission/getAllList', params)
}
// 添加权限
export const addPermission = (params) => {
  return postRequest('/console/sys/permission/add', params)
}
// 编辑权限
export const editPermission = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
// 删除权限
export const deletePermission = (ids, params) => {
  return deleteRequest(`/console/sys/permission/delByIds/${ids}`, params)
}
// 广告管理之添加广告位
export const addAdvertise = (params) => {
  return postRequest('/console/advert/save', params)
}
// 广告位管理之查询广告详情
export const getAdvertiseDetail = (params) => {
  return getRequest('/console/advert/details', params)
}
// 广告位管理之分页查询
export const getAdvertiseInfo = (params) => {
  return getRequest('/console/advert/getPage', params)
}
// ali云token接口
export const getAliToken = () => {
  return getRequest('/console/aliyun/ali-token')
}




export const addDepartment = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const addQuartz = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const deleteDepartment = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const deleteQuartz = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const editDepartment = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const editQuartz = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const getQuartzListData = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const getTagNavListFromLocalstorage = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const initDepartment = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const loadDepartment = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const pauseQuartz = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const resumeQuartz = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const routeEqual = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const setTagNavListInLocalstorage = (params) => {
  return postRequest('/console/sys/permission/edit', params)
}
export const changePassword = (params) => {
  return postRequest('/console/sys/user/changePassword', params);
}













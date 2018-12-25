import {getParams} from '@/libs/util'

const USER_MAP = {
  super_admin: {
    "other": {},
    "success": true,
    "message": "",
    "code": 200,
    "timestamp": 1540353129101,
    "result": {
      "other": {},
      "id": 1,
      "username": "qinhe",
      "password": null,
      "nickName": "秦贺",
      "avatar": "https://s1.ax1x.com/2018/05/19/CcdVQP.png",
      "type": 1,
      "status": 0,
      "createTime": "2018-10-23T06:37:05.000+0000",
      "updateTime": null,
      "roles": [{
        "other": {},
        "id": 1,
        "roleName": "ROLE_TEST",
        "createTime": "2018-10-23T08:29:56.000+0000",
        "updateTime": "2018-10-23T08:31:52.000+0000"
      }],
      "permissions": [{
        "other": {},
        "id": 1,
        "name": "sys",
        "level": 1,
        "type": 0,
        "title": "系统管理",
        "path": "/sys",
        "component": "Main",
        "icon": "ios-settings",
        "buttonType": "",
        "parentId": null,
        "description": "",
        "sortOrder": 1.00,
        "status": 0,
        "url": "",
        "children": null,
        "permTypes": null,
        "expand": true,
        "checked": false,
        "selected": false
      }]
    }
  },
  admin: {
    success: true,
    code: 200,
    result: {
      token: 'admin'
    }
    // name: 'admin',
    // user_id: '2',
    // access: ['admin'],
    // token: 'admin',
    // avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  console.log(req.url)
  req = JSON.parse(req.body)
  return {
    success: true,
    code: 200,
    result: {
      token: req.username
    }
  }
    ;
}

export const getUserInfo = req => {
  console.log(req.url)
  return USER_MAP['super_admin']
}

export const logout = req => {
  return null
}

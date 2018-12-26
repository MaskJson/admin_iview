import Main from '@/view/main/Main.vue'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里


export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    {
      path: 'home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true
      },
      component: () => import('@/view/home/home.vue')
    }
    // { path: 'home', title: { i18n: 'home' }, name: 'home_index', component: () => import('@/view/home/home.vue') },
    // { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
    // { path: 'ownspace-old', title: '个人中心(旧)', name: 'ownspace_old', component: () => import('@/views/own-space/own-space-old.vue') },
    // { path: 'change-pass', title: '修改密码', name: 'change_pass', component: () => import('@/views/change-pass/change-pass.vue') },
    // { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
    // { path: 'add', title: '添加', name: 'add', component: () => import('@/views/xboot-vue-template/new-window/add.vue') },
    // { path: 'edit', title: '编辑', name: 'edit', component: () => import('@/views/xboot-vue-template/new-window/edit.vue') },
  ]
};

export const routers = [
  {
    ...otherRouter
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  // {
  //   path: '*',
  //   name: 'error_404',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/404.vue')
  // },
  {

    path: '/403',
    meta: {
      title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/view/error-page/403.vue')
  },
  {
    path: '/locking',
    name: 'locking',
    component: () => import('@/view/main/components/lockscreen/components/locking-page.vue')
  }
]



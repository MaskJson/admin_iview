import axios from 'axios'
import config from '@/config'
import {getStore, setStore} from './storage'
import {router} from '../router/index'
import {Message} from 'iview'
import Cookies from 'js-cookie'
import {stringify} from 'qs';

// 统一请求路径前缀
let base = process.env.NODE_ENV === 'production' ? config.baseUrl.pro : config.baseUrl.dev;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置post请求头类型
// 超时设定
axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
  let accessToken = getStore('accessToken');
  Object.assign(config.headers, {
    'accessToken': accessToken
  })
  if (config.method === 'post') {
    config.data = stringify(config.data);
  }
  return config;
}, err => {
  Message.error('请求超时');
  return Promise.resolve(err);
});

// http response 拦截器
axios.interceptors.response.use(response => {
  const data = response.data;

  // 根据返回的code值来做不同的处理(和后端约定)

  if (data) {
    switch (data.code) {
      case 401:
        Message.error(data.message);
        // 未登录 清除已登录状态
        Cookies.set('userInfo', '');
        setStore('accessToken', '');
        router.push('/login');
        break;
      case 403:
        // 没有权限
        if (data.message !== null) {
          Message.error(data.message);
        } else {
          Message.error("未知错误");
        }
        break;
      case 500:
        // 错误
        if (data.message !== null) {
          Message.error(data.message);
        } else {
          Message.error("未知错误");
        }
        break;
      default:
        return data;
    }
  }
  return data;
}, (err) => {
  // 返回状态码不为200时候的错误处理
  Message.error(err.toString());
  return Promise.resolve(err);
});

export const getRequest = (url, params) => {
  let accessToken = getStore('accessToken');
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': accessToken
    }
  });
};

export const postRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    // transformRequest: [function (data) {
    //   let ret = '';
    //   for (let it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
    //   }
    //   return ret;
    // }],
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'accessToken': accessToken
    // }
  });
};
// export const postRequest = (url, params) => {
//   return new Promise((resolve, reject) => {
//     axios.post(`${base}${url}`, params)
//       .then(response => {
//         resolve(response.data);
//       }, err => {
//         reject(err);
//       })
//       .catch((error) => {
//         reject(error);
//       })
//   })
// }


export const putRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  });
};

export const deleteRequest = (url, params) => {
  let accessToken = getStore('accessToken');
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': accessToken
    }
  });
};

export const uploadFileRequest = (url, params) => {
  let accessToken = getStore('accessToken');
  return axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': accessToken
    }
  });
};

export default {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
}

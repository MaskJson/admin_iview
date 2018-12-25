/**
 * 配置开发环境和生产环境变量
 * aliTokenUrl: 阿里云请求node临时token接口地址
 * bucket: 阿里云存储域地址
 * aliCallbackImgUrl: 拼接阿里云图片外网链接地址（前缀）
 */
import {getAliToken} from '@/api'
const domain = window.location.protocol + '//' + window.location.host;
let bucket = 'taoke-prod';
let aliCallbackImgUrl = 'https://taoke-prod.oss-cn-hangzhou.aliyuncs.com/';
let aliTokenUrl = domain + '/api/ali-token.json';

// if (process.env.NODE_ENV === 'development') {
//   bucket = 'xiuba-dev';
//   aliCallbackImgUrl = 'https://xiuba-dev.oss-cn-hangzhou.aliyuncs.com/';
// }

/**
 * 阿里云分片上传file
 */
const aliUploadConfig = {
  aliUploadImg(key, file) {
    return new Promise(async (resolve, reject) => {
      try {
        // 从后台获取STS临时token
        const result = await getAliToken();
        const client = new OSS.Wrapper({
          accessKeyId: result.result.accessKeyId,
          accessKeySecret: result.result.accessKeySecret,
          stsToken: result.result.securityToken,
          bucket: bucket,
          endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
          secure: true
        });
        const aliClineRes = await client.multipartUpload(key, file);
        resolve(aliClineRes);
      } catch (e) {
        reject(e);
      }
    })
  },

  /**
   * 阿里云上传Buffer文件
   */
  aliUploadImgBuffer(key, file) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await getAliToken();
        const client = new OSS.Wrapper({
          accessKeyId: result.result.AccessKeyId,
          accessKeySecret: result.result.AccessKeySecret,
          stsToken: result.result.SecurityToken,
          bucket: bucket,
          endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
          secure: true
        });
        const aliClineRes = await client.put(key, file);
        resolve(aliClineRes);
      } catch (e) {
        reject(e)
      }
    })
  }
};

/**
 * 生成当前时间的年月日
 */
export const timeToDate = (time = new Date()) => {
  let Y = time.getFullYear();
  let M = time.getMonth() + 1;
  let D = time.getDate();
  if (M < 10) {
    M = '0' + M
  }
  if (D < 10) {
    D = '0' + D
  }
  return Y.toString() + M.toString() + D.toString();
};
/**
 * 生成当前时间 + 随机20位字符串（字母+ 数字）
 */
const randomString = () => {
  return timeToDate() + '/' + Math.random().toString(36).substr(2) + parseInt(new Date().getTime() / parseInt(Math.random() * 1000 - 100 + 100));
};

export {bucket, aliCallbackImgUrl, aliTokenUrl, domain, aliUploadConfig, randomString}

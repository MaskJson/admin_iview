/**
 * Created by ycb on 2017/7/20.
 */

/**
 * 格式化时间
 * timeSpan：要格式化的时间（毫秒数）
 * format：要格式化的时间格式（YYYY-MM-DD hh:mm:ss）
 */
const dateFormat = (timeSpan, format) => {
  if (!timeSpan) return;
  let date = new Date(timeSpan);
  let o = {
    "M+": date.getMonth() + 1, //月
    "D+": date.getDate(), //天
    "W": "日一二三四五六".charAt(date.getDay()), //星期
    "h+": date.getHours(), //时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季节
    "S": date.getMilliseconds() //毫秒
  };
  if (/(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

/**
 * 格式化手机号码（保留前三位和后四位）
 * number：要格式化的手机号码
 */
const phoneNumberFormat = (number) => {
  if (typeof number !== 'string') {
    number = number.toString();
  }
  return number.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
};

/**
 * 图片地址（平台上传到阿里云的图片需要加hank，直接从淘宝，天猫抓取的图片不需要）
 * src 图片原始地址
 * hank 阿里云图片需要加的hank
 */
const imageSrc = (src, hank) => {
  if (!src) return;
  return src.includes('alicdn.com') ? src : `${src}${hank}`
};

export {dateFormat, phoneNumberFormat, imageSrc}

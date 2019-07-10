// 自定义判断元素类型JS
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key];
    }
    if (toType(o[key]) === "string") {
      o[key] = o[key].trim();
    } else if (toType(o[key]) === "object") {
      o[key] = filterNull(o[key]);
    } else if (toType(o[key]) === "array") {
      o[key] = filterNull(o[key]);
    }
  }
  return o;
}
// 处理时间格式（*天前
function goodTime(str) {
  if (str.toString().indexOf("-") > 0) {
    str = str
      .replace(/T/g, " ")
      .replace(/\.[\d]{3}Z/, "")
      .replace(/(-)/g, "/"); // 将 '-' 替换成 '/'
    str = str.slice(0, str.indexOf(".")); // 删除小数点及后面的数字
  }
  var arr = str.split(/[- : /]/);
  let now = new Date().getTime();
  let oldTime = new Date(
    arr[0],
    arr[1] - 1,
    arr[2],
    arr[3],
    arr[4],
    arr[5]
  ).getTime();
  let difference = now - oldTime;
  let result = "";
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let year = month * 12;
  let _year = difference / year;
  let _month = difference / month;
  let _week = difference / (7 * day);
  let _day = difference / day;
  let _hour = difference / hour;
  let _min = difference / minute;

  if (_year >= 1) {
    result = ~~_year + " 年前";
  } else if (_month >= 1) {
    result = ~~_month + " 个月前";
  } else if (_week >= 1) {
    result = ~~_week + " 周前";
  } else if (_day >= 1) {
    result = ~~_day + " 天前";
  } else if (_hour >= 1) {
    result = ~~_hour + " 个小时前";
  } else if (_min >= 1) {
    result = ~~_min + " 分钟前";
  } else if (_min < 1) {
    result = "刚刚";
  } else {
    result = str;
  }
  return result;
}

// 对象深度拷贝
function clone(obj) {
  // 深度拷贝
  var o;
  switch (toType(obj)) {
    case "undefined":
      break;
    case "string":
      o = obj + "";
      break;
    case "number":
      o = obj - 0;
      break;
    case "boolean":
      o = obj;
      break;
    case "null":
      o = null;
      break;
    case "object":
      o = {};
      for (let k in obj) {
        o[k] = clone(obj[k]);
      }
      break;
    case "array":
      o = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        o.push(clone(obj[i]));
      }
      break;
    default:
      o = obj;
      break;
  }
  return o;
}

/**
 * 时间格式化函数
 * @param {*时间格式:yyyy-MM-dd hh:mm:ss} fmt
 * @param {*时间字符串} date
 */
function dateFtt(fmt, date) {
  if (!(date instanceof Date)) {
    if (!isEmpty(date)) {
      return "无";
    }
    date = new Date(date);
  }
  var o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}
/**
 * 验证参数是否为空
 * @param {*要验证的参数} str
 * @return 为空返回true
 */
function isEmpty(str) {
  let s = str;
  if (typeof str === "string") {
    s = str.replace(/(^\s*)|(\s*$)/g, "");
  } // 去除空格;
  if (s === undefined || s === null || s === "") {
    return true;
  }
}

export default {
  toType: function(obj) {
    return toType(obj);
  },
  filterNull: function(o) {
    return filterNull(o);
  },
  goodTime: function(str) {
    return goodTime(str);
  },
  clone: function(obj) {
    return clone(obj);
  },
  dateFtt: function(fmt, date) {
    return dateFtt(fmt, date);
  },
  isEmpty: function(str) {
    return isEmpty(str);
  }
};

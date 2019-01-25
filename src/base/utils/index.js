/**
 *  页面级别工具类.
 */

import encrypt from './encrypt';
import * as cookies from './cookie';
import dateToTimeStamp from './dateToTimeStamp';

// 获取url的参数
const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [ _queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

/**
 * 判断是否是手机端
 */
function judgeIsMobile() {
    const sUserAgent = navigator.userAgent.toLowerCase();
    const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    const bIsMidp = sUserAgent.match(/midp/i) == "midp";
    const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    const bIsAndroid = sUserAgent.match(/android/i) == "android";
    const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad) {
        return false;
    }
    if (!(bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) { 
        return false;
    } else {
        return true;
    }
}

// 提供中文数字
let cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
/**
 * 数字转大写
 * @param {*} n 
 */
function matchNumber (n) {
    var s = '';
    n = '' + n; // 数字转为字符串
    for (var i = 0; i < n.length; i++) {
        s += cnum[parseInt(n.charAt(i))];
    }
    if (s.length == 2) { // 两位数的时候
        // 如果个位数是0的时候，令改成十
        if (s.charAt(1) == cnum[0]) {
            s = s.charAt(0) + cnum[10];
            // 如果是一十改成十
            if (s == cnum[1] + cnum[10]) {
                s = cnum[10]
            }
        } else if (s.charAt(0) == cnum[1]) {
            // 如果十位数是一的话改成十
            s = cnum[10] + s.charAt(1);
        }
    }
    return s;
}

/**
 * 数组去重
 */
function arrUniq(array){
    var temp = [];
    var index = [];
    var l = array.length;
    for(var i = 0; i < l; i++) {
        for(var j = i + 1; j < l; j++){
            if (array[i] === array[j]){
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}

export default {
    cookies,
    encrypt,
    judgeIsMobile: judgeIsMobile,
    queryString: queryString,
    dateToTimeStamp,
    matchNumber,
    arrUniq
}
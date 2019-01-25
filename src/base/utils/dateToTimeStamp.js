
// 时间戳转换-开始时间
const convertDateStartTime = function(date){
    if(date.indexOf(' ')>-1){
        return new Date(date).getTime();
    }else {
        return new Date(date + ' 00:00:00').getTime()
    }
};

// 时间戳转换-结束时间
const convertDateEndTime = function(date){
    if(date.indexOf(' ')>-1){
        return new Date(date).getTime();
    }else {
        return new Date(date + ' 23:59:59').getTime()
    }
};

export default {
    convertDateStartTime,
    convertDateEndTime
}
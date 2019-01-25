// 时间戳格式化
import moment from 'moment'
const dateFormat = 'YYYY.MM.DD';

const getMomentType = (timestimp) => {
    return moment(moment(timestimp).format(dateFormat), dateFormat);
};

export default { getMomentType }
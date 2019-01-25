// 交接班
import HandoverWork from './containers/handover_work/redux/reducers'

// 班结管理
import WorkEnd from './containers/work_end/redux/reducers'

export default {
    ...HandoverWork,
    ...WorkEnd
}
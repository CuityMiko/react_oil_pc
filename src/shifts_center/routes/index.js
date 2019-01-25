/**
 * 交接班
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

// 交接班
const HandoverWork = Loadable({ 
    loader: () => import('../containers/handover_work/index.jsx'),
    loading: Loading
});

// 班结管理
const WorkEnd = Loadable({ 
    loader: () => import('../containers/work_end/WorkEnd.jsx'),
    loading: Loading
});

export default {
    HandoverWork,
    WorkEnd
}
/**
 * 油品管理
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

const OilManage = Loadable({ 
    loader: () => import('../index'),
    loading: Loading
});

export default {
    OilManage
}
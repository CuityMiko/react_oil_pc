/**
 * 授权中心
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

const AuthorizeCenter = Loadable({ 
    loader: () => import('../index'),
    loading: Loading
});

export default {
    AuthorizeCenter
}
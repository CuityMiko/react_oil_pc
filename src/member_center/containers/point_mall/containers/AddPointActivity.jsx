import React from 'react';
import PropTypes from 'prop-types';
import WrappedAddOrEditPointActivityForm from "@/member_center/containers/point_mall/components/add_or_edit_point_activity_form/AddOrEditPointActivityForm";
import {connect} from 'react-redux';
import { receiveData } from '@/base/redux/actions';

class AddPointActivity extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    state = {
        title: '新增活动'
    }

    componentWillMount() {
        // 初始化面包屑
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '新增商品',
            routes: [
                {title: '会员中心'},
                {title: '积分商城', path: '/main/member_center/point_mall'},
                {title: '新增商品'}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    render() {
        const {
            history
        } = this.props;

        return (
            <div>
                <WrappedAddOrEditPointActivityForm history={history} />
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(AddPointActivity);
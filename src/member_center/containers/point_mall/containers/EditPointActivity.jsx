import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from "react-redux";

import {receiveData} from '@/base/redux/actions';

import WrappedAddOrEditPointActivityForm
    from "../components/add_or_edit_point_activity_form/AddOrEditPointActivityForm";
import pointMallService from '@/member_center/services/point_mall/point_mall.service'

class EditPointActivity extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired
    };

    state = {
        title: '活动详情',
        formData: null
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const {
            id
        } = this.props.params;
        const breadcrumbdata = {
            title: '编辑商品',
            routes: [
                {title: '会员中心'},
                {title: '积分商城', path: '/main/member_center/point_mall'},
                {title: '编辑商品', path: '/main/member_center/point_mall/edit_point_activity/' + id}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        const {
            id
        } = this.props.params;
        //查询积分商城活动列表
        pointMallService.scoreExchangeGet(id).then(res => {
            console.log(res, '积分商城活动详情');
            const {
                startTime,
                endTime,
                score,
                goodsName,
                price,
                desc,
                count,
                everyoneLimit,
                id,
                stauts
            } = res;
            let data = new Map();
            data.set('开始时间', moment(startTime).format("YYYY-MM-DD"));
            data.set('结束时间', moment(endTime).format("YYYY-MM-DD"));
            data.set('兑换说明', desc);
            data.set('兑换所需积分', score);
            data.set('商品名称', goodsName);
            data.set('商品价格', price);
            data.set('商品图片', price);  // 图片？
            data.set('商品库存', count);
            data.set('每位用户限兑', everyoneLimit);
            this.setState({
                formData: res,
            })
        })
    }

    render() {
        const {
            id,
        } = this.props.params;

        const {
            history
        } = this.props;

        const {
            formData
        } = this.state;

        return (
            <div>
                <WrappedAddOrEditPointActivityForm history={history} formData={formData} id={id}/>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(EditPointActivity);
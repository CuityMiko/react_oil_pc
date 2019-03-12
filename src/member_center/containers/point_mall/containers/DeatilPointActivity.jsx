import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import moment from 'moment';
import {connect} from "react-redux";

import {receiveData} from '@/base/redux/actions';

import DetailShowComplex from '@/common/components/detail_show/DetailShowComplex';
import pointMallService from '@/member_center/services/point_mall/point_mall.service'

class DetailPointActivity extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired
    };

    state = {
        title: '活动详情',
        dataSource: {},
        end: true
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const {
            id
        } = this.props.params;
        const breadcrumbdata = {
            title: '商品详情',
            routes: [
                {title: '会员中心'},
                {title: '积分商城', path: '/main/member_center/point_mall'},
                {title: '商品详情', path: '/main/member_center/point_mall/detail_point_activity/' + id}
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
                imageUrls,
                id,
                status
            } = res;
            let data = new Map();
            let timeStr = moment(startTime).format("YYYY.MM.DD") + ' - ' + moment(endTime).format("YYYY.MM.DD");
            console.log(timeStr,'timeStr', data)
            data.set('兑换时间', timeStr);
            data.set('兑换说明', desc);
            data.set('兑换所需积分', score);
            data.set('商品名称', goodsName);
            data.set('商品价格', price?'￥'+Number(price).toFixed(2):'￥0.00');
            let imgUrl = imageUrls ? imageUrls[0] : '';
            data.set('商品图片', imgUrl);
            data.set('商品库存', count);
            let _everyoneLimit = everyoneLimit == 99999 ? '不限制兑换数量' : everyoneLimit
            data.set('每位用户限兑', _everyoneLimit);
            const isEnd = status == 2 ? true : false;
            console.log('test', data)
            console.log(data);
            this.setState({
                dataSource: data,
                end: isEnd
            })
        })
    }

    render() {
        const {
            id,
        } = this.props.params;

        const {end} = this.state;

        return (
            <div>
                <DetailShowComplex headerHave={true} footerHave={false} titleName="" btnTitle={true}
                                   data={this.state.dataSource} direction="vertical" showPosition="showCenter">
                    <Button type="primary" onClick={() => {
                        this.props.history.push('/main/member_center/point_mall/edit_point_activity/' + id)
                    }} disabled={end}>编辑</Button>
                </DetailShowComplex>
            </div>
        )
    }
}

export default connect(state => ({UserInfo: state.UserInfo}), {receiveData})(DetailPointActivity);
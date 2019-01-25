/**
 * 卡券详情组件目前仅支持以页面路由形式调用，取参this.props.query中获取，路由跳转时以？形式拼接参数，
 * couponDetailScene-用于区分卡券详情适用场景，couponCreate用于卡券创建的，couponGift用于其他地方赠送的
 * couponNumber-卡券number，用于查询卡券详情
 * 调用方式：
 * (1)卡券部分跳转到卡券详情：
 * this.props.history.push('/main/marketing_center/coupon_detail?' +
 'couponNumber=801812282138158428'+'&couponDetailScene=couponCreate');
 (2)其他模块跳转到卡券详情：
 this.props.history.push('/main/marketing_center/coupon_detail?' +
 'couponNumber=801812282138158428'+'&couponDetailScene=couponGift');
 *
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import classNames from 'classnames';
import { Form, Button } from 'antd';

import { receiveData } from '@/base/redux/actions';
import DetailShowComplex from '@/common/components/detail_show/DetailShowComplex';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import {UploadUrl} from '@/common/services/common/common.url';
import CouponService from '@/marketing_center/services/card_ticket/card_ticket.service';

import './coupon_detail.less';

class CouponDetail extends Component {
    // 状态参数
    state = {
        dataMain:new Map(),
        dataRule:new Map(),
        dataExpired:new Map(),
        // 卡券详情适用场景，couponCreate用于卡券创建的，couponGift用于其他地方赠送的
        couponDetailScene:'couponCreate'
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const {couponNumber,couponId,status} = this.props.query;
        const breadcrumbdata = {
            title: '卡券详情',
            routes: [
                {title: '营销中心', path: ''},
                {title: '卡券营销', path: '/main/marketing_center/card_ticket'},
                {title: '卡券详情', path: '/main/marketing_center/coupon_detail'+
                '?couponNumber='+couponNumber+'&couponId='+couponId+'&status='+status}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }
    componentDidMount() {
        const {couponNumber,couponId} = this.props.query;
        let couponDetailScene;
        if(this.props.query.couponDetailScene){
            couponDetailScene = this.props.query.couponDetailScene;
        }else {
            couponDetailScene = this.state.couponDetailScene;
        }
        // 支持couponId和couponNumber两种方式查询详情
        if(couponId){
            CouponService.detailCouponId(couponId,couponDetailScene).then((dataMbrCard)=>{
                this.setState({
                    dataMain:dataMbrCard.dataMain,
                    dataRule:dataMbrCard.dataRule,
                    dataExpired:dataMbrCard.dataExpired,
                })
            }).catch(
                (err) => {
                    console.log('err');
                }
            );
        }else if(couponNumber){
            CouponService.detailCoupon(couponNumber,couponDetailScene).then((dataMbrCard)=>{
                this.setState({
                    dataMain:dataMbrCard.dataMain,
                    dataRule:dataMbrCard.dataRule,
                    dataExpired:dataMbrCard.dataExpired,
                })
            }).catch(
                (err) => {
                    console.log('err');
                }
            );
        }

    }

    editCoupon = ()=>{
        // 跳转编辑页需要带着卡券的couponNumber、couponId、couponScene
        const {couponNumber,couponId} = this.props.query;
        this.props.history.push('/main/marketing_center/coupon_operate?' +
            'couponScene=2&couponNumber='+couponNumber+'&couponId='+couponId+'&status='+this.props.query.status)
    };
    renderMain=()=>{
        // 只有未开始状态才有编辑按钮
        const status = this.props.query.status;
        if(status && status ==0){
            return (
                <DetailShowComplex headerHave={true} footerHave={false} titleName="主要信息" btnTitle={true}
                                   data={this.state.dataMain} direction="vertical" showPosition="showLeft">
                    <div>
                        <Button onClick={this.editCoupon} type="primary">编辑</Button>
                    </div>
                </DetailShowComplex>
            )
        }else{
            return (
                <DetailShowComplex labelClick={this.detailCoupon} headerHave={true} footerHave={false}
                                   titleName="主要信息" data ={this.state.dataMain} direction="vertical"
                                   showPosition="showLeft">
                </DetailShowComplex>
            )
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        // 判断终端和左侧菜单栏合起-展开状态
        const {responsive,menu,LoginUserInfo} = this.props;
        const detailContentContainer = classNames('coupon-detail-container',
            {'coupon-detail-mobile-style':responsive.data.isMobile});

        return (
            <div className={detailContentContainer}>
                {this.renderMain()}
                <WhiteSpace size="v-lg" />
                <DetailShowComplex labelClick={this.detailCoupon} headerHave={true}
                                   footerHave={false} titleName="规则配置" direction="vertical"
                                   data ={this.state.dataRule} showPosition="showLeft">
                </DetailShowComplex>
                <WhiteSpace size="v-lg" />
            {/*    <DetailShowComplex labelClick={this.detailCoupon} headerHave={true}
                                   footerHave={false} titleName="过期提醒" direction="vertical"
                                   data ={this.state.dataExpired} showPosition="showLeft">
                </DetailShowComplex>*/}
            </div>
        )
    }
}

export default connect(
    state => {
        const {responsive, menu} = state.AppData;
        const LoginUserInfo = state.LoginUserInfo;
        return {
            responsive,
            menu,
            LoginUserInfo
        }
    },
    {receiveData}
)(Form.create()(CouponDetail));

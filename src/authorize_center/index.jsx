import React, { Component } from 'react';
import { Button, Row, Col, message } from 'antd';
import {connect} from 'react-redux';

import { receiveData } from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import wxChatIcon from '@/authorize_center/assets/images/wxchat-icon.png';

import AuthorizeService from './services/authorize_center.service';

class AuthorizeCenter extends Component {
    state = {
        title: '授权中心',
        visible: false,
        status: '0', // 授权状态: 1: 已授权，0: 未授权
        oauthUrl: '', // 授权URl
        oauthDis: false
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '授权中心',
            routes: [
                {title: '授权中心', path: '/main/authorize_center'}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        // 判断授权结果
        this.judgeAuthorizeResult();
        AuthorizeService.Authorize().then((res) => {
            if (res == null) {
                this.setState({
                    oauthDis: true
                })
            } else {
                this.setState({
                    status: res.status,
                    oauthUrl: res.oauthUrl
                })
            }
        }).catch(err => {
            this.setState({
                oauthDis: true
            })
        })
    }

    /**
     * 判断授权结果
     */
    judgeAuthorizeResult = () => {
        const {query} = this.props;
        if (query.success != undefined) {
            if (query.success == 1) {
                message.success('微信授权成功！');
            } else {
                message.warning('微信授权失败！');
            }
        }
    }

    // 获取授权操作
    authorizeOperator = () => {
        const {status, oauthUrl, oauthDis} = this.state;
        if (status == '0') {
            return (
                <Row>
                    <Col type="flex" justify="center" className="center-text">
                        <Button disabled={oauthDis} type="primary" href={oauthUrl || ''} target="_blank">微信授权登录</Button>
                        <Button type="default" href="https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index&lang=zh_CN&token=" target="_blank">申请公众号</Button>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row>
                    <Col type="flex" justify="center" className="center-text">
                        <Button disabled={true}>已授权</Button>
                        <Button type="default" href="https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index&lang=zh_CN&token=" target="_blank">申请公众号</Button>
                    </Col>
                </Row>
            )
        }
    }

    render() {
        return (
            <div className="wxchat-auth-container">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                    <Row>
                        <Col type="flex" justify="center" className="center-text">
                            <img className="wx-chat-img" src={wxChatIcon} alt=""/>
                        </Col>
                    </Row>
                    <Row>
                        <Col type="flex" justify="center" className="center-text wx-title">
                            微信公众号授权
                        </Col>
                    </Row>
                    <WhiteSpace size="v-lg" />
                    <Row>
                        <Col className="center-text wx-text">
                            为了保证您能正常使用平台所有功能，请使用已认证服务号进行微信公众授权完美对接微信公
                            众号，搭建属于自己的公众平台，实现线下支付<br/>与线上引流相结合。为商户提供统一的
                            公众管理平台，包括自定义菜单、卡券、会员卡等营销工具。
                        </Col>
                    </Row>
                    <WhiteSpace size="v-lg" />
                    {this.authorizeOperator()}
                    <WhiteSpace size="v-lg" />
                </WingBlank>
                <WhiteSpace size="v-4xl" />
            </div>
        );
    }
}

export default connect(state => ({}), {receiveData})(AuthorizeCenter);
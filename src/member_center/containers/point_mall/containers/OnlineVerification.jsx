import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Icon, Input, Button, Alert, message} from 'antd';
import PubSub from 'pubsub-js';

import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import pointMallService from '@/member_center/services/point_mall/point_mall.service'
import verificationBg from '@/member_center/assets/images/verification-bg.png';
import PointMallEvent from '../point_mall.event';

import "./record_and_verification.less"

const FormItem = Form.Item;

class searchForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const _self = this;
        _self.props.form.validateFields((err, values) => {
            if (!err) {
                pointMallService.scoreExchangeRecordVerificationCode(values.cardSpecId).then(
                    res => {
                        message.success('提货码核销成功');
                        // 发布核销结果
                        PointMallEvent.pub_verificationResult({success: true});
                        _self.props.form.resetFields();
                    }
                ).catch(
                    err => {
                        console.log(err, 'err');
                    }
                )
            }
        });
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={19}>
                        <FormItem>
                            {getFieldDecorator('cardSpecId', {
                                rules: [{required: true, message: '请输入提货码'}],
                            })(
                                <Input placeholder="请输入提货码" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4} offset={1}>
                        <FormItem className="centerButton">
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                确定
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedSearchForm = Form.create()(searchForm);

class OnlineVerification extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    state = {
        title: '在线兑换'
    };

    render() {
        const {title} = this.state;

        const verificationLayout = {
            xs: {span: 24},
            sm: {span: 12, offset: 6},
        };

        const alertLayout = {
            xs: {span: 24},
            sm: {span: 18, offset: 3}
        }

        return (
            <div className="online-verification">
                <Panel>
                    <WhiteSpace size="v-lg" />
                    <Row>
                        <Col {...verificationLayout}>
                            <WrappedSearchForm />
                        </Col>
                        <Col {...verificationLayout}>
                            <img className="verification-bg" src={verificationBg} />
                            <WhiteSpace size="v-xl" />
                        </Col>
                        <Col {...verificationLayout}>
                            <Row>
                                <Col {...alertLayout}>
                                    <Alert message="请使用扫码枪扫描用户出示的提货码" type="info" showIcon />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Panel>
            </div>
        )
    }
}

export default OnlineVerification;
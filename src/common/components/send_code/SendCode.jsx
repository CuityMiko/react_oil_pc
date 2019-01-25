/**
 * 发送短信验证码组件
 * 参数：
 *  1、name: 文本框名称
 *  2、form：表单对象
 *  3、handleSend: 处理发送事件 支持callback
 *  4、formSubmit: 点击回车表单提交
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Icon, Button, Input} from 'antd';

const FormItem = Form.Item;

class SendCode extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        form: PropTypes.object.isRequired,
        handleSend: PropTypes.func.isRequired,
        formSubmit: PropTypes.func
    }

    state = {
        time: 60,
        issend: false
    }

    /**
     * 获取验证码
     */
    getCode = () => {
        const {handleSend} = this.props;
        handleSend((result) => {
            if (result) {
                this.setState({issend: true});
                this.countdown();
            }
        })
    }

    /**
     * 倒计时
     */
    countdown() {
        const _self = this;
        let {time} = _self.state;
        const _interval = setInterval(() => {
            if (time > 0) {
                time = time - 1;
                _self.setState({time});
            } else {
                clearInterval(_interval);
                _self.setState({issend: false, time: 60});
            }
        }, 1000)
    }

    render() {
        const {form, name, formSubmit} = this.props;
        const {getFieldDecorator} = form;
        const {time, issend} = this.state;
        return (
            <Row gutter={10}>
                <Col span={14}>
                    <FormItem>
                        {getFieldDecorator(name, {
                            rules: [
                                { required: true, message: '请输入验证码!', whitespace: true },
                                { max: 6, message: '请输入正确验证码!' }
                            ],
                        })(
                            <Input onPressEnter={formSubmit} prefix={<Icon type="mail" style={{ fontSize: 13 }} />} type="text" placeholder="请输入验证码" maxLength={6}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={10}>
                    <Button onClick={this.getCode} disabled={issend} style={{marginTop: '.24rem'}}>{issend ? `${time}s` : '获取验证码'}</Button>
                </Col>
            </Row>
        )
    }
}

export default SendCode;
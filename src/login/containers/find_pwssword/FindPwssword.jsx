import React from 'react';
import { Form, Icon, Input, Button, Layout, message } from 'antd';
import {Link} from 'react-router-dom';

import PHeader from './components/PHeader';
import SendCode from '@/common/components/send_code/SendCode';
import LoginService from '@/login/services/login.service';
import CommonService from '@/common/services/common/common.service';
import logo from '@/base/assets/images/logo_dark.png';

const FormItem = Form.Item;
const { Content } = Layout;

class FindPwssword extends React.Component {
    /**
     * 确认修改
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {history} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                LoginService.FindPwd({
                    code: values.phoneCode,
                    mobile: values.userPhone,
                    password: values.password
                }).then(res => {
                    message.success('密码重置成功', 1.5);
                    setTimeout(() => {
                        history.push('/login/index');
                    }, 1500)
                }).catch(err => {
                })
            }
        });
    };

    /**
     * 确认密码校验1
     */
    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.props.form
        if (value && value !== getFieldValue('password2')) {
            callback('两次密码不一致！')
        }
        callback();
    }

    /**
     * 确认密码校验2
     */
    handleConfirmPassword2 = (rule, value, callback) => {
        const { getFieldValue } = this.props.form
        if (value && value !== getFieldValue('password')) {
            callback('两次密码不一致！')
        }
        callback();
    }

    /**
     * 处理发送验证码
     */
    handleSend = (callback) => {
        const {validateFields} = this.props.form;
        validateFields(['userPhone'], (err, values) => {
            if (!err) {
                CommonService.SendCode({mobile: values.userPhone}, 'RESET_PWD').then((res) => {
                    callback(true);
                }).catch(err => {
                    callback(false);    
                })
            } else {
                callback(false);
            }
        })
    }
    
    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Layout>
                <PHeader />
                <Content>
                    <div className="login-findpwd">
                        <div className="login-form">
                            <div style={{textAlign: 'center', marginBottom: 13}}>
                                <Link to="/login/index">
                                    <img src={logo} style={{height: 54}} />
                                </Link>
                            </div>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem>
                                    {getFieldDecorator('userPhone', {
                                        rules: [{
                                            required: true, message: '请输入手机号!', whitespace: true
                                        }, {
                                            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确的手机号!',
                                        }]
                                    })(
                                        <Input type="number" prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="请输入手机号" maxLength={11} />
                                    )}
                                </FormItem>
                                <SendCode name="phoneCode" form={form} handleSend={this.handleSend}/>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            { required: true, message: '请输入密码!', whitespace: true }
                                        ],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" maxLength={10} />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password2', {
                                        rules: [
                                            { required: true, message: '请确认密码!', whitespace: true },
                                            { validator: this.handleConfirmPassword2 }
                                        ],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请确认密码" maxLength={10} />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                        确认修改
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default Form.create()(FindPwssword);
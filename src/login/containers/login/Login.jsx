import React from 'react';
import { Form, Button, Checkbox, Tabs, message} from 'antd';
import { connect } from 'react-redux';

import utils from '@/base/utils/';
import PwdForm from './components/pwd_form';
import CodeForm from './components/code_form';
import {LoginAction} from './redux/actions';
import logo from '@/base/assets/images/logo_dark.png';
import businessService from '@/common/services/business/business.service';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Login extends React.Component {
    state = {
        key: 'pwdlogin',
        isSubmit: false,
        userphone: ''
    }

    componentWillMount() {
        // cookie处理
        const userphone = utils.cookies.get('userphone');
        this.setState({userphone});
    }

    componentDidUpdate(prevProps) {
        // 判断是否登陆
        const { LoginUserInfo, history } = this.props;
        if (LoginUserInfo != null && LoginUserInfo != {}) {
            // 存储行业ID
            businessService.GetIndustryId().then(res => {})
            history.push('/');
        }
    }

    componentWillReceiveProps(newProps) {
        // 错误信息判断
        const {RequestResult} = newProps;
        if (RequestResult != null) {
            this.setState({isSubmit: false});
            if (!RequestResult.success) {
                message.warning(RequestResult.errMsg);
            }
        }
    }

    /**
     * 记住手机号并保存至cookie
     */
    toRemember = (userphone) => {
        // 记住手机号
        const remember = this.props.form.getFieldValue('remember');
        if (remember) {
            utils.cookies.set('userphone', userphone);
        } else {
            utils.cookies.remove('userphone');
        }
    }

    /**
     * 登录
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {key, isSubmit} = this.state;
        const {LoginAction} = this.props;
        if (isSubmit) return;
        switch (key) {
            case 'pwdlogin': // 密码登录
                this.pwdform.validateFields((err, values) => {
                    if (!err) {
                        this.setState({isSubmit: true});
                        LoginAction({
                            mobile: values.userPhone,
                            pwd: values.password
                        })
                        this.toRemember(values.userPhone);
                    }
                });
                break;
            case 'codelogin': // 验证码登录
                this.codeform.validateFields((err, values) => {
                    if (!err) {
                        LoginAction({
                            mobile: values.userPhone2,
                            code: values.phoneCode
                        }, 'MOBILE_CODE')
                        this.toRemember(values.userPhone2);
                    }
                });
                break;
            default:
                break;
        }
    };

    /**
     * 找回密码
     */
    findPwd = () => {
        this.props.history.push('/login/find_password');
    }

    /**
     * tab切换
     */
    tabChange = (key) => {
        this.setState({key});
    }

    /**
     * 密码登录表单
     */
    pwdLoginForm = (form) => {
        if (form) {
            const {userphone} = this.state;
            form.setFieldsValue({'userPhone': userphone});
            this.pwdform = form;
        }
    };

    /**
     * 验证码登录表单
     */
    codeLoginForm = (form) => {
        if (form) {
            const {userphone} = this.state;
            form.setFieldsValue({'userPhone2': userphone});
            this.codeform = form;
        }
    };
    
    render() {
        const {getFieldDecorator} = this.props.form;
        let {isSubmit, userphone} = this.state;
        var _isremember = userphone == '' ? false : true;
        return (
            <div className="login">
                <div className="login-form">
                    <div style={{textAlign: 'center'}}>
                        <img src={logo} style={{height: 54}} />
                    </div>
                    <Tabs defaultActiveKey="pwdlogin" onChange={this.tabChange}>
                        <TabPane tab="密码登录" key="pwdlogin">
                            <PwdForm ref={this.pwdLoginForm} handleSubmit={this.handleSubmit}/>
                        </TabPane>
                        <TabPane tab="验证码登录" key="codelogin">
                            <CodeForm ref={this.codeLoginForm} handleSubmit={this.handleSubmit}/>
                        </TabPane>
                    </Tabs>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: _isremember
                            })(
                                <Checkbox>记住手机号</Checkbox>
                            )}
                            <span className="login-form-forgot" style={{float: 'right'}} onClick={this.findPwd}>忘记密码</span>
                            <Button type="primary" htmlType="submit" loading={isSubmit} className="login-form-button" style={{width: '100%'}}>
                                {isSubmit ? '登录中...' : '登 录'}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connect(state => ({LoginUserInfo: state.LoginUserInfo, RequestResult: state.RequestResult}), {LoginAction})(Form.create()(Login));
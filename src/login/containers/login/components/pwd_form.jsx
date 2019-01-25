import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

class PwdForm extends React.Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    }

    /**
     * 回车键表单提交
     */
    pwdFormSubmit = (e) => {
        this.props.handleSubmit(e);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem>
                    {getFieldDecorator('userPhone', {
                        rules: [{
                            required: true, message: '请输入手机号!', whitespace: true
                        }, {
                            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确的手机号!',
                        }]
                    })(
                        <Input type="number" onPressEnter={this.pwdFormSubmit} prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="请输入手机号" maxLength={11}/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!', whitespace: true }],
                    })(
                        <Input onPressEnter={this.pwdFormSubmit} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" maxLength={10}/>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(PwdForm);
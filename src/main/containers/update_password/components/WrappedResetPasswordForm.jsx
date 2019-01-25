import React, {Component} from 'react'
import {
    Form, Input, Button, message
} from 'antd'

import operatorManageService from '@/oiltation_manage/services/operator_manage/operator_manage.service';

const FormItem = Form.Item;

class resetPasswordForm extends Component {
    state = {
        confirmDirty: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                operatorManageService.selfRestPwd({oldPassword: values.password, newPassword: values.newPassword}).then(res => {
                    message.success("密码重设成功");
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两个密码不同');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        console.log('test');
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            console.log('test1');
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4, offset: 2},
                md: {span: 4, offset: 5},
                lg: {span: 4, offset: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
                md: {span: 10},
                lg: {span: 6},
            },
        };
        const formTailLayout = {
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16, offset: 6},
                md: {span: 10, offset: 9},
                lg: {span: 6, offset: 11},

            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="旧密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入原密码密码!',
                        }],
                    })(
                        <Input type="password" placeholder="请输入原密码" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="新密码"
                >
                    {getFieldDecorator('newPassword', {
                        rules: [{
                            required: true, message: '请输入你的密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" placeholder="请输入新的密码" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="再次输入"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认你的密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请确认新的密码" />
                    )}
                </FormItem>
                <FormItem
                    {...formTailLayout}
                >
                    <Button type="primary" htmlType="submit">确认修改</Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedResetPasswordForm = Form.create()(resetPasswordForm);

export default WrappedResetPasswordForm;

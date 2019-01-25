import React, {Component} from 'react';
import PropTyeps from 'prop-types';
import {
    Table, Button, Modal, Form, Input, Tooltip, Icon, Radio, Select, Alert, Col, Checkbox, AutoComplete
} from 'antd';

import UploadAvatar from "@/common/components/upload_avatar/UploadAvatar";
import operatorManageService from '@/oiltation_manage/services/operator_manage/operator_manage.service';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

//新增/编辑加油员表单
class operatorForm extends Component {
    static propTypes = {
        clearState: PropTyeps.func
    };

    state = {
        headimgUrl: '',
    }

    changeAvatar = (imgurl) => {
        this.setState({
            headimgUrl: imgurl
        })
        this.props.getImage(imgurl);
    };

    componentDidMount() {
    }

    changToRole(val) {
        switch (val) {
            case'加油员':
                return 3;
            case '加油站站长':
                return 2;
            case '管理员':
                return 1;
            default:
                return;
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {headimgUrl} = this.state;
        const {roleNames} = this.props.userInfo;

        // 初始设置用户挡墙id为4，id值越大，权限越小
        let userRoleId = 4;
        if (roleNames) {
            userRoleId = this.changToRole(roleNames[0]);
            console.log(userRoleId, 'userRoleId',roleNames);
        }

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4, offset: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        //rules
        let realnameRule = this.props.formData ? [{max: 10,message: '字符不能超过10'}] : [{required: true, message: '请输入姓名'}, {max: 10,message: '字符不能超过10'}];
        let sexRule = this.props.formData ? [] : [{required: true, message: '请选择性别'}];
        let roleRule = this.props.formData ? [] : [{required: true, message: '请选择角色'}];
        let passwordRule = this.props.formData ? [{min: 6, message: '密码6-12位'}, {
            max: 12,
            message: '密码6~12位'
        }] : [{required: true, message: '请输入密码'}, {min: 6, message: '密码6-12位'}, {max: 12, message: '密码6~12位'}];
        let mobilePhoneRule = this.props.formData ? [{pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机格式不正确'}] : [{
            required: true,
            message: '请输入手机号'
        }, {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机格式不正确'}];

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="姓名">
                    {getFieldDecorator('realname', {
                        rules: realnameRule,
                        initialValue: this.props.formData ? this.props.formData.realname : null
                    })(
                        <Input placeholder="请输入姓名" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别"
                    // validateStatus="error"
                >  {getFieldDecorator('sex', {
                    rules: sexRule,
                    initialValue: this.props.formData ? this.props.formData.sex : null
                })(
                    <Select>
                        <Option value={1}>男</Option>
                        <Option value={0}>女</Option>
                    </Select>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="角色"
                >
                    {getFieldDecorator('roleId', {
                        rules: roleRule,
                        initialValue: this.props.formData ? this.changToRole(this.props.formData.roleNames[0]) : null
                    })(
                        <RadioGroup>
                            <Radio key={3} value={3} disabled={userRoleId > 2}>加油员</Radio>
                            <Radio key={2} value={2} disabled={userRoleId > 1}>站长</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                < FormItem {...formItemLayout} label="手机号">
                    {getFieldDecorator('mobilePhone', {
                        rules: mobilePhoneRule,
                        initialValue: this.props.formData ? this.props.formData.mobilePhone : null
                    })(
                        <Input type="number" placeholder="请输入手机号" />
                    )}
                </FormItem>
                <Col span={20} offset={2}>
                    <FormItem>
                        <Alert message="该手机号用于该角色的登录和密码找回，请确保准确" type="info" showIcon />
                    </FormItem>
                </Col>
                <FormItem {...formItemLayout} label="设置密码">
                    {getFieldDecorator('password', {
                        rules: passwordRule,
                    })(
                        <Input type="password" placeholder="6-12位密码，区分大小写" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout}
                          label="用户头像"
                >  {getFieldDecorator('headimgUrl')(
                    <UploadAvatar headimgUrl={headimgUrl || (this.props.formData ? this.props.formData.headimgUrl : '')}
                                  changeAvatar={this.changeAvatar} />
                )}
                </FormItem>
            </Form>
        )
    }
}

const WrappedOperatorForm = Form.create()(operatorForm);

export default WrappedOperatorForm;
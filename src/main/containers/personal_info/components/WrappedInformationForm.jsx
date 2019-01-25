import React, {Component} from "react";
import {connect} from 'react-redux';
import {
    Row, Col, Form, Input, Select, Button, message
} from 'antd';

import UploadAvatar from "@/common/components/upload_avatar/UploadAvatar";

import operatorManageService from '@/oiltation_manage/services/operator_manage/operator_manage.service';
import {UpdateUserinfoAction} from '@/oiltation_manage/containers/operator_manage/redux/actions';

const FormItem = Form.Item;
const Option = Select.Option;

//更新个人信息表单
class informationForm extends Component {
    state = {
        headimgUrl: ''
    }

    changeAvatar = (imgurl) => {
        this.setState({
            headimgUrl: imgurl
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {UpdateUserinfoAction, UserInfo} = this.props;
        const {headimgUrl} = this.state;
        let imgUrl =  headimgUrl ? headimgUrl : UserInfo.headimgUrl
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // 更新员工
                operatorManageService.staffSelfModify(Object.assign({}, {...values, headimgUrl: imgUrl})).then((res) => {
                    // 更新Redux
                    UpdateUserinfoAction(UserInfo.id);
                    message.success('个人信息更新成功');
                }).catch((err) => {
                    console.log(err);
                })
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {UserInfo} = this.props;
        const {headimgUrl} = this.state;
        return (
            <Form onSubmit={this.handleSubmit} layout="vertical">
                <Row>
                    <Col md={{span: 10, offset: 2}} xs={{span: 24}}>
                        <FormItem label="姓名">
                            {getFieldDecorator('realname', {
                                rules: [{required: true, message: '请输入姓名'}],
                                initialValue: UserInfo ? UserInfo.realname : null
                            })(
                                <Input placeholder="请输入姓名" />
                            )}
                        </FormItem>
                        <FormItem
                            label="性别"
                        >  {getFieldDecorator('sex', {
                            rules: [{required: true, message: '请选择性别'}],
                            initialValue: UserInfo ? UserInfo.sex : null
                        })(
                            <Select>
                                <Option value={1}>男</Option>
                                <Option value={0}>女</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem
                            label="角色"
                        >
                            <label>
                                <span>{UserInfo ? UserInfo.roleNames : ''}</span>
                            </label>

                        </FormItem>
                        <FormItem
                            label="手机号"
                        >
                            <label>
                                <span>{UserInfo ? UserInfo.mobilePhone : ''}</span>
                            </label>

                        </FormItem>
                    </Col>
                    <Col md={{span: 9, offset: 2}} xs={{span: 24}}>
                        <FormItem
                            label="用户头像"
                        >  {getFieldDecorator('headimgUrl')(
                            <UploadAvatar headimgUrl={headimgUrl || (UserInfo ? UserInfo.headimgUrl : '') } changeAvatar={this.changeAvatar} />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col md={{span: 10, offset: 2}} xs={{span: 24}}>
                        <FormItem>
                            <Button type="primary" htmlType="submit">更新个人信息</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedInformationForm = Form.create()(informationForm);

export default connect(state => ({
    UserInfo: state.UserInfo
}), {UpdateUserinfoAction})(WrappedInformationForm);
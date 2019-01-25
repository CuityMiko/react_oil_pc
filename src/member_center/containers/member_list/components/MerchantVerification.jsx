import React, {Component} from 'react';
import PropsType from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { message, Button, Form, Input } from 'antd';

import { receiveData } from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import SendCode from '@/common/components/send_code/SendCode';
import CommonService from '@/common/services/common/common.service';
import MemberListService from '@/member_center/services/member_list/member_list.service';

const FormItem = Form.Item;

class MerchantVerification extends Component {
    // 状态参数
    state = {
        title: '',
        code:''
    };
    // 处理发送验证码
    handleSend = (callback) => {
        const {contactMobile} = this.props;

        // 测试
    /*    CommonService.SendCode({mobile: contactMobile}).then((res) => {
            callback(true);
        }).catch(err => {
            callback(false);
        })*/

        MemberListService.codeImport({mobile: contactMobile}).then((res)=>{
            callback(true);
        }).catch((result) => {
           callback(true);
           console.log(result)
        });
    };
    // 回车键表单提交
    codeFormSubmit = (e) => {
        // console.log(e);
        this.props.handleSubmit(e);
    };

    // 商户验证确定
    handleSubmit = (e) => {};

    render() {
        // 手机端还是电脑端
        const {responsive,contactName,contactMobile} = this.props;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
                md: {span: 4},
                lg: {span: 4, offset: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
                md: {span: 12},
                lg: {span: 12},
            },
        };
        return (
            <div className="merchant-verification-container">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="联系人">
                        <div>{contactName}</div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="联系电话">
                        <div>{contactMobile}</div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="验证码">
                        {getFieldDecorator('code', {
                                initialValue: ''
                            }
                        )(
                            <SendCode name="phoneCode" form={form} handleSend={this.handleSend}/>
                        )}
                    </FormItem>
                    <WhiteSpace size="v-lg" />
                    <div className="tip-import">批量导入涉及资金权益，请谨慎导入。</div>
                </Form>
            </div>
        )
    }
}
export default Form.create()(MerchantVerification);

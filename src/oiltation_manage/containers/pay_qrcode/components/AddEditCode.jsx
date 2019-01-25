/**
 * 支付二维码-新增-修改
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Form, Input,Select,Modal, Row,message, Col, Button, Table, Divider } from 'antd';

import { receiveData } from '@/base/redux/actions';

import operatorManageService from '@/oiltation_manage/services/operator_manage/operator_manage.service';
import PayCodeService from '@/oiltation_manage/services/pay_qrcode/pay_qrcode.service';

import '../pay_qrcode.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class AddEditQrcode extends Component {
    state = {
        detailCode:{},
        dataSourceStaff:[],
        pageNo:1,
        pageSize:10000,
    }

    componentDidMount(){
        const {id} = this.props;
        // 获取加油员信息
        const {pageNo,pageSize} = this.state;
        operatorManageService.QueryStaffList({
            pageNO:pageNo,
            pageSize:pageSize
        }).then((res) => {
            this.setState({
                dataSourceStaff: res.items,
            })
          }).catch(
                (err) => {
                    console.log('err');
                }
           )

        // 查询二维码
        if(id){
            PayCodeService.searchCode(id).then((res)=>{
                this.setState({
                    detailCode: res,
                })
            }).catch((err)=>{
                console.log(err);
            })
        }

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {detailCode,dataSourceStaff} = this.state;
        const formItemLayout = {
            labelCol: {
                md:{ span:6},
            },
            wrapperCol: {
                md:{ span:16},
            }
        };
        let formOptionalLabel = {
            'descOptionLabel' : (<span><span>描述</span><span className="optional-style">(选填)</span></span>)
        };
        return (
            <div className="pay-code-container">
                    <Form>
                        <FormItem {...formItemLayout} label="二维码名称">
                            {getFieldDecorator('name',{
                                rules: [
                                    {required: true, message: '二维码名称不能为空，请重新输入'},
                                    ],
                                initialValue: detailCode.name ? detailCode.name : ''
                            })(
                                <Input placeholder="请输入二维码名称" maxLength={10} autoComplete="off"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="加油员">
                            {getFieldDecorator('staff',{
                                rules: [{required: true, message: '请选择加油员'}],
                                initialValue: detailCode.staffId ? detailCode.staffId : null
                            })(
                                <Select placeholder="请选择">
                                    {
                                        dataSourceStaff.map((item) => {
                                            return (
                                                <Option key={item.id} value={item.id}>{item.realname}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="金额">
                            {getFieldDecorator('money')(
                               <div>消费者手动输入</div>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={formOptionalLabel.descOptionLabel}>
                            {getFieldDecorator('description', {
                                initialValue: detailCode.description ? detailCode.description : ''
                            })(
                                <TextArea autoComplete="off" placeholder="请输入"
                                          rows={4} maxLength={140} className=""/>
                            )}
                            <span className="field-tip-align">
                                <span>{this.props.form.getFieldValue('description') && this.props.form.getFieldValue('description').length ? this.props.form.getFieldValue('description').length : '0'}</span>
                                <span>/140</span>
                           </span>
                        </FormItem>
                    </Form>
            </div>
        )
    }
}

export default Form.create()(AddEditQrcode);
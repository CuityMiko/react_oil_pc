/**
 * 油品操作表单组件
 */
import React from 'react';
import {Form, Modal, Input, Select} from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const Option = Select.Option;

class OilOperate extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired,
        handleOk: PropTypes.func,
        handleCancel: PropTypes.func,
        oildata: PropTypes.object,
        categorys: PropTypes.array,
        afterClose: PropTypes.func
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        const {title, visible, handleOk, handleCancel, oildata, afterClose, categorys} = this.props;

        return (
            <Modal
                title={title}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
                afterClose={afterClose}
                destroyOnClose={true}>
                <Form ref="oilOperateForm">
                    <FormItem label="选择品类" {...formItemLayout}>
                        {getFieldDecorator('oiltype', {
                            rules: [{
                                required: true, message: '请选择品类!'
                            }],
                            initialValue: oildata && oildata.oiltype ? oildata.oiltype : ''
                        })(
                            <Select onChange={this.handleChange}>
                                {
                                    categorys.map((item) => {
                                        return (
                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="油品名称" {...formItemLayout}>
                        {getFieldDecorator('oilname', {
                            rules: [{
                                required: true, message: '请输入油品名称!', whitespace: true
                            }],
                            initialValue: oildata && oildata.oilname ? oildata.oilname : ''
                        })(
                            <Input maxLength={20}/>
                        )}
                    </FormItem>
                    <FormItem label="单 价" {...formItemLayout}>
                        {getFieldDecorator('oilprice', {
                            rules: [{
                                required: true, message: '请输入单价!', whitespace: true
                            },{
                                pattern: /^(?!0+(\.0*)?$)\d{0,4}(\.\d{1,2})?$/, message: '输入的数字需大于0小于10000，且只有两位小数'
                            }],
                            initialValue: oildata && oildata.oilprice ? oildata.oilprice.toString() : ''
                        })(
                            <Input addonAfter="元/升" type="number"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(OilOperate) 
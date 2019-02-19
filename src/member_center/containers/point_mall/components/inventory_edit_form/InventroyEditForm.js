import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
   Form, InputNumber, Radio
} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class inventoryEditForm extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,         //活动名称
        count: PropTypes.string.isRequired
    };

    state = {
        _maxCountLimit: 99999
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    onChange = (e) => {
        const {count} = this.props;
        let _count =  e.target.value ? 99999 : count;
        this.setState({
            _maxCountLimit: _count
        })
        console.log('radio1 checked', e.target.value, _count);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {name} = this.props;
        const {_maxCountLimit} = this.state;

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

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="活动名称">
                   <div>{name}</div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="增减选择"
                >  {getFieldDecorator('type', {
                    rules: [{required: true, message: '请选择是增加还是减少库存'}]
                })(
                    <RadioGroup onChange={this.onChange}>
                        <Radio value={1}>增加</Radio>
                        <Radio value={0}>减少</Radio>
                    </RadioGroup>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="库存"
                >
                    {getFieldDecorator('inventory', {
                        rules: [{required: true, message: '请填写库存'}]
                    })(
                        <InputNumber placeholder="请输入库存" min={1} max={_maxCountLimit} style={{width: `100%`}}/>
                    )}
                </FormItem>
            </Form>
        )

    }
}

const WrappedInventoryEditForm = Form.create()(inventoryEditForm);

export default WrappedInventoryEditForm;
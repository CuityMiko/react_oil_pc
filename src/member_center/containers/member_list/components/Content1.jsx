import React, {Component} from 'react'
import { Form, Input } from 'antd'
import PropsType from 'prop-types'

const FormItem = Form.Item;

class Content1 extends Component {
    
    static propsType = {
        key: PropsType.number.isRequired
    }
    
    componentWillReceiveProps(newprops) {
        console.log(this.props.key, 'Content1-newprops')
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              sm: { span: 4 }
            },
            wrapperCol: {
              sm: { span: 16 }
            }
          };
        return (
            <div>
                <Form style={{maxWidth: '360px'}}>
                    <FormItem {...formItemLayout} label="内容1">
                        {getFieldDecorator('content1', {
                            rules: [{ required: true, message: '请输入内容!' }],
                        })(
                            <Input placeholder="请输入内容" />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(Content1)
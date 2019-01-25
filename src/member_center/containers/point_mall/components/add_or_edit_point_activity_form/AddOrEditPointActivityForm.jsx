import React from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, Radio, DatePicker, Row, Col, Button, InputNumber, message
} from 'antd';

import moment from 'moment';

import UploadAvatar from '@/common/components/upload_avatar/UploadAvatar'
import Panel from '@/common/components/panel/Panel'
import WhiteSpace from '@/common/components/white_space/WhiteSpace';

import pointMallService from '@/member_center/services/point_mall/point_mall.service'

import './add_or_edit_point_activity_form.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {MonthPicker, RangePicker} = DatePicker;
const {TextArea} = Input;

class addOrEditPointActivityForm extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        limit: 0,       //每位员工限兑,
        imageUrl: ''
    };

    changeAvatar = (imgurl) => {
        this.setState({
            imageUrl: imgurl
        });
        this.props.form.setFieldsValue({
            imageUrl: imgurl,
        });
    };

    changeLimit = (value) => {
        console.log('change', value);
        this.setState({
            limit: value
        });
        this.props.form.setFieldsValue({
            everyoneLimit: value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        //如果是修改，并且图片没有更新，则使用原图片
        if (this.props.id) {
            let oldImg = this.props.formData.imageUrls[0];
            if (!this.state.imageUrl) {
                this.props.form.setFieldsValue({
                    imageUrl: oldImg,
                });
            }
        }
        //表单验证
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let postData = {};
                postData.startTime = Number(values.time[0].format("x"));
                postData.endTime = Number(values.time[1].format("x"));
                postData.count = Number(values.count);
                postData.desc = values.desc;
                postData.everyoneLimit = values.everyoneLimit;
                postData.goodsName = values.goodsName;
                postData.imageUrl = values.imageUrl;  //修改时，可能图片未修改？
                postData.price = Number(values.price);
                postData.score = Number(values.score);
                postData.proCategoryId = sessionStorage.getItem('productCategoryId');
                // 存在id即为修改,不存在为新增
                console.log(this.props.id, 'id')
                if (this.props.id) {
                    postData.id = this.props.id;
                    pointMallService.scoreExchangeModify({...postData}).then(res => {
                        console.log('res', res);
                        this.props.history.push('/main/member_center/point_mall');
                    }).catch(
                        err => {
                            console.log('err', err)
                        }
                    )
                } else {
                    pointMallService.scoreExchangeSave({...postData}).then(res => {
                        console.log('res', res)
                        message.success('新增活动成功');
                        this.props.history.push('/main/member_center/point_mall');
                    }).catch(
                        err => {
                            console.log('err', err)
                        }
                    )
                }
            }
        });
    };

    //取消
    onCancel = (e) => {
        e.preventDefault();
        this.props.history.push('/main/member_center/point_mall')
    }

    render() {
        const {imageUrl} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formData} = this.props;

        let {limit} = this.state;

        //初始化值
        let _initTime = [];
        let _imageUrls;
        let _limit = 0;
        let _limitValue = 0;
        if (formData) {
            let _startTime = moment(formData.startTime).format("YYYY/MM/DD");
            let _endTime = moment(formData.endTime).format("YYYY/MM/DD");
            let startTime = moment(_startTime, "YYYY-MM-DD");
            let endTime = moment(_endTime, "YYYY-MM-DD");
            _initTime.push(startTime);
            _initTime.push(endTime);
            //图片是数组
            _imageUrls = formData.imageUrls[0];
            _limitValue = formData.everyoneLimit;
            _limit = formData.everyoneLimit == 99999 ? null : formData.everyoneLimit;

        }

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
        };

        const formButtonLayout = {
            labelCol: {
                xs: {span: 0},
                sm: {span: 0},
            },
            wrapperCol: {
                xs: {span: 12, offset: 6},
            },
        };

        function range(start, end) {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        }

        function disabledDate(current) {
            // Can not select days before today and today
            return current && current < moment().startOf('day');
        }

        return (
            <div className="add-or-edit-point-activity-form">
                <Form onSubmit={this.handleSubmit}>
                    <Panel title="基本信息">
                        <FormItem
                            {...formItemLayout}
                            label="兑换时间"
                        >  {getFieldDecorator('time', {
                            rules: [{required: true, message: '请选择兑换时间'}],
                            initialValue: formData ? _initTime : null
                        })(
                            <RangePicker
                                disabledDate={disabledDate}
                                placeholder={["开始时间", "结束时间"]}
                                lang="cn"
                                format="YYYY-MM-DD"

                            />
                        )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="兑换说明（选填）"
                        >
                            <Row>
                                <Col span={21}>
                                    {getFieldDecorator('desc', {
                                        rules: [{required: true, message: '请输入兑换说明'}, {max: 200, message: '字符不能超过200'}],
                                        initialValue: formData ? formData.desc : null
                                    })(
                                        <TextArea autosize={{minRows: 2, maxRows: 6}} maxLength={200} />
                                    )}
                                </Col>
                                <Col span={3} className="unit">
                                      <span className="field-tip-align">
                                                    <span>{this.props.form.getFieldValue('desc') && this.props.form.getFieldValue('desc').length ? this.props.form.getFieldValue('desc').length : '0'}</span>
                                                    <span>/200</span>
                                                </span>
                                </Col>
                            </Row>
                        </FormItem>
                    </Panel>
                    <WhiteSpace size="v-xl" />
                    <Panel title="规则配置">
                        <FormItem
                            {...formItemLayout}
                            label="兑换所需积分"
                        >
                            <Row>
                                <Col span={21}>
                                    {getFieldDecorator('score', {
                                        rules: [{required: true, message: '请输入兑换所需积分'}],
                                        initialValue: formData ? formData.score : null
                                    })(
                                        <InputNumber className="number-input" placeholder="请输入" min={1} max={99999} />
                                    )}
                                </Col>
                                <Col span={3} className="unit">积分</Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="商品名称"
                        >
                            <Row>
                                <Col span={21}>
                                    {getFieldDecorator('goodsName', {
                                        rules: [{required: true, message: '请输入商品名称'}, {max: 20, message: '字符不能超过20'}],
                                        initialValue: formData ? formData.goodsName : null
                                    })(
                                        <Input placeholder="请输入" />
                                    )}
                                </Col>
                                <Col span={3} className="unit">
                                    <span className="field-tip-align">
                                                    <span>{this.props.form.getFieldValue('goodsName') && this.props.form.getFieldValue('goodsName').length ? this.props.form.getFieldValue('goodsName').length : '0'}</span>
                                                    <span>/20</span>
                                                </span>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="商品价格"
                        >
                            <Row>
                                <Col span={21}>
                                    {getFieldDecorator('price', {
                                        rules: [{required: true, message: '请输入商品价格'}],
                                        initialValue: formData ? formData.price : null
                                    })(
                                        <InputNumber className="number-input" placeholder="请输入" min={0.01} max={9999}
                                                     step={0.01} />
                                    )}
                                </Col>
                                <Col span={3} className="unit">元</Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="商品图片"
                        >
                            {getFieldDecorator('imageUrl', {
                                rules: [{required: true, message: '请输入商品图片'}]
                            })(
                                <UploadAvatar headimgUrl={imageUrl || _imageUrls} changeAvatar={this.changeAvatar} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="库存"
                        >
                            <Row>
                                <Col span={21}>
                                    {getFieldDecorator('count', {
                                        rules: [{required: true, message: '请填写库存'}],
                                        initialValue: formData ? formData.count : null
                                    })(
                                        <InputNumber className="number-input" placeholder="请输入" min={1} max={99999} />
                                    )}
                                </Col>
                                <Col span={3} className="unit">件</Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="每位用户限兑"
                        >  {getFieldDecorator('everyoneLimit', {
                            rules: [{required: true, message: '请选择'}],
                            initialValue: formData ? _limitValue : null
                        })(
                            <RadioGroup>
                                <Row>
                                    <Radio value={99999}>不限件数</Radio>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <Radio value={limit || _limit}>限制件数</Radio>
                                    </Col>
                                    <Col span={16}>
                                        <Row>
                                            <Col span={21}>
                                                {formData ?
                                                    <InputNumber className="number-input" placeholder="请输入" min={1}
                                                                         max={9999} onChange={this.changeLimit}
                                                                         defaultValue={_limit} /> : ''}
                                                {!formData ?
                                                    <InputNumber className="number-input" placeholder="请输入" min={1}
                                                                 max={9999} onChange={this.changeLimit}
                                                                /> : ''}
                                            </Col>
                                            <Col span={3} className="unit">件</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </RadioGroup>)}
                        </FormItem>
                    </Panel>
                    <WhiteSpace size="v-xl" />
                    <Panel>
                        <Row justify="center" type="flex" align="middle">
                            <Col>
                                <Button
                                    onClick={this.onCancel}
                                >
                                    取消
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    提交
                                </Button>
                            </Col>
                        </Row>
                    </Panel>
                </Form>
            </div>
        )
    }
}

const WrappedAddOrEditPointActivityForm = Form.create()(addOrEditPointActivityForm);

export default WrappedAddOrEditPointActivityForm;
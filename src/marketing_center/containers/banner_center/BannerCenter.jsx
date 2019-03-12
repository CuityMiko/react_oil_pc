/**
 * 轮播中心
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form, Row, Col, Input, Radio, Checkbox, Button, DatePicker, Icon, message} from 'antd';
import classNames from 'classnames';
import moment from 'moment';

import {receiveData} from '@/base/redux/actions';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';

import BannerCenterService from '@/marketing_center/services/banner_center/banner_center.service';

import noticeBack from '@/marketing_center/assets/images/notice-core.png';

import './banner_center.less';

const FormItem = Form.Item;
const {TextArea} = Input;
const { RangePicker} = DatePicker;
const dateFormat = 'YYYY.MM.DD';

class BannerCenter extends Component {
    state = {
        title: '轮播中心',
        detailData: {}
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '轮播中心',
            routes: [
                {title: '营销中心', path: ''},
                {title: '轮播中心', path: '/main/marketing_center/banner_center/'+this.props.params.pageIndex?1:0}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        // 详情接口
          BannerCenterService.noticeDetail().then(res => {
              res.content = res.content.replace(/<br\/>/g, '\n');
              this.setState({
                  detailData:res
              });
                // 如果是详情页面跳到编辑页的就不做判断跳转
            if(this.props.params.pageIndex != 1){
                // 判断是否编辑过
                if(!!res.title){
                    this.props.history.push('/main/marketing_center/banner_center_detail');
                }
            }
          }).catch(err => {
              console.log(err)
          })
    }

    save = (e) => {
        e.preventDefault();
        const propsParam = this.props.form;
        const {detailData} = this.state;
        propsParam.validateFields((err, values) => {
            // pageIndex存在且为1时则为编辑页面，否则为设置新增页面
            if (!err) {
                if (this.props.params.pageIndex == 1) {
                    // 编辑接口
                    BannerCenterService.noticeOperate({
                        id: detailData.id?detailData.id:'',
                        title: values.title,
                        // startTime: moment(values.time[0]).valueOf(),
                        // endTime: moment(values.time[1]).valueOf(),
                        // startTime: values.time&&values.time[0]?new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')) +' 00:00:00').getTime():'',
                        // endTime: values.time&&values.time[1]?new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')) +' 23:59:59').getTime():'',
                        startTime: values.time&&values.time[0]?new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime():'',
                        endTime: values.time&&values.time[1]?new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime():'',

                        content: values.contentText,
                        url: values.outLink,
                        isDeleted: 0,
                    }).then((res) => {
                        // 跳转详情页面，后期更改为后台返回true再跳
                        message.success('编辑成功');
                        this.props.history.push('/main/marketing_center/banner_center_detail');
                    }).catch(
                        (err) => {
                            console.log('err');
                        }
                    );
                } else {
                    // 新增接口
                    BannerCenterService.noticeOperate({
                        id: '',
                        title: values.title,
                        startTime: values.time&&values.time[0]?new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime():'',
                        endTime: values.time&&values.time[1]?new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime():'',
                        content: values.contentText,
                        url: values.outLink,
                        isDeleted: 0,
                    }).then((res) => {
                        // 跳转详情页面，后期更改为后台返回true再跳
                        message.success('通知中心设置成功');
                        this.props.history.push('/main/marketing_center/banner_center_detail');
                    }).catch(
                        (err) => {
                            console.log('err');
                        }
                    );
                }
            }

        });
    };

    cancel = () => {
        var _self = this.props.history;
        if (this.props.params.pageIndex == 1){
            _self.push('/main/marketing_center/banner_center_detail');
        }else{
            // 清空输入框
            this.props.form.resetFields();
        }
    };
    // 投放时间日期选择框禁用情况,今天之前日期禁用
    disabledDate = (current) => {
        return current && current < moment().startOf('day');
    };
    // 时间戳格式化
    getMomentType = (timestimp) => {
        return moment(moment(timestimp).format(dateFormat), dateFormat);
    };
    render() {
        const {responsive} = this.props;
        let isMobile = responsive.data.isMobile;
        const {getFieldDecorator} = this.props.form;
        const {detailData} = this.state;
        let params = this.props.form;
        const contentStyle = classNames('inline-feedback-style',
            {'inline-feedback-pri-style': params.getFieldValue('contentText') && params.getFieldValue('contentText').length > 9});
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                md: {span: 4, offset: 2},
                lg: {span: 4, offset: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                md: {span: 16},
                lg: {span: 16},
            }
        };
        let formOptionalLabel = {
            'outLinkLabel': (<span><span>外部链接</span><span className="optional-style">(选填)</span></span>),
        };
        const styleMobile = {
            h5Width: {
                // width: isMobile ? '100%' : 'calc(100% - 324px)'
            },
            h5Preview: {
                display: isMobile ? 'none' : 'inline-block'
            }
        };
        return (
            <div className="base-edit-notice">
                <div className="content">
                <Row gutter={16}>
                  {/*  <Col md={8} xs={24} className={responsive.data.isMobile?'mobile-preview common-mbr-preview':'computer-preview common-mbr-preview'}>
                        <div className="scrollable-container" ref={(node) => { this.container = node; }}>
                            <div>
                                <div className="exhibition">
                                    <div className="preview-h5" style={styleMobile.h5Preview}>
                                        <div className="h5-title">轮播示例<span>(图中数据仅为示例)</span></div>
                                        <div className="h5-base-back">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>*/}
                    <Col xs={24} md={8}>
                        <Panel title={
                            <div>轮播示例
                                <span>(图中数据仅为示例)</span>
                            </div>}
                        >
                            <img src={noticeBack} style={{width: `100%`}} />
                        </Panel>
                    </Col>
                    {/*<Col md={16} xs={24} className={responsive.data.isMobile?'mobile-set common-mbr-set':'computer-set common-mbr-set'}>*/}
                   <Col md={16} xs={24}>
                    <div className={isMobile ? 'mobile-set-style common-set' : 'computer-set-style common-set'}
                             style={styleMobile.h5Width}>
                            <Form onSubmit={this.save}>
                                <Panel panelHeader={true} panelFooter={false} title="轮播设置">
                                    <WhiteSpace size="v-xl"/>
                                    <div className="set-tip">
                                        <Icon type="exclamation-circle"/>
                                        <span>如通知示例所示，蓝色区域为显示位置，可通过配置外部链接点击跳转</span>
                                    </div>
                                    <WhiteSpace size="v-lg"/>
                                    <div className="row-col-container">
                                        <FormItem {...formItemLayout} label="轮播标题">
                                            {getFieldDecorator('title', {
                                                rules: [
                                                    {required: true, message: '请输入轮播标题!'}
                                                ],
                                                initialValue: detailData.title ? detailData.title : ''
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" maxLength={10}
                                                       className="field-width-limit field-width-limits"/>
                                            )}
                                        </FormItem>
                                    </div>

                                    <div className="row-col-container">
                                        <FormItem {...formItemLayout} label="轮播时间">
                                            {getFieldDecorator('time', {
                                                rules: [
                                                    {required: true, message: '请输入轮播时间！'}
                                                ],
                                                initialValue: (detailData.startTime && detailData.endTime) ? [this.getMomentType(detailData.startTime), this.getMomentType(detailData.endTime)] : ''
                                            })(
                                                <RangePicker allowClear={false} disabledDate={this.disabledDate} format={dateFormat}
                                                             className="field-width-limit field-width-limits" placeholder={[
                                                    '开始时间', '结束时间'
                                                ]}/>
                                            )}
                                        </FormItem>
                                    </div>

                                    <div className="row-col-container">
                                        <FormItem {...formItemLayout} label="内容:" className={contentStyle}>
                                            {getFieldDecorator('contentText', {
                                                rules: [{required: true, message: '请输入内容!'}],
                                                initialValue: detailData.content ? detailData.content : ''
                                            })(
                                                <TextArea autoComplete="off" placeholder="建议填写活动内容，不超过40个字" maxLength={40}
                                                          rows={2} className="field-width-limit field-tip-align padding-textarea"/>
                                            )}
                                            <span className="field-tip-align">
                                                    <span>{params.getFieldValue('contentText')
                                                    && params.getFieldValue('contentText').length ?
                                                        params.getFieldValue('contentText').length : '0'}</span>
                                                    <span>/40</span>
                                                </span>
                                        </FormItem>
                                    </div>

                                    <div className="row-col-container">
                                        <FormItem {...formItemLayout} label={formOptionalLabel.outLinkLabel}>
                                            {getFieldDecorator('outLink', {
                                                initialValue: detailData.url ? detailData.url : ''
                                            })(
                                                <Input autoComplete="off" md={10} placeholder=""
                                                       className="field-width-limit field-tip-align padding-textarea"/>
                                            )}
                                        </FormItem>
                                    </div>
                                    <Row md={24} xs={24} type="flex" justify="center" align="middle" className="">
                                        <Button onClick={this.save} type="primary"
                                                htmlType="submit">保存</Button>
                                        <Button onClick={this.cancel} type="default">取消</Button>
                                    </Row>
                                </Panel>
                            </Form>
                        </div>
                    </Col>
                </Row>
                </div>

            </div>
        )
    }
}

export default connect(
    state => {
        const {responsive, menu} = state.AppData;
        const LoginUserInfo = state.LoginUserInfo;
        return {
            responsive,
            menu,
            LoginUserInfo
        }
    }, {receiveData})(Form.create()(BannerCenter));
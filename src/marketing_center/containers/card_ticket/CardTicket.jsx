/**
 * 卡券营销
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Form, Input,Modal,Select, Row,message, Col, Button,Pagination, Table, Divider } from 'antd';

import { receiveData } from '@/base/redux/actions';
import TableSearch from '@/common/components/table_search/TableSearch';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import AddCoupon from '@/marketing_center/components/AddCoupon';
import CouponCard from '@/marketing_center/components/CouponCard';
import CouponCardNew from '@/marketing_center/components/CouponCardNew';
import EditInventory from './components/EditInventory';
import couponCardBack from '@/marketing_center/assets/images/coupon-card-back.png';
import couponCardBackNew from '@/marketing_center/assets/images/coupon-card-top.png';
import CouponService from '@/marketing_center/services/card_ticket/card_ticket.service';
import NoData from '@/common/components/no_data/NoData';
import QrcodeDownload from '@/common/components/qrcodedownload/QrcodeDownload';

import './card_ticket.less';

const FormItem = Form.Item;
const  Option  = Select.Option;

class CardTicket extends Component {
    // 状态参数
    state = {
        title: '卡券营销',
        pageNo: 1,
        pageSize: 24,
        visible:false,
        visibleInventory:false,
        dataSourceCoupon:[],
        // 数据总个数
        total:0,
        // 下载二维码组件参数
        showDowload: false,
        dowloadUrl: '',
        codeName: ''
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '卡券营销',
            routes: [
                {title: '营销中心', path: ''},
                {title: '卡券营销', path: '/main/marketing_center/card_ticket'},
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        // 列表接口
        const {pageNo,pageSize} = this.state;
        this.listData({pageNo,pageSize});
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    // 弹出框关闭之后执行卡券列表服务
    afterCloseModal = () => {
        const {pageNo,pageSize} = this.state;
        this.listData({pageNo,pageSize})
    };

    search = ()=>{
        this.setState({
            pageNo:1
        })
        const getParams = this.props.form;
        const {pageNo,pageSize} = this.state;
        const couponName = getParams.getFieldValue('couponName');
        const status = getParams.getFieldValue('status');
        this.listData({pageNo:1,pageSize,couponName, status});
    };

    reset = ()=>{
        this.setState({
            pageNo:1
        })
        // 清空查询条件
        const {pageNo,pageSize} = this.state;
        this.props.form.resetFields();
        this.listData({pageNo:1,pageSize});
    };

    // 拿到事件处理函数，统一传给服务，服务进行数据源整理
    getHandles = () => {
        const funcs = {
            copy:this.copy,
            del:this.del,
            link:this.link,
            end:this.end,
            effectView:this.effectView,
            edit:this.edit,
            detail:this.detail
        };
        return funcs;
    };

    // 列表请求接口
    listData = (data) => {
        CouponService.couponList({
            pageNO: data.pageNo,
            pageSize: data.pageSize,
            name:data.couponName,
            status:data.status,
        },couponCardBackNew, this.getHandles()).then((res)=>{
            this.setState({
                dataSourceCoupon: res.dataSource,
                total:res.total
            })
        }).catch(
            (result) => {
                this.setState({
                    dataSourceCoupon: result.data.dataSource,
                    total:result.data.total
                });
            }
        );
    };

    // 新增代金券
    addCoupon = ()=>{
        // couponScene表示卡券组件适用场景，1表示新增卡券，2表示编辑卡券，3表示复制卡券；
        // 编辑-复制卡券需要多拼接一个参数couponId
        this.props.history.push('/main/marketing_center/coupon_operate?couponScene=1')
    };

    copy = (e,id,couponNumber)=>{
        e.preventDefault();
        e.stopPropagation();
        this.props.history.push('/main/marketing_center/coupon_operate?couponScene=3&couponNumber='
            +couponNumber+'&couponId='+id+'&couponSource=pageSource');
    };

    // 删除
    del = (e,id) => {
        const _self = this;
        const {pageNo,pageSize} = _self.state;
        e.preventDefault();
        e.stopPropagation();
        Modal.confirm({
            title: '删除卡券',
            content: '确定删除吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                // 确认删除接口调用，根据后台返回success为true还是false确定是success提示还是warn提示
                CouponService.operateCoupon({
                    delCoupon:1,
                    couponId:id
                }).then((res)=>{
                    message.success('删除成功');
                    _self.listData({pageNo,pageSize})
                }).catch(
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    };

    // 提前结束
    end = (e,id) => {
        const _self = this;
        const {pageNo,pageSize} = _self.state;
        e.preventDefault();
        e.stopPropagation();
        Modal.confirm({
            title: '提前结束',
            content: '确定提前结束吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                // 确认删除接口调用，根据后台返回success为true还是false确定是success提示还是warn提示
                CouponService.operateCoupon({
                    earlyClose:1,
                    couponId:id
                }).then((res)=>{
                    message.success('提前结束成功');
                    _self.listData({pageNo,pageSize})
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                );
            },
            onCancel() {}
        });
    };
    // 推广
    link = (e,id,number,name)=>{
        e.preventDefault();
        e.stopPropagation();
        const {dowloadUrl} = this.state;
       // 推广二维码url接口,却参数
        CouponService.expandCoupon(number).then((res)=>{
            if(res.url){
                this.setState({
                    // url字段需跟后台确认
                    dowloadUrl:res.url
                })
            }
        }).catch(
            (err) => {
                console.log('err');
            }
        );
        this.setState({
            showDowload: true,
            dowloadUrl: dowloadUrl,
            codeName: name
        })

    };

    // 修改库存弹出框
    edit = (e, id,couponName,get,total)=>{
        e.preventDefault();
        e.stopPropagation();
        this.showModalInventory('修改卡券库存',id,couponName,get,total);
    };

    // 修改库存模态框
    showModalInventory = (title,id,couponName,get,total) => {
        this.setState({
            visibleInventory: true,
            modalTitle: title,
            couponName:couponName,
            id:id,
            get:get,
            total:total
        });
    };

    handleCancelInventory = () => {
        this.setState({
            visibleInventory: false,
        });
    };

    // 修改库存接口
    handleSubmitInventory = (e) => {
        const {id,get,total} = this.state;
        e.preventDefault();
        this.refs.editInventoryForm.validateFields((err, values) => {
            if (!err) {
                if(total==99999){
                    if(values.type==1){
                        message.warning('当前库存为99999，不能再增加');
                        return ;
                    }
                }
                if(values.type ==1 && (parseInt(values.amount)+
                    parseInt(total))>99999){
                    message.warning('库存最大为99999，您当前库存为：'+total);
                    return ;
                }
                if(values.type==-1 && (parseInt(values.amount) >
                        (parseInt(total)-parseInt(get)))){
                    message.warning('减少库存不能大于当前剩余库存，您当前库存为：'+
                        (parseInt(total)-parseInt(get)));
                    return ;
                }
                CouponService.operateCoupon({
                    amount:parseInt(values.amount),
                    type:values.type,
                    couponId:id
                }).then((res)=>{
                    message.success('修改库存成功');
                    this.setState({
                        visibleInventory: false,
                    });
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                );
            }
        });
    };

    // 详情
    detail = (e,couponNumber,id,status)=>{
        e.preventDefault();
        e.stopPropagation();
        this.props.history.push('/main/marketing_center/coupon_detail?' +
            'couponNumber='+couponNumber+'&couponId='+id+'&status='+status);
    };
    // 效果查看
    effectView =(e,id,couponNumber,couponName)=>{
        this.props.history.push('/main/marketing_center/coupon_analysis?id='+id+
            '&couponNumber='+couponNumber+'&couponName='+couponName);
    };
    onChange = (pageNo, pageSize)=> {
        // 改变后的页码和每页的条数
       // 点击时调查询卡券列表的接口，并把参数传过去
        const getParams = this.props.form;
        const couponName = getParams.getFieldValue('couponName');
        const status = getParams.getFieldValue('status');
        this.listData({pageNo,pageSize,couponName,status});
    };
    // 渲染数据
    renderDataList = () => {
        const {dataSourceCoupon} = this.state;
        const cardLayout = {
            xs: {span: 24},
            sm: {span: 12},
            md: {span: 8},
            lg: {span: 8},
            xl: {span: 6},
            xxl: {span: 4}
        };
        if (dataSourceCoupon.length && dataSourceCoupon.length>0) {
            return dataSourceCoupon.map((item, index) => {
                return (
                    <Col {...cardLayout} key={item.id}>
                        <CouponCardNew dataSource={item} key={item.id} />
                    </Col>
                )
            })
        }else {
            return ''
        }
    };

    // 二维码推广关闭之后state状态值置为false
    afterCloseLink = ()=>{
        var _self = this;
        _self.setState({
            showDowload: false,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {couponName,id,total,pageSize,url,showDowload, dowloadUrl, codeName} = this.state;
        const formItemLayout = {
            labelCol: {
                xs:{ span:6},
                md:{ span:6},
                lg:{ span:6},
            },
            wrapperCol: {
                xs:{ span:6},
                md:{ span:6},
                lg:{ span:6},
            }
        };
        return (
            <div className="coupon-list-container">
                <div className="coupon-list-search">
                    <WingBlank size="l-3xl">
                        <WhiteSpace size="v-xl" />
                        <Form>
                            <TableSearch search={this.search} reset={this.reset} colNum={4}>
                                <FormItem {...formItemLayout} label="卡券名称">
                                    {getFieldDecorator('couponName')(
                                        <Input placeholder="请输入" />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="状态">
                                    {getFieldDecorator('status')(
                                        <Select placeholder="请选择">
                                            <Option value="0">未开始</Option>
                                            <Option value="1">进行中</Option>
                                            <Option value="-1">已结束</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </TableSearch>
                            <Row className="function-container">
                                <Col>
                                    <Button type="primary" onClick={this.addCoupon}>新建卡券</Button>
                                </Col>
                            </Row>
                            {
                                total == 0 &&(
                                    <NoData />
                                )
                            }
                        </Form>

                        <WhiteSpace size="v-lg" />
                    </WingBlank>
                </div>
                <WhiteSpace size="v-lg" />
                {
                    total > 0 &&(
                        <div className="coupon-list-content">
                            <div className="list-page-content">
                                <div className="coupon-card-content">
                                    <Row gutter={16}>
                                        {total > 0 && this.renderDataList()}
                                    </Row>
                                </div>
                                {
                                    total > 0 && (
                                        <div className="page-num-content">
                                            <Pagination onChange={this.onChange} pageSize={pageSize} defaultCurrent={1} total={total} />
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    )
                }

                {/*修改库存模态框*/}
                <Modal
                    title="修改卡券库存"
                    visible={this.state.visibleInventory}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleSubmitInventory}
                    afterClose={this.afterCloseModal}
                    onCancel={this.handleCancelInventory}
                    destroyOnClose={true}
                >
                    <EditInventory ref='editInventoryForm' name={couponName} id={id} />
                </Modal>

                {/*下载二维码*/}
                <QrcodeDownload isShow={showDowload} url={dowloadUrl} name={codeName} afterClose={this.afterCloseLink}></QrcodeDownload>

            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(Form.create()(CardTicket));
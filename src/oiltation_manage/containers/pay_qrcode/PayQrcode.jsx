/**
 * 支付二维码
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Form, Input,Select,Modal, Row,message, Col, Button, Pagination, Table, Divider } from 'antd';

import { receiveData } from '@/base/redux/actions';
import TableSearch from '@/common/components/table_search/TableSearch';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import AddEditQrcode from '@/oiltation_manage/containers/pay_qrcode/components/AddEditCode';
import PayQrCode from '@/oiltation_manage/containers/pay_qrcode/components/QrCodeShow';
import NoData from '@/common/components/no_data/NoData';

import operatorManageService from '@/oiltation_manage/services/operator_manage/operator_manage.service';
import PayCodeService from '@/oiltation_manage/services/pay_qrcode/pay_qrcode.service';

import './pay_qrcode.less';

const FormItem = Form.Item;
const Option = Select.Option;

class PayQrcode extends Component {
    state = {
        // title: '支付二维码'
        visible:false,
        pageNoStaff:1,
        pageSizeStaff:10000,
        dataSourceStaff:[],
        pageNo: 1,
        pageSize: 24,
        total:11,
        dataSourceList:[]
    }

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '二维码',
            tipTitle:'二维码需绑定加油员，由消费者手动输入金额',
            routes: [
                {title: '加油站管理'},
                {title: '支付二维码', path: '/main/oiltation_manage/pay_qrcode'}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount(){
        // 获取加油员信息
        const {pageNoStaff,pageSizeStaff,pageNo,pageSize} = this.state;
        operatorManageService.QueryStaffList({
            pageNO:pageNoStaff,
            pageSize:pageSizeStaff
        }).then((res) => {
            this.setState({
                dataSourceStaff: res.items,
            })
           }).catch(
                (err) => {
                    console.log('err');
                }
           )

        // 二维码列表
        let name = this.props.form.getFieldValue('name');
        let staff = this.props.form.getFieldValue('staff');
        let condition = {
            pageNo:pageNo,
            pageSize:pageSize,
            name:name,
            staff:staff
        }
        this.listData(condition);

    }

    // 列表请求接口
    listData = (data) => {
        PayCodeService.codeList({
            // 后台没有分页，暂时不传pageNO/pageSize
            // pageNO: data.pageNo,
            // pageSize: data.pageSize,
            qrcodeNameFilter:data.name,
            staffId:data.staff,
        }).then((res)=>{
            this.setState({
                dataSourceList: res.dataSource,
                total:res.total
            })
        }).catch(
            (result) => {
                this.setState({
                    dataSourceList: result.data.dataSource,
                    total:result.data.total
                });
            }
        );
    };

    // 新增二维码
    addCode = ()=>{
        let condition ={
            modalTitle:'新增二维码'
        }
        this.showModal(condition)
    }

    // 注销
    centerClick= (e,id) => {
        let _self = this;
        Modal.confirm({
            title: '确认要注销此二维码',
            content: '注销会导致该二维码不可用',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                PayCodeService.logoutCode(id).then((res)=>{
                    message.success('注销成功');
                    // 刷新二维码列表
                    let name = _self.props.form.getFieldValue('name');
                    let staff = _self.props.form.getFieldValue('staff');
                    let condition = {
                        name:name,
                        staff:staff
                    }
                    _self.listData(condition);
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                );
            },
            onCancel() {}
        });
    }

    // 修改
    rightClick= (e,id) => {
        const _self = this;
        let condition ={
            modalTitle:'编辑二维码',
            id:id
        }
        _self.setState({
            id:id
        })
        _self.showModal(condition)

    }
    // 显示新增-编辑-弹出框
    showModal = (condition) => {
        this.setState({
            visible: true,
            modalTitle:condition.modalTitle,
            id:condition.id?condition.id:''
        });
    }
    // 新增-编辑-确认事件
    handleOk = (e) => {
        e.preventDefault();
        const _self = this;
        const {id} = _self.state;
        let name = _self.props.form.getFieldValue('name');
        let staff = _self.props.form.getFieldValue('staff');
        let condition = {
            name:name,
            staff:staff
        }
        // 新增-编辑-二维码确认按钮
        if (this.state.modalTitle == '新增二维码'){
            _self.refs.addEditCode.validateFields((err, values) => {
                // console.log(values,'values-0-2-')
                if (!err) {
                    PayCodeService.addCode({
                        name:values.name,
                        staffId:values.staff,
                        description:values.description
                    }).then((res)=>{
                        message.success('新增二维码成功')
                        // 二维码列表
                        _self.listData(condition);
                    }).catch((err)=>{
                        console.log(err);
                    })
                    _self.setState({
                        visible: false,
                    });
                }
            })
        }else{
            _self.refs.addEditCode.validateFields((err, values) => {
                if (!err) {
                    PayCodeService.editCode({
                        id:id,
                        name:values.name,
                        staffId:values.staff,
                        description:values.description
                    }).then((res)=>{
                        message.success('编辑二维码成功')
                        // 二维码列表
                        _self.listData(condition);
                    }).catch((err)=>{
                        console.log(err);
                    })
                    _self.setState({
                        visible: false,
                    });
                }
            })
        }

        // // 二维码列表
        // let name = _self.props.form.getFieldValue('name');
        // let staff = _self.props.form.getFieldValue('staff');
        // let condition = {
        //     name:name,
        //     staff:staff
        // }
        // _self.listData(condition);

    }

    // 新增-编辑-取消事件
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    // 查询函数
    search = () => {
        // 二维码列表
        this.setState({
            pageNo:1
        })
        const {pageNo,pageSize} = this.state;
        let name = this.props.form.getFieldValue('name');
        let staff = this.props.form.getFieldValue('staff');
        let condition = {
            pageNo:1,
            pageSize:pageSize,
            name:name,
            staff:staff
        }
        this.listData(condition);
    }

    // 重置函数
    reset= () => {
        this.setState({
            pageNo:1
        })
        // 清空查询条件
        this.props.form.resetFields();
       // 调支付二维码列表接口
        const {pageNo,pageSize} = this.state;
        let condition = {
            pageNo:1,
            pageSize:pageSize,
            name:'',
            staff:''
        }
        this.listData(condition);
    }

    // 页码改变的函数
    onChange = (pageNo, pageSize)=> {
        // 改变后的页码和每页的条数
        this.setState({
            pageNo:pageNo
        })
        // 点击时调查询二维码列表的接口，并把参数传过去
        const getParams = this.props.form;
        let name = getParams.getFieldValue('name');
        let staff = getParams.getFieldValue('staff');
        let condition = {
            pageNo:pageNo,
            pageSize:pageSize,
            name:name,
            staff:staff
        }
        this.listData(condition);
    };

    // 渲染数据
    renderDataList = () => {
        const {dataSourceList} = this.state;
        const cardLayout = {
            xs: {span: 24},
            sm: {span: 12},
            md: {span: 8},
            lg: {span: 8},
            xl: {span: 6},
            xxl: {span: 4}
        };
        if (dataSourceList.length && dataSourceList.length>0) {
            return dataSourceList.map((item, index) => {
                return (
                    <Col {...cardLayout} key={item.id}>
                        <PayQrCode dataSource={item} key={item.id} centerClick={this.centerClick}
                                   rightClick={this.rightClick} />
                    </Col>
                )
            })
        }else {
            return ''
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const {dataSourceStaff,total,pageSize,id,dataSourceList} = this.state;
        const formItemLayout = {
            labelCol: {
                md:{ span:6},
            },
            wrapperCol: {
                md:{ span:16},
            }
        };
        // 判断后端数据是否为空
        // let dataSourceListLength = dataSourceList.length ? dataSourceList.length:0;
        return (
            <div className="pay-code-container">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={4}>
                            <FormItem {...formItemLayout} label="二维码名称">
                                {getFieldDecorator('name')(
                                    <Input placeholder="请输入" autoComplete="off" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="加油员">
                                {getFieldDecorator('staff')(
                                    <Select placeholder="请选择" onChange={this.handleChange}>
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
                        </TableSearch>
                        <Row className="add-container">
                            <Col>
                                <Button type="primary" onClick={this.addCode}>新增二维码</Button>
                            </Col>
                        </Row>
                        <WhiteSpace size="v-lg" />
                    </Form>
                    {
                        total == 0 &&(
                            <NoData />
                        )
                    }
                    {
                        total>0 && (
                            <div className="code-list">
                                <Row gutter={16}>
                                    {this.renderDataList()}
                                </Row>
                                {/* 页码信息暂时不要*/}
                              {/*  <div className="page-num-content">
                                    <Pagination onChange={this.onChange} pageSize={pageSize} defaultCurrent={1} total={total} />
                                </div>*/}
                            </div>
                        )
                    }
                    <WhiteSpace size="v-lg" />
                </WingBlank>
                {/*新增-编辑-二维码*/}
                <Modal
                    className="add-edit-code-modal"
                    title="新增二维码"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <AddEditQrcode id={id} ref='addEditCode'></AddEditQrcode>
                </Modal>
            </div>
        )
    }
}
export default connect(state => ({}), {receiveData})(Form.create()(PayQrcode));
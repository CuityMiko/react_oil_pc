import React, {Component, Fragment} from 'react';
import { Form, Input,Modal, Row,message, Col, Button, Table, Icon } from 'antd';
import PropsType from 'prop-types';
import {connect} from 'react-redux';

import moment from 'moment';

import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import { receiveData } from '@/base/redux/actions';
import MerchantVerification from '@/member_center/containers/member_list/components/MerchantVerification';
import MbrImportMore from '@/member_center/containers/member_list/components/MbrImportMore';

import MemberListService from '@/member_center/services/member_list/member_list.service';
import OilstationInfoService from '@/oiltation_manage/services/oiltation_information/oiltation_information.service';

class MemberImport extends Component {
    // 参数类型
    static propsType = {

    };
    // 状态值
    state = {
        dataSource:[],
        visibleMerchant:false,
        contactName:'',
        contactMobile:'',
        visibleImportMore:false,
        // 当前页码
        pageNo: 1,
        // 每页显示的条数
        pageSize: 100000,
        // 总共的数据条数
        total: 0,
        // 回调-上传结果
        finishedTotal:'',
        errorTotal:''
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '会员导入',
            routes: [
                {title: '会员中心'},
                {title: '会员列表', path: '/main/member_center/member_list'},
                {title: '会员导入', path: '/main/member_center/member_import'}
            ],
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        // 列表接口
        const {pageNo,pageSize} = this.state;
        const condition = {
            // pageNO: pageNo,
            // pageSize: pageSize,
        };
        this.listData(condition);

        // 商户信息
        OilstationInfoService.merchantGetInfo().then(data => {
            this.setState({
                contactName: data.contactName?data.contactName:'',
                contactMobile: data.contactMobile?data.contactMobile:''
            });
        }).catch(err => {
            console.log(err)
        })



    }

    // 列表请求接口
    listData = (condition)=>{
        MemberListService.mbrImportList({
            // pageNO: condition.pageNo,
            // pageSize: condition.pageSize,
        }).then((res)=>{
            this.setState({
                dataSource: res
            })
        }).catch(
            (err) => {
                console.log('err');
            }
        );
    };

/*
    // 页码改变后的回调函数
    onChange = (page) => {
        const {pageSize} = this.state;
        this.setState({
            pageNo: page
        });
        const condition = {
            pageNO: page,
            pageSize: pageSize,
        };
        this.listData(condition);
    };
*/

    // 下载报表操作
 /*   downLoad = (item) => {
        console.log(item.resultUrl)
        //跳转下载链接
        // window.location.href=item.resultUrl;
    };*/
    // 帮助手册
    importHelper = ()=>{
        const { history } = this.props;
        history.push('/main/member_center/member_import_help');
    };

    // 商户验证弹出框-触发事件
    merchantVerify = (e,contactName,contactMobile)=>{
        e.preventDefault();
        e.stopPropagation();
        this.showModal('商户验证',contactName,contactMobile);
    };

    // 商户验证模态框-页面内容设置
    showModal = (title,contactName,contactMobile) => {
        this.setState({
            visibleMerchant: true,
            modalTitle: title,
            contactName:contactName,
            contactMobile:contactMobile
        });
    };
    // 商户验证模态框-cancel事件
    handleCancel = () => {
        this.setState({
            visibleMerchant: false,
        });
    };
    // 商户验证-ok事件
    handleSubmit = (e) => {
        e.preventDefault();
        const {contactMobile} = this.state;
        // 请求商户验证的接口，手机号-验证码
        this.refs.codeform.validateFields((err, values) => {
            if (!err) {
                MemberListService.verifyCodeImport({
                    mobile: contactMobile,
                    code:values.phoneCode
                }).then((res)=>{
                    console.log(res,'导入-验证-验证码')
                    if(res){
                        // 跳转批量导入模态框,先关闭前一个弹出框
                        this.setState({
                            visibleMerchant: false,
                        });
                        this.showModalImport('会员批量导入');
                    }else{
                        message.warn('验证码输入有误')
                    }
                }).catch((result) => {
                    console.log(result)
                });

            }
        });
    };

    // 批量导入模态框-页面内容设置
    showModalImport = (title) => {
        this.setState({
            visibleImportMore: true,
            modalTitle: title
        });
    };
    // 批量导入模态框-cancel事件
    handleCancelImport = () => {
        this.setState({
            visibleImportMore: false,
        });
    };
    // 批量导入modal-ok事件
    handleSubmitImport = (e) => {
        e.preventDefault();
        const {finishedTotal,errorTotal} = this.state;
        if(finishedTotal!==null && finishedTotal!==undefined && finishedTotal!==''){
            message.success('上传完毕，共'+finishedTotal+'条数据，'+errorTotal+'条失败');
            this.setState({
                visibleImportMore: false,
                finishedTotal:'',
                errorTotal:''
            });
            this.listData();
        }else{
            message.warn('上传失败');
            this.setState({
                visibleImportMore: false,
                finishedTotal:'',
                errorTotal:''
            });
            this.listData();
        }
    };

    // 上传结果的回调
    getUploadResult = (result)=>{
        this.setState({
            finishedTotal:result.finishedTotal,
            errorTotal:result.errorTotal
        })
    }

    // 渲染html
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render:(text, record, index) => {
                    return index + 1
                }
            },
            {
                title: '导入时间',
                dataIndex: 'jobEndtime',
                key: 'jobEndtime',
                render:(text, record, index) => {
                    if(text){
                        return moment(Number(text)).format('YYYY.MM.DD')
                    }else{
                        return '--'
                    }
                }
            },
            {
                title: '导入数量',
                dataIndex: 'total',
                key: 'total',
                render:(text, record, index) => {
                    return text || '0'
                }
            },
            {
                title: '成功数',
                dataIndex: 'successTotal',
                key: 'successTotal',
                render:(text,record)=>{
                    return text || '0'
                }
            },
            {
                title: '失败数',
                dataIndex: 'errorTotal',
                key: 'errorTotal',
                render:(text, record, index) => {
                    return text || '0'
                }
            },
            {
                title: '操作人',
                dataIndex: 'staffName',
                key: 'staffName',
                render:(text, record, index) => {
                    return text || '--'
                }
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <a href={record.resultUrl}>下载报表</a>
                       {/* <a href={record.originalUrl} onClick={() => {
                            this.downLoad(record)
                        }}>下载报表</a>*/}
                    </Fragment>
                ),
            },
        ];
        const {contactName,contactMobile,total, pageSize, pageNo,dataSource,finishedTotal} = this.state;
        return (
            <div className="mbr-list-container import-container">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                    <Row className="mobile-table">
                        <Col>
                            <Button type="primary" className="more-import-btn"
                                    onClick={(e)=>{
                                this.merchantVerify(e,contactName,contactMobile)}}>批量导入</Button>
                            <span className="to-help-import" onClick={this.importHelper}>
                                <span className="icon-container">
                                    <Icon type="exclamation-circle" />
                                </span>
                                <span>如何导入原系统会员</span>
                            </span>

                        </Col>
                    </Row>
                    <WhiteSpace size="v-lg" />
                    <Row className="mobile-table table-container">
                        <Col>
                            {/*<Table scroll={{ x:800}} dataSource={dataSource} locale={{emptyText:'暂无数据'}} columns={columns} />*/}
                            <Table scroll={{ x:800}} dataSource={dataSource} locale={{emptyText:'暂无数据'}}
                                   pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChange}} columns={columns} />
                        </Col>
                    </Row>
                    <WhiteSpace size="v-xl" />
                </WingBlank>

                {/*商户验证模态框*/}
                <Modal
                    wrapClassName="import-modal"
                    title="商户验证"
                    visible={this.state.visibleMerchant}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleSubmit}
                    afterClose={this.afterCloseModal}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <MerchantVerification ref="codeform" contactName={contactName}
                                          contactMobile={contactMobile} />
                </Modal>

                {/*批量导入模态框*/}
                <Modal
                    wrapClassName="import-modal"
                    title="会员批量导入"
                    visible={this.state.visibleImportMore}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleSubmitImport}
                    okButtonProps = {{disabled:(finishedTotal!==null && finishedTotal!==undefined && finishedTotal!=='')?false:true}}
                    afterClose={this.afterCloseModal}
                    onCancel={this.handleCancelImport}
                    destroyOnClose={true}
                >
                    <MbrImportMore getUploadResult={this.getUploadResult} ref="importform" />
                </Modal>

            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(Form.create()(MemberImport));
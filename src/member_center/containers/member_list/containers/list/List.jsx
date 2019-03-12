import React, {Component, Fragment} from 'react';
import { Form, Input,Modal, Row,message, Col, Button, Table, Divider,Tooltip,Icon } from 'antd';
import PropsType from 'prop-types';
import {connect} from 'react-redux';

import moment from 'moment';

import TableSearch from '@/common/components/table_search/TableSearch';
import DataCard from '@/common/components/data_card/DataCard';
import EditScore from '@/member_center/components/EditScore';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import addNewMbr from '@/member_center/assets/images/add-new-mbr.png';
import addTotalMbr from '@/member_center/assets/images/add-total-mbr.png';
import { receiveData } from '@/base/redux/actions';

import MemberListService from '@/member_center/services/member_list/member_list.service';

const FormItem = Form.Item;

class MemberList extends Component {
    // 参数类型
    static propsType = {
        key: PropsType.number.isRequired
    };
    // 状态值
    state = {
        dataMbrSource:[],
        dataTotalMbr:[],
        icons:{
            addNewMbr:addNewMbr,
            addTotalMbr:addTotalMbr
        },
        // 当前页码
        pageNo: 1,
        // 每页显示的条数
        pageSize: 20,
        // 总共的数据条数
        total: 0,
        // 修改积分弹出框
        visibleInventory:false,
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '会员列表',
            routes: [
                {title: '会员中心'},
                {title: '会员列表', path: '/main/member_center/member_list'}
            ],
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        console.log(this.props.form.getFieldValue('mobile'),'ddd')
        // 列表接口
        const {pageNo, pageSize} = this.state;
        const mobile = this.props.form.getFieldValue('mobile');
        this.listData(pageNo, pageSize,mobile?mobile:'');
        this.countMbrData(this.state.icons);
    }
    // 页码改变后的回调函数
    onChange = (page) => {
        const {pageSize} = this.state;
        const mobile = this.props.form.getFieldValue('mobile');
        this.setState({
            pageNo: page
        });
        this.listData(page,pageSize,mobile?mobile:'');
    };
    // 列表请求接口
    listData = (pageNo,pageSize,mobile)=>{
        MemberListService.listMbr({
            pageNO: pageNo,
            pageSize: pageSize,
            mobile:mobile
        }).then((res)=>{
            this.setState({
                dataMbrSource: res.items,
                total: res.total
            })
        }).catch(
            (err) => {
                console.log('err');
            }
        );
    };
    countMbrData = (icons)=>{
        MemberListService.amountMbr(icons).then((res)=>{
            this.setState({
                dataTotalMbr: res,
            })
        }).catch((result) => {
            this.setState({
                dataTotalMbr: result.data
            })
        });
    };
    // 表单查询函数
    search = ()=>{
        const mobile = this.props.form.getFieldValue('mobile');
        this.setState({
            pageNo:1
        })
        const {pageNo, pageSize} = this.state;
        this.listData(1,pageSize,mobile?mobile:'');
    };

    // 表单重置函数
    reset = ()=>{
        // 清空查询条件
        this.setState({
            pageNo:1
        })
        const {pageNo, pageSize} = this.state;
        this.props.form.resetFields();
        this.listData(1, pageSize)
    };

    // 导入操作
    importData = () => {
        const { history } = this.props;
        history.push('/main/member_center/member_import');
    };

    // 导出操作
    exportData = () => {
        MemberListService.exportMbr({
            // pageNO: this.state.pageNo,
            // 导出不用page参数了
            // pageNO: 1,
            // pageSize: this.state.pageSize,
            mobile: this.props.form.getFieldValue('mobile') || ''
        })
    };

    // 详情
    detail = (memberId) => {
        // 当前组件props没有history，所以列表容器传过来
        this.props.history.push('/main/member_center/member_detail/'+memberId);
    };

    // 删除
    del = (memberId) => {
        let _self = this;
        const {pageNo, pageSize} = _self.state;
        const mobile = _self.props.form.getFieldValue('mobile');
        Modal.confirm({
            title: '确认删除该会员吗？',
            content: '该会员的权益将被清空，请谨慎。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              // 确认删除接口调用，根据后台返回success为true还是false确定是success提示还是warn提示
                MemberListService.delteMbr(memberId).then(res=>{
                    message.success('删除成功');
                    _self.setState({
                        pageNo: 1
                    });
                    _self.listData(1,pageSize,mobile?mobile:'')
                }).catch(
                    err => {
                        console.log('err');
                    }
                );
            },
            onCancel() {}
        });
    };


    // 修改积分弹出框
    editScore = (id,availableScore)=>{
        this.showModalInventory('修改积分',id,availableScore);
    };

    // 修改库存模态框
    showModalInventory = (title,id,availableScore) => {
        this.setState({
            visibleInventory: true,
            modalTitle: title,
            availableScore:availableScore,
            id:id,
        });
    };

    handleCancelInventory = () => {
        this.setState({
            visibleInventory: false,
        });
    };
    // 弹出框关闭之后执行列表服务
    afterCloseModal = () => {
        // 列表接口
        const {pageNo, pageSize} = this.state;
        const mobile = this.props.form.getFieldValue('mobile');
        this.listData(pageNo, pageSize,mobile?mobile:'');
        this.countMbrData(this.state.icons);
    };
    // 修改库存接口
    handleSubmitInventory = (e) => {
        const self = this;
        const {id,pageNo, pageSize} = self.state;
        const mobile = self.props.form.getFieldValue('mobile');
        e.preventDefault();
        self.refs.editScoreForm.validateFields((err, values) => {
            if (!err) {
              //  调用修改积分接口
                MemberListService.editScore({
                    score:parseInt(values.amount),
                    tag:values.type,
                    memberId:id
                }).then((res)=>{
                    message.success('修改积分成功');
                    self.setState({
                        visibleInventory: false,
                    });
                    // 列表接口
                    self.listData(pageNo, pageSize,mobile?mobile:'');
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                );
            }
        });
    };


    // 渲染html
    render() {
        const { getFieldDecorator } = this.props.form;
        const {total, pageSize, pageNo, id, availableScore} = this.state;
        const formItemLayout = {
            labelCol: {
                md:{ span:6},
            },
            wrapperCol: {
                md:{ span:16},
            }
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render:(text, record, index) => {
                    return index + 1
                }
            },
         /*   {
                title: '昵称',
                dataIndex: 'name',
                key: 'name',
                render:(text, record, index) => {
                    return text || '--'
                }
            },*/
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
                render:(text, record, index) => {
                    return text || '--'
                }
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render:(text,record)=>{
                    if(text ==0){
                        return '女'
                    }else if(text ==1 || text == 2){
                        return '男'
                    }else{
                        return '--'
                    }
                }
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                key: 'birthday',
                render:(text, record, index) => {
                    if(text){
                        return moment(Number(text)).format('YYYY.MM.DD')
                    }else{
                        return '--'
                    }
                }
            },
            {
                title: () => {
                    return (
                        <div>可用余额
                            <Tooltip title="可用余额为汽油卡余额和柴油卡余额的总和">
                                <Icon style={{color: '#1890ff', marginLeft: '4px'}} type="exclamation-circle" />
                            </Tooltip>
                        </div>
                    )
                },
                dataIndex: 'totalBalance',
                key: 'totalBalance',
                render: (text) => {
                    if(text != null) {
                        return '￥' + Number(text).toFixed(2)
                    } else {
                        return '￥0.00'
                    }
                }
            },
            {
                title: '可用积分',
                dataIndex: 'availableScore',
                key: 'availableScore',
                render:(text, record, index) => {
                    return text || '0'
                }
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <a href="javascript:" onClick={() => {
                            this.editScore(record.id,record.availableScore)
                        }}>修改积分</a>
                        <Divider type="vertical" />
                        <a href="javascript:" onClick={() => {
                            this.detail(record.id)
                        }}>查看</a>
                        <Divider type="vertical" />
                        <a href="javascript:" onClick={() => {
                            this.del(record.id)
                        }}>删除</a>
                    </Fragment>
                ),
            },
        ];
        return (
            <div className="mbr-list-container">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                    <Form>
                        <TableSearch search={this.search} reset={this.reset} colNum={4}>
                            <FormItem {...formItemLayout} label="手机号">
                                {getFieldDecorator('mobile')(
                                    <Input placeholder="请输入手机号" type="number" autoComplete="off" />
                                )}
                            </FormItem>
                        </TableSearch>
                        <Row className="import-export-container">
                            <Col>
                                <Button onClick={this.importData}>导入</Button>
                                <Button onClick={this.exportData}>导出</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col>
                            <DataCard data={this.state.dataTotalMbr} />
                        </Col>
                    </Row>
                    <WhiteSpace size="v-lg" />
                    <Row className="mobile-table">
                        <Col>
                            <Table dataSource={this.state.dataMbrSource} scroll={{ x:800}}
                                   locale={{emptyText:'暂无数据'}}
                                   pagination={{total: total, pageSize: pageSize, current: pageNo, onChange: this.onChange}} columns={columns} />
                        </Col>
                    </Row>
                </WingBlank>

                {/*修改积分模态框*/}
                <Modal
                    title="修改积分"
                    visible={this.state.visibleInventory}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleSubmitInventory}
                    afterClose={this.afterCloseModal}
                    onCancel={this.handleCancelInventory}
                    destroyOnClose={true}
                >
                    <EditScore ref='editScoreForm' availableScore={availableScore} id={id} />
                </Modal>

            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(Form.create()(MemberList));
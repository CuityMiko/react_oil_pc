import React, {Component} from 'react'
import {connect} from "react-redux"

import WhiteSpace from '@/common/components/white_space/WhiteSpace'
import Panel from '@/common/components/panel/Panel'
import WrappedOperatorForm from './components/add_or_alter_form'
import OperatorDetail from './components/operatorDetail'

import {receiveData} from '@/base/redux/actions';

import {
    Table, Button, Modal, Divider, message
} from 'antd';

import {UpdateUserinfoAction} from '@/oiltation_manage/containers/operator_manage/redux/actions';

import operatorManageService from '@/oiltation_manage/services/operator_manage/operator_manage.service';

const {Column} = Table;

class OperatorManage extends Component {
    state = {
        isManager: false, //当前用户，修改当前用户是，需同步修改redux中数据
        title: '加油员管理',
        visible: false,
        modalTitle: '',
        checkedData: null, //table中选中的数据
        detailVisible: false,
        dataSource: [],
        pagination: {
            pageSize: 20
        },
        headimgUrl: '',
        _enable: null,
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '加油员管理',
            routes: [
                {title: '加油站管理'},
                {title: '加油员管理', path: '/main/oiltation_manage/operator_manage'}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        //初始化 获取员工列表
        this.fetch({
            pageNO: this.state.pageNO,
            pageSize: this.state.pageSize
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        let _enable = filters.enable ?  filters.enable[0] : null;
        this.setState({
            pagination: pager,
            enable: _enable
        });
        this.fetch({
            pageNO: pagination.current,
            pageSize: pagination.pageSize,
            enable: _enable
        });
    };

    fetch = (params = {}) => {
        const {enable} = this.state;
        operatorManageService.QueryStaffList(
            Object.assign({enable: enable}, {...params})
        ).then((res) => {
            const pagination = {...this.state.pagination};
            pagination.total = res.total;
            this.setState({
                dataSource: res.items,
                pagination
            }).catch(
                (err) => {
                    console.log('err');
                }
            )
        })
    };

    getImage = (headimgUrl) => {
        this.setState({
            headimgUrl: headimgUrl
        });
    };

    // clearState = () =>{
    //     console.log('clearState')
    // }

    // 新增
    showModal = (title) => {
        this.setState({
            visible: true,
            modalTitle: title,
            checkedData: null,
            isManager: false
        });
    };

    // 编辑加油员
    editFormModal = (record) => {
        const {UserInfo} = this.props;
        console.log(UserInfo, 'userINfo');
        // return;
        let isManager = (record.id == UserInfo.userId) ? true : false;
        this.setState({
            visible: true,
            modalTitle: '编辑加油员',
            checkedData: record,
            isManager: isManager
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    //获取表单数据
    getFormData = (form) => {
        this.form = form;
    };

    handleSubmit = () => {
        const {pagination} = this.state;
        const _self = this;
        this.form.validateFields((err, values) => {
            if (!err) {
                const {checkedData, headimgUrl} = this.state;
                let imgUrl;
                if (headimgUrl == '') {
                    imgUrl = checkedData ? checkedData.headimgUrl : '';
                } else {
                    imgUrl = headimgUrl;
                }
                if (this.state.modalTitle == '新增加油员') {
                    operatorManageService.staffSave(Object.assign({...values}, {headimgUrl: imgUrl})).then((res) => {
                        message.success('新增加油员成功');
                        this.setState({
                            visible: false,
                            checkedData: null
                        });
                        _self.fetch({
                            pageNO: pagination.current,
                            pageSize: pagination.pageSize,
                        });
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    const {UpdateUserinfoAction, UserInfo} = this.props;
                    let id = checkedData.id;
                    operatorManageService.staffModify(Object.assign({}, {
                        ...values,
                        id,
                        headimgUrl: imgUrl
                    })).then((res) => {
                        if (this.state.isManager) {
                            UpdateUserinfoAction(UserInfo.id);
                        }
                        this.setState({
                            visible: false,
                            checkedData: null
                        });
                        message.success('修改加油员成功');
                        _self.fetch({
                            pageNO: pagination.current,
                            pageSize: pagination.pageSize,
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        });
    };

    //注销事件
    deletData = (record) => {
        const {pagination} = this.state;
        const _self = this;
        Modal.confirm({
            title: '确认要注销该加油员吗？',
            content: '注销加油员会同步注销绑定该加油员的支付二维码',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                operatorManageService.staffLogout(record.id).then((res) => {
                    message.success('注销加油员成功');
                    _self.fetch({
                        pageNO: pagination.current,
                        pageSize: pagination.pageSize,
                    });
                }).catch((err) => {
                    console.log(err);
                    // message.error('注销加油员失败');
                });
            }
        });
    };

    //启用事件
    enableStaff = (record) => {
        const {pagination} = this.state;
        const _self = this;
        Modal.confirm({
            title: '请确认',
            content: '是否启用该加油员',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                operatorManageService.staffEnable(record.id).then((res) => {
                    message.success('启用加油员成功');
                    _self.fetch({
                        pageNO: pagination.current,
                        pageSize: pagination.pageSize,
                    });
                }).catch((err) => {
                    console.log(err);
                    // message.error('注销加油员失败');
                });
            }
        });
    };

    //详情模态事件
    showDetailModal = (record) => {
        this.setState({
            detailVisible: true,
            checkedData: record
        });
    };

    //详情隐藏
    hideDetailModal = () => {
        console.log('hideDetailMOdal');
        this.setState({
            detailVisible: false,
            checkedData: null
        });
    };

    render() {
        const {
            checkedData,
            modalTitle,
            visible,
            dataSource,
            pagination,
            detailVisible
        } = this.state;

        const {UserInfo} = this.props;

        return (
            <div className="operator-mannage">
                <Panel>
                    <div>
                        <Button
                            type="primary"
                            onClick={(title) => {
                                this.showModal('新增加油员')
                            }}
                        >
                            新增加油员
                        </Button>
                    </div>
                    <WhiteSpace size="v-lg" />
                    <Table
                        dataSource={dataSource}
                        rowKey='id'
                        onChange={this.handleTableChange}
                        locale={{emptyText:'暂无数据'}}
                        pagination={pagination}
                        scroll={{x: 1000}}
                    >
                        <Column
                            title="序号"
                            dataIndex="index"
                            key="index"
                            render={(text, record, index) => {
                                return index + 1
                            }}
                        />
                        <Column
                            title="姓名"
                            dataIndex="realname"
                            key="realname"
                        />
                        <Column
                            title="手机号"
                            dataIndex="mobilePhone"
                            key="mobilePhone"
                        />
                        <Column
                            title="性别"
                            dataIndex="sex"
                            key="sex"
                            render={(text) => {
                                let gender = text == 1 ? '男' : '女';
                                return gender;
                            }}
                        />
                        <Column
                            title="角色"
                            dataIndex="roleNames"
                            key="roleNames"
                        />
                        <Column
                            title="是否启用"
                            dataIndex="enable"
                            key="enable"
                            render={(text, record, index) => {
                                let _enable = text == 1 ? '是' : '否';
                                return _enable;
                            }}
                            filterMultiple={false}
                            filters={[
                                {text: '是', value: 1},
                                {text: '否', value: 0}
                            ]}
                        />
                        <Column
                            title="操作"
                            dataIndex=""
                            key="action"
                            render={(text, record) => (
                                <span>
                                    <a href="javascript:;" onClick={() => {
                                        this.editFormModal(record)
                                    }}>编辑</a>
                                      <Divider type="vertical" />
                                    {
                                        record.enable == 1 ? (
                                            <a href="javascript:;" onClick={() => {
                                                this.deletData(record)
                                            }}>注销</a>
                                        ) : (
                                            <a href="javascript:;" onClick={() => {
                                                this.enableStaff(record)
                                            }}>启用</a>
                                        )
                                    }
                                    <Divider type="vertical" />
                                      <a href="javascript:;" onClick={() => {
                                          this.showDetailModal(record)
                                      }}>查看</a>
                                </span>
                            )}
                        />
                    </Table>
                </Panel>
                {/*新增、编辑模态框*/}
                <Modal
                    title={modalTitle}
                    visible={visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}
                >
                    <WrappedOperatorForm ref={this.getFormData} formData={checkedData}
                                         getImage={this.getImage} userInfo={UserInfo} />
                </Modal>
                {/*详情模态框*/}
                <Modal
                    title="查看加油员"
                    visible={detailVisible}
                    onOk={this.hideDetailModal}
                    onCancel={this.hideDetailModal}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}
                >
                    <OperatorDetail record={checkedData} />
                </Modal>
            </div>
        )
    }
}

export default connect(state => ({UserInfo: state.UserInfo}), {receiveData, UpdateUserinfoAction})(OperatorManage);
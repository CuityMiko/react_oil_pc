import React from 'react';
import {connect} from 'react-redux';
import {Table, Switch, Tooltip, Icon, Button, message, Modal, Input, Form, Divider} from 'antd';

import { receiveData } from '@/base/redux/actions';
import Panel from '@/common/components/panel/Panel';
import OilCardService from '@/member_center/services/oil_card/oil_card.service';
import StoreRuleService from '@/member_center/services/oil_card/store_rule/store_rule.service';
import StoreRuleOperate from './StoreRuleOperate';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import './store_rule.less';

const { TextArea } = Input;
const FormItem = Form.Item;

class StoreRuleList extends React.Component {
    state = {
        title: '充值规则',
        checked: true,
        loading: false,
        showInfoModal: false,
        rechargeInfo: '',
        pageNO: 1,
        pageSize: 20,
        total: 0,
        columns: [],
        ruleList: [],
        tableLoading: false,
        modalVisible: false,
        modalTitle: '',
        id: 0,
        storerule: null
    }

    componentWillMount() {
        // 绑定面包屑
        this.bindBreadCrumb();
        // 查询卡种配置
        this.GetCardConfig();
        // 绑定表格列
        this.bindColumns();
        // 获取充值规则列表
        this.GetRechargeRuleList();
    }

    /**
     * 获取充值规则列表
     */
    GetRechargeRuleList = () => {
        const cardSpecId = this.props.params.cardid;
        const {pageNO, pageSize} = this.state;
        this.setState({tableLoading: true});
        StoreRuleService.GetRechargeRuleList({
            pageNO, pageSize, cardSpecId
        }).then(res => {
            if (res != null && res.items.length > 0) {
                this.setState({total: res.total, ruleList: res.items})
            }
            this.setState({tableLoading: false});
        }).catch(err => {
            this.setState({tableLoading: false});
        })
    }

    /**
     * 绑定表格列
     */
    bindColumns = () => {
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render:(text, record, index) => {
                return index + 1
            }
        }, {
            title: '充值规则名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '充值规则',
            dataIndex: 'rule',
            key: 'rule',
            render:(text, record, index) => {
                let info = '';
                switch (record.giftType) {
                    case 0: // 金额
                        info = `送￥${record.giftContent}元`;
                        break;
                    case 1: // 积分
                        info = `送${record.giftContent}积分`;
                        break;
                    case 2: // 卡券
                        info = `送${record.giftContentName || ''}优惠券`;
                        break;
                    default:
                        break;
                }
                let content = `充值￥${record.amount}${info}`;
                return <span>{content}</span>;
            }
        }, {
            title: '状态',
            dataIndex: 'enable',
            key: 'enable',
            render: (text, record) => {
                switch (text) {
                    case 0:
                        return <div className="status-icon not">未启用</div>;
                    case 1:
                        return <div className="status-icon">已启用</div>;
                    default:
                        break;
                }
            },
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    {record.enable == 0 ? <a href="javascript:;" onClick={() => this.toOperate(record.id, 1)}>启用</a> : <a href="javascript:;" onClick={() => this.toOperate(record.id, 0)}>停用</a>}
                    <Divider type="vertical" />
                    {record.enable == 0 ? <span><a href="javascript:;" onClick={() => this.toOperate(record.id, 4)}>编辑</a><Divider type="vertical" /><a href="javascript:;" onClick={() => this.toOperate(record.id, 2)}>删除</a><Divider type="vertical" /></span> : <span></span>}
                    {record.enable == 1 ? record.topRecommended == 0 ? <a href="javascript:;" onClick={() => this.toOperate(record.id, 3)}>设为推荐</a> : <span style={{color: 'red'}}>已置顶推荐</span> : <span></span>}
                </span>
            ),
        }];
        this.setState({columns});
    }

    /**
     * 操作
     * 0: 停用 1: 启用 2: 删除 3: 设为推荐 4: 编辑
     */
    toOperate = (id, flag) => {
        const _self = this;
        const cardSpecId = _self.props.params.cardid;
        switch (flag) {
            case 0: // 启用
                StoreRuleService.ToStartOrStopRechargeRule({
                    cardSpecId,
                    enable: 0,
                    storedRuleId: id
                }).then(res => {
                    message.success('设置成功', 1, () => {
                        _self.GetRechargeRuleList();
                    })
                })
                break;
            case 1: // 停用
                StoreRuleService.ToStartOrStopRechargeRule({
                    cardSpecId,
                    enable: 1,
                    storedRuleId: id
                }).then(res => {
                    message.success('设置成功', 1, () => {
                        _self.GetRechargeRuleList();
                    })
                })
                break;
            case 2: // 删除
                Modal.confirm({
                    title: '温馨提示',
                    content: '确定删除该充值规则',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        StoreRuleService.DeleteRechargeRule({
                            cardSpecId,
                            storedRuleId: id
                        }).then(res => {
                            message.success('删除成功', 1, () => {
                                _self.GetRechargeRuleList();
                            })
                        })
                    },
                    onCancel() {
                    }
                });
                break;
            case 3: // 设为推荐
                Modal.confirm({
                    title: '确定要将该充值规则设为推荐？',
                    content: '该操作会帮助您在充值页面将此条规则排列在先，并显示为推荐',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        StoreRuleService.ToTopRechargeRule({
                            cardSpecId,
                            storedRuleId: id,
                            topRecommended: 1
                        }).then(res => {
                            message.success('设置成功', 1, () => {
                                _self.GetRechargeRuleList();
                            })
                        })
                    },
                    onCancel() {
                    }
                });
                break;
            case 4: // 编辑
                StoreRuleService.GetRechargeRule({
                    cardSpecId: this.props.params.cardid,
                    storedRuleId: id,
                }).then(res => {
                    if (res != null) {
                        this.setState({
                            id,
                            storerule: res
                        }, () => {
                            this.showModal('修改充值规则');
                        })
                    }
                })
                break;
            default:
                break;
        }
    }

    /**
     * 新增充值规则
     */
    addRechargeRule = () => {
        this.setState({id: 0, storerule: null}, () => {
            this.showModal('新增充值规则');
        })
    }

    /**
     * 打开模态框
     */
    showModal = (title) => {
        this.setState({
            modalVisible: true,
            modalTitle: title
        });
    };

    /**
     * 模态框取消
     */
    handleCancel = () => {
        this.setState({
            modalVisible: false
        });
    };

    /**
     * 模态框确定
     */
    handleOk = (result) => {
        const {id} = this.state;
        let params = {
            amount: result.storeaccount,
            cardSpecId: this.props.params.cardid,
            enable: result.status ? 1 : 0,
            giftContent: result.storediscount == 2 ? result.storediscountval.split(',')[0] : result.storediscountval,
            giftContentName: result.storediscount == 2 ? result.storediscountval.split(',')[1] : '',
            giftType: result.storediscount,
            name: result.rulename
        }
        if (id != 0) { // 修改
            params.id = id;
            StoreRuleService.ModifyRechargeRule(params).then(res => {
                message.success('充值规则修改成功！', 2, () => {
                    this.setState({
                        modalVisible: false
                    }, () => {
                        this.GetRechargeRuleList();
                    })
                })
            })
        } else { // 新增
            StoreRuleService.AddRechargeRule(params).then(res => {
                message.success('充值规则添加成功！', 2, () => {
                    this.setState({
                        modalVisible: false,
                        pageNO: 1,
                        pageSize: 20
                    }, () => {
                        this.GetRechargeRuleList();
                    })
                })
            })
        }
    }

    /**
     * 模态框关闭时触发
     */
    afterClose = (callback) => {
        setTimeout(() => {
            this.setState({id: 0, storerule: null}, () => {
                callback();
            });
        }, 500)
    }

    /**
     * 绑定面包屑
     */
    bindBreadCrumb = () => {
        const {receiveData, params} = this.props;
        const title = `${this.getCardName(params.cardid)}卡充值规则`;
        this.setState({title})
        const breadcrumbdata = {
            title,
            routes: [
                {title: '会员中心'},
                {title: '加油卡', path: '/main/member_center/oil_card'},
                {title: title}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb');
    }

    /**
     * 获取卡种名称
     */
    getCardName = (cardid) => {
        switch (cardid) {
            case '1':
                return '汽油';
            case '2':
                return '柴油';
            default:
                break;
        }
    }

    /**
     * 查询卡种配置
     */
    GetCardConfig = () => {
        const {params} = this.props;
        OilCardService.GetCardConfig(params.cardid).then(res => {
            if (res != null) {
                this.setState({
                    checked: res.storedCustomerSwitch > 0,
                    rechargeInfo: res.storedDesc || ''
                })
            }
        })
    }

    /**
     * 切换任意充值
     */
    onChange = (val) => {
        this.setState({loading: true});
        const {params} = this.props;
        OilCardService.SetCardConfig({
            cardSpecId: params.cardid,
            storedCustomerSwitch: val ? 1 : 0
        }).then(res => {
            message.success('设置成功', 2)
            this.setState({checked: val, loading: false})
        }).catch(err => {
            this.setState({checked: !val, loading: false})
        })
    }

    /**
     * 获取Plan标题
     */
    getTitle = () => {
        const {checked, loading} = this.state;
        return (
            <div className="title">
                <div style={{marginRight: 11}}>任意金额充值</div>
                <Tooltip title="开关开启后，会员可以充值任意金额">
                    <Icon style={{color: '#FFBA18', marginLeft: '4px'}} type="exclamation-circle" />
                </Tooltip>
                <Switch className="switch" checkedChildren="开" unCheckedChildren="关" checked={checked} loading={loading} onChange={this.onChange} />
            </div>
        )
    }

    /**
     * 充值说明
     */
    rechargeInfo = () => {
        this.setState({
            showInfoModal: true
        })
        
    }

    /**
     * 获取按钮
     */
    getBtns = () => {
        const {responsive} = this.props;
        if (responsive.data.isMobile) {
            return null;
        } else {
            return (
                <div>
                    <Button onClick={this.rechargeInfo}>编辑充值说明</Button>
                    <Button type="primary" onClick={this.addRechargeRule}>新增充值规则</Button>
                </div>
            )
        }
    }

    /**
     * 保存充值说明
     */
    saveRechargeInfo = () => {
        const {params} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                OilCardService.SetCardConfig({
                    cardSpecId: params.cardid,
                    storedDesc: values.rechargeInfo
                }).then(res => {
                    message.success('保存成功', 1, () => {
                        this.setState({
                            rechargeInfo: values.rechargeInfo,
                            showInfoModal: false
                        })
                    });
                }).catch(err => {
                })
            }
        });
    }

    /**
     * 取消充值说明
     */
    cancelRechargeInfo = () => {
        this.setState({
            showInfoModal: false
        })
    }

    /**
     * 下一页
     */
    pageChange = (pageindex, pagesize) => {
        this.setState({
            pageNO: pageindex
        }, () => {
            this.GetRechargeRuleList();
        })
    }

    /**
     * 改变页大小
     */
    pageShowSizeChange = (current, size) => {
        this.setState({
            pageNO: 1,
            pageSize: size
        }, () => {
            this.GetRechargeRuleList();
        })
    }

    render() {
        const {showInfoModal, rechargeInfo, columns, ruleList, 
                tableLoading, pageNO, pageSize, total,
                modalTitle, modalVisible, storerule} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {responsive} = this.props;
        return (
            <div className="store-rule-list-container">
                <Panel title={this.getTitle()} headerBtnHtml={this.getBtns()}>
                    {
                        responsive.data.isMobile ? (
                            <div>
                                <Button onClick={this.rechargeInfo}>编辑充值说明</Button>
                                <Button type="primary" onClick={this.addRechargeRule}>新增充值规则</Button>
                                <WhiteSpace size="v-lg" />
                            </div>
                        ) : null
                    }
                    <Table columns={columns} dataSource={ruleList} locale={{emptyText: '暂无数据'}} 
                        loading={tableLoading}
                        scroll={{x: 1024}}
                        pagination={{
                            current: pageNO, 
                            hideOnSinglePage: true, 
                            pageSize, total, 
                            showQuickJumper: true, 
                            showSizeChanger: true,
                            onChange: this.pageChange,
                            onShowSizeChange: this.pageShowSizeChange}}/>
                </Panel>
                {/* 充值说明 */}
                <Modal
                    title='充值说明'
                    visible={showInfoModal}
                    onOk={this.saveRechargeInfo}
                    onCancel={this.cancelRechargeInfo}
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose={true}>
                    <Form ref="rechargeInfoForm">
                        <FormItem>
                            {getFieldDecorator('rechargeInfo', {
                                rules: [{
                                    required: true, message: '请输入充值说明!', whitespace: true
                                }],
                                initialValue: rechargeInfo
                            })(
                                <TextArea rows={5} placeholder="请输入充值说明" maxLength={256}/>
                            )}
                        </FormItem>
                    </Form>
                    <span>最多输入256字</span>
                </Modal>
                {/*新增、编辑模态框*/}
                <StoreRuleOperate ref="storeRuleOperateForm" title={modalTitle} visible={modalVisible} storerule={storerule} handleCancel={this.handleCancel} handleOk={this.handleOk} afterClose={this.afterClose}/>
                <style>
                    {
                        `
                        .ant-form-item {
                            margin-bottom: 15px;
                        }
                        `
                    }
                </style>
            </div>
        )
    }
}

export default connect(state => {
    const {responsive} = state.AppData;
    return {
        responsive
    }
}, {receiveData})(Form.create()(StoreRuleList));
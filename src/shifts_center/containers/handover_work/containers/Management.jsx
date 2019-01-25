import React, { Component } from 'react';
import {connect} from 'react-redux';
import { receiveData } from '@/base/redux/actions';

import { Switch, Row, Col, Modal, message } from 'antd';

import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import PersonCard from '@/shifts_center/containers/handover_work/components/person_card/PersonCard';
import NoData from '@/common/components/no_data/NoData';

import handoverWorkService from '@/shifts_center/services/handover_work/handover_work.service';

const confirm = Modal.confirm;

class Management extends Component {
    state = {
        // 上班的加油员列表
        toWorkList: [],
        // 休息的加油员列表
        offWorkList: [],
        // 自动续班是否开启 0-开启 1-关闭
        autoWorkStatus: 1
    };

    componentDidMount() {
        this.findWorkUserListFun();
    }

    // 查询加油员列表
    findWorkUserListFun = () => {
        handoverWorkService.findWorkUserList()
            .then((res) => {
                this.setState({
                    toWorkList: res.toWorkList,
                    offWorkList: res.offWorkList,
                    autoWorkStatus: res.autoWorkStatus
                })
            })
            .catch((err) => {
                console.log(err);
            })
    };

    // panel的title
    title = () => {
        const {
            autoWorkStatus
        } = this.state;

        return (
            <div className="title">
                <div>自动续班</div>
                <Switch className="switch" checkedChildren="开" unCheckedChildren="关"
                        onChange={this.modifyAutoWorkStatusFun} checked={autoWorkStatus === 0}
                />
                <div className="tips">(开关开启后，交班后自动开始下一个班次)</div>
            </div>
        )
    };

    // 上班
    showStartWorkConfirm = (id) => {
        const _this = this;
        let params = {
            staffId: id,
            status: 0
        };
        confirm({
            title: '确认上班吗？',
            content: '加油员开始上班，开始记录',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                // 修改工作状态 status 0-上班 1-休息
                handoverWorkService.modifyWorkStatus(params)
                    .then((res) => {
                        message.success('加油员上班成功');
                        _this.findWorkUserListFun();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            onCancel() {

            },
        });
    };

    // 交班
    showStopWorkConfirm = (id) => {
        const _this = this;
        let params = {
            staffId: id,
            status: 1
        };
        confirm({
            title: '确认交班吗？',
            content: '加油员交班完成，生成班结记录',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                // 修改工作状态 status 0-上班 1-休息
                handoverWorkService.modifyWorkStatus(params)
                    .then((res) => {
                        message.success('加油员交班成功');
                        _this.findWorkUserListFun();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            onCancel() {

            },
        });
    };

    // 自动续班设置
    modifyAutoWorkStatusFun = (checked) => {
        let status = checked ? 0 : 1;
        handoverWorkService.modifyAutoWorkStatus(status)
            .then((res) => {
                this.setState({
                    autoWorkStatus: status
                });
                this.findWorkUserListFun();
            })
            .catch((err) => {
                console.log(err);
            })
    };

    render () {
        const {
            toWorkList,
            offWorkList
        } = this.state;

        const cardLayout = {
            xs: {span: 24},
            sm: {span: 12},
            md: {span: 8},
            lg: {span: 8},
            xl: {span: 6},
            xxl: {span: 4}
        };
        // 加油员列表数据
        const workItems = [];
        const restItems = [];

        if(toWorkList) {
            toWorkList.map((item, index) => {
                return workItems.push(
                    <Col key={index} {...cardLayout}>
                        <PersonCard dataItem={item} handleClick={this.showStopWorkConfirm} />
                    </Col>
                )
            })
        }

        if(offWorkList) {
            offWorkList.map((item, index) => {
                return restItems.push(
                    <Col key={index} {...cardLayout}>
                        <PersonCard dataItem={item} handleClick={this.showStartWorkConfirm} />
                    </Col>
                )
            })
        }

        return (
            <div className="management-container">
                <Panel title={this.title()}>
                    <div>
                        <div className="work-status">当班中</div>
                        <WhiteSpace size="v-2xl" />
                        {
                            workItems ? (
                                <Row gutter={32}>
                                    {workItems}
                                </Row>
                            ) : (
                                <NoData />
                            )
                        }
                    </div>
                    <div>
                        <div className="work-status">休息中</div>
                        <WhiteSpace size="v-2xl" />
                        {
                            workItems ? (
                                <Row gutter={32}>
                                    {restItems}
                                </Row>
                            ) : (
                                <NoData />
                            )
                        }
                    </div>
                </Panel>
            </div>
        )
    }
}

export default connect(
    state => {
        const {responsive, menu} = state.AppData;
        return {
            responsive,
            menu
        }
    },
    {receiveData}
)(Management);
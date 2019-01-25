/**
 * 每升立减
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Card, Icon, Button, Modal, message} from 'antd'

import Panel from "@/common/components/panel/Panel"
import WhiteSpace from '@/common/components/white_space/WhiteSpace'
import ActivityCard from "./components/ActivityCard"
import {receiveData} from '@/base/redux/actions';
import perRiseMinusService from '@/marketing_center/services/per_rise_minus/per_rise_minus.service'

class PerRiseMinus extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    state = {
        title: '每升立减',
        dataSource: []
    }

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '每升立减',
            routes: [
                {title: '营销中心', path: ''},
                {title: '每升立减', path: '/main/marketing_center/per_rise_minus'}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        const _self = this;
        perRiseMinusService.litreActivityFindList().then(res => {
            console.log(res, 'res');
            _self.setState({
                dataSource: res
            })
        })
    }

    addNewActive = (res) => {
        // id为0时为新增
        this.props.history.push('/main/marketing_center/per_rise_minus_new')
    };

    onEdit = (res) => {
        this.props.history.push('/main/marketing_center/per_rise_minus_edit/' + res.id)
    };

    onDel = (res) => {
        console.log('删除', res.id);
        const _self = this;
        Modal.confirm({
            title: '请确认',
            content: '是否删除该活动',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                perRiseMinusService.litreActivityDel(res.id).then(res => {
                    console.log(res, 'res');
                    message.success('删除活动成功')
                    _self.refreshData();
                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    };

    onEnd = (res) => {
        const _self = this;
        Modal.confirm({
            title: '请确认',
            content: '是否提前关闭该活动',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                perRiseMinusService.litreActivityEnd(res.id).then(res => {
                    console.log(res, 'res');
                    message.success('提前关闭该活动成功')
                    _self.refreshData();
                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    };

    render() {
        const {dataSource} = this.state;

        let activityCardList = [];
        if (dataSource) {
            for (let item of dataSource) {
                activityCardList.push(
                    <div key={item.id}>
                        <WhiteSpace size="v-xl" />
                        <ActivityCard
                            id={item.id}
                            name={item.name}
                            status={item.status}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            details={item.details}
                            onDel={this.onDel}
                            onEnd={this.onEnd}
                            onEdit={this.onEdit}
                        />
                    </div>
                )
            }
        }

        return (
            <div>
                <Panel>
                    <Button type="primary" onClick={this.addNewActive}>新增活动</Button>
                    {activityCardList}
                </Panel>
            </div>

        )
    }
}

export default connect(state => ({}), {receiveData})(PerRiseMinus);
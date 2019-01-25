import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Card, Button, Row, Col} from 'antd'
import moment from 'moment'

import "./activity-card.less"

const {Meta} = Card;

class GoodesCard extends React.Component {
    static propTypes = {
        id: PropTypes.number,           //活动id
        name: PropTypes.string,         //活动名
        status: PropTypes.string,       //状态值
        startTime: PropTypes.number,    //开始时间
        endTime: PropTypes.number,      //结束时间
        details: PropTypes.array,       //列表详情
        onEdit: PropTypes.func,         //编辑库存
        onEnd: PropTypes.func,          //操作
        onDel: PropTypes.func,          //显示详情
        customClass: PropTypes.string,  //自定义类名
    };

    state = {
        statusMap: null,
        cardData: []
    };

    componentDidMount() {

    }

    onEdit = (e) => {
        const {id} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.onEdit({
            id
        });
    };

    onEnd = (e) => {
        const {id} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.onEnd({
            id
        });
    };

    onDel = (e) => {
        const {id} = this.props;
        console.log('onDel', id);
        e.preventDefault();
        e.stopPropagation();
        this.props.onDel({
            id
        });
    };

    // 根据状态值显示不同的内容
    statusShow = (status) => {
        let statusShowData = {};
        switch (status) {
            case 'NOT_START': {
                statusShowData.statusStr = '未开始';
                statusShowData.statusButton = (
                    <div>
                        <Button onClick={this.onDel}>删除</Button>
                        <Button type="primary" onClick={this.onEdit}>编辑</Button>
                    </div>
                );
                return statusShowData;
            }
            case 'ACTIVITING': {
                statusShowData.statusStr = '进行中';
                statusShowData.statusButton = (
                    <div>
                        <Button onClick={this.onEnd}>提前结束</Button>
                    </div>
                );
                return statusShowData;
            }
            case 'OVER': {
                statusShowData.statusStr = '已结束';
                statusShowData.statusButton = (
                    <div>
                        <Button onClick={this.onDel}>删除</Button>
                    </div>
                );
                return statusShowData;
            }
            case 'FORCE_CLOSED': {
                statusShowData.statusStr = '已结束';
                statusShowData.statusButton = (
                    <div>
                        <Button onClick={this.onDel}>删除</Button>
                    </div>
                );
                return statusShowData;
            }
            default: {
                statusShowData.statusStr = '';
                statusShowData.statusButton = null;
                return statusShowData;
            }
        }
    };

    render() {
        const {
            name,
            startTime,
            endTime,
            status,
            details,
            customClass
        } = this.props;

        const isMemberList = [];
        const notMemberList = [];
        if (details) {
            for (let item of details) {
                isMemberList.push(
                    <div
                        className="list" key={item.skuName}>{item.skuName + '#（单价：' + item.originalPrice + '/升）立减￥' + item.mbrSubtract + '/升'}</div>
                )
                notMemberList.push(
                    <div
                        className="list" key={item.skuName}>{item.skuName + '#（单价：' + item.originalPrice + '/升）立减￥' + item.nonMbrSubtract + '/升'}</div>
                )
            }
        }

        let statusShowData = this.statusShow(status);

        const isStarting = status == 'ACTIVITING' ? 'starting' : '';
        const goodsCardClass = classnames('activity-card', isStarting, customClass);

        return (

            <div className={goodsCardClass}>
                <Card
                    title={(<div><span>{name}</span>
                        <span className="status-content">(
                        <span className="status">{statusShowData.statusStr}</span>
                            ) </span>
                    </div>)}
                    extra={
                        <div>
                            {statusShowData.statusButton}
                        </div>
                    }
                >
                    <div>
                        <Row>
                            <Col xs={24} lg={3}>
                                <div className="label-title">活动时间：</div>
                            </Col>
                            <Col xs={24} lg={21} className="time">
                                <label>{moment(startTime).format('YYYY.MM.DD')}</label> -
                                <label>{moment(endTime).format('YYYY.MM.DD')}</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} lg={3}>
                                <div className="label-title">油品优惠：</div>
                            </Col>
                            <Col xs={24} lg={21}>
                                <Row>
                                    <Col xs={24} lg={9} className="is-member">
                                        <div className="identity">会员</div>
                                        {isMemberList}
                                    </Col>
                                    <Col xs={24} lg={{span: 12, offset: 3}} className="not-member">
                                        <div className="identity">非会员</div>
                                        {notMemberList}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        )
    }
}

export default GoodesCard;
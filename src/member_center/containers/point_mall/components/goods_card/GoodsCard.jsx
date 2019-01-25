import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Card, Icon, Menu, Dropdown} from 'antd'
import moment from 'moment'

import './goods_card.less'

const {Meta} = Card;

class GoodesCard extends React.Component {
    static propTypes = {
        id: PropTypes.number,           //活动id
        skuId: PropTypes.number,        //商品id
        name: PropTypes.string,         //商品名
        imageUrls: PropTypes.string,    //商品图片
        startTime: PropTypes.number,    //开始时间
        endTime: PropTypes.number,      //结束时间
        score: PropTypes.number,        //所需积分
        alreadyCount: PropTypes.number, //已兑数量
        count: PropTypes.number,        //库存
        status: PropTypes.number,       //状态值
        onEdit: PropTypes.func,         //编辑库存
        onOption: PropTypes.func,       //操作
        onShowDetail: PropTypes.func,    //显示详情
        customClass: PropTypes.string,  //自定义类名
    };

    state = {
        cardData: []
    };

    onOption = (e) => {
        const {id, status} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.onOption({
            id,
            status
        });

    };

    onEdit = (e) => {
        const {id, skuId, name,count} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.onEdit({
            id,
            skuId,
            name,
            count
        });
    };

    onShowDetail = (e) => {
        const {id} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.onShowDetail(id);
    };

    preventEvent = (e) =>{
        e.preventDefault();
        e.stopPropagation();
    };

    render() {
        const {
            name,
            imageUrls,
            startTime,
            endTime,
            score,
            alreadyCount,
            count,
            status,
            onEdit,
            onOption,
            onShowDetail,
            customClass
        } = this.props;

        const isStarting = status == 1 ? 'starting' : '';
        const isEnd = status === 2 ? 'end' : '';

        const goodsCardClass = classnames('goods-card', isStarting, isEnd, customClass);

        //操作
        const optionText = status === 1 ? '提前结束' : '删除';

        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.onOption}>{optionText}</a>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className={goodsCardClass}>
                <Card
                    onClick={this.onShowDetail}
                    hoverable
                    cover={<img style={{height: 149}} alt="example" src={imageUrls} />}
                >
                    <div className="goods-card-title">{name}</div>
                    <div className="goods-card-time-wrap">
                        <span>{moment(startTime).format('YYYY.MM.DD')}</span> - <span>{moment(endTime).format('YYYY.MM.DD')}</span>
                    </div>
                    <div className="goods-card-footer">
                        <div className="goods-card-storages">
                            <span>库存：</span>
                            <span>{alreadyCount}</span>/
                            <span>{count}  </span>
                            <Icon className="edit-icon" type="edit" theme="filled" onClick={this.onEdit} />
                        </div>
                        <div className="goods-card-options">
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <Icon type="ellipsis" size="large" style={{fontSize: '22px'}} onClick={this.preventEvent}/>
                            </Dropdown>
                        </div>
                    </div>
                </Card>
                <div className="point">
                    {score}积分
                </div>
            </div>
        )
    }
}

export default GoodesCard;
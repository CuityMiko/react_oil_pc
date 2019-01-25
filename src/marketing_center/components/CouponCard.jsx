/**
 * 卡券card组件，界面效果参考卡券列表的单个card，调用组件时主要传dataSource(对象)数据源，
 * 数据源内部的参数类型参考propsType类型定义，具体形式参考下面：
 dataSource = {
            id:'11',
            putInChannel:'卡券广场',
            couponAmount:'80',
            couponName:'满78减67',
            couponTime:'2017.09.12-2018.10.12',
            labelText:'库存',
            get:'80',
            total:'190',
            status:'1',
            couponCardBack:couponCardBack,
            edit:this.edit,
            detail:this.detail,
            dataOperations:dataOperations
        };
  其中dataOperations为数组：dataOperations=[
        {text:'复制',handleClick:this.copy},
        {text:'删除',handleClick:this.del},
        {text:'推广',handleClick:this.link}
        ];
 调用方法：<CouponCard dataSource={item} ></CouponCard>
*/

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {  Row, Col, Menu, Dropdown,Icon, message} from 'antd';

import couponCardBack from '@/marketing_center/assets/images/coupon-card-back.png';

import './coupon_card.less';

class CouponCard extends Component {

    // 数据类型，一个数据源dataSource，
    static propTypes = {
        // 页面数据以对象传过来，其中包括各个字段、操作选项(对象形式组成的数组形式)、点击回调函数
        // labelText-默认库存，可根据需要传，couponCardBack-背景图片根据需要传，有默认值
        dataSource: PropTypes.shape({
            // 页面上需要显示的字段
            putInChannel: PropTypes.string,
            couponAmount: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            couponName: PropTypes.string,
            couponTime: PropTypes.string,
            labelText:PropTypes.string,
            get:PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            total:PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            status:PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            couponCardBack:PropTypes.string,
            // 修改库存函数
            edit:PropTypes.func,
            // 跳转详情
            detail:PropTypes.func,
            // 更多操作选项数组
            dataOperations:PropTypes.arrayOf(PropTypes.shape(
                {
                    text: PropTypes.string,
                    handleClick:PropTypes.func
                }
            )),
        }),
    };
    // 状态默认值
    state = {
        labelText:'库存',
        // 默认背景图
        couponCardBack:couponCardBack
    };
    render() {
        const {dataSource} = this.props;
        const { labelText,couponCardBack } = this.state;
        const couponBack = dataSource.couponCardBack?dataSource.couponCardBack:couponCardBack;
        // going-style控制进行中状态时的高亮形式
        const textLeft = classnames('left-line',
            {'going-style':dataSource.status==1});
        // 整个menu内容以data形式传过来，作为操作选项
        const menuOperations = (
            <Menu>
                {
                    dataSource.dataOperations.map((val, index) => {
                        return (
                            <Menu.Item key={index}>
                                <p onClick={(e)=>{val.handleClick(e,dataSource.id,dataSource.couponNumber,dataSource.couponName)}} key={index}>{val.text}</p>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        );

        return (
            <div className="coupon-card-container">
                <div className="coupon-container">
                    <Row className="coupon-top" type="flex" justify="center" align="middle" onClick={(e)=>{dataSource.detail(e,dataSource.couponNumber,dataSource.id,dataSource.status)}}>
                        <Col className="put-in-channel">{dataSource.putInChannel}</Col>
                        <Col className="coupon-name" type="flex" justify="center" align="middle" style={{backgroundImage: 'url(' + couponBack + ')'}}>
                            ￥{dataSource.couponAmount}
                        </Col>
                    </Row>
                    <Row className="coupon-bottom">
                        <Col className="bottom-left">
                            <Col className={textLeft} md={20} lg={20} xs={20} type="flex" align="middle"
                                 justify="center">
                                <div className="coupon-rule-title">
                                    {dataSource.couponName && dataSource.couponName.length>10?dataSource.couponName.slice(0,10)+'...':dataSource.couponName}
                                </div>
                                <div className="coupon-rule-time">{dataSource.couponTime}</div>
                                <div className="coupon-rule-inventory">
                                    {dataSource.labelText?dataSource.labelText:labelText}:
                                    <span>{dataSource.get}</span>/<span>{dataSource.total}</span>
                                    { dataSource.status==1 && dataSource.total!='不限制' &&
                                       ( <Icon className="edit-icon" type="edit" theme="filled"
                                               onClick={(e)=>{dataSource.edit(e, dataSource.id,
                                                   dataSource.couponName,dataSource.get,
                                                   dataSource.total)}} />) }
                                </div>
                            </Col>
                            <Col className="right-line" md={4} lg={4} xs={4} type="flex" align="middle"
                                 justify="center">
                                <Dropdown overlay={menuOperations} placement="bottomCenter"
                                          overlayClassName="coupon-more-options" trigger={['click','hover']}>
                                    <Icon type="ellipsis" size="large" style={{fontSize: '22px'}} />
                                </Dropdown>
                            </Col>
                        </Col>
                    </Row>
                </div>

            </div>
        )
    }
}

export default CouponCard;

/*
 * PersonCard组件：用于交接班管理中的数据展示
 *
 * 1. dataItem: 展示的数据源
 * 2. handleClick: 点击按钮进行的回调函数
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Button } from 'antd';

import './person_card.less';

class PersonCard extends Component {
    static propTypes = {
        dataItem: PropTypes.object.isRequired,
        handleClick: PropTypes.func.isRequired
    };

    // 判断是显示头像还是显示名字
    isHeadImg = (headImg, name) => {
        if(headImg) {
            return (
                <img className="headImg" src={headImg} alt="" />
            )
        } else {
            return (
                <div className="circle">{name.substr(0, 1)}</div>
            )
        }
    };

    render () {
        const {
            dataItem,
            handleClick
        } = this.props;

        const {
            staffId, // 加油员id
            headImgUrl, // 用户头像，如果没有头像则是null
            userName, // 加油员姓名
            status // 交接班状态，0-当班，1-休息，默认是当班
        } = dataItem;

        const containerClass = classnames('person-card-container', {
            'person-rest-container': status === 1
        });

        return (
            <div className={containerClass}>
                {this.isHeadImg(headImgUrl, userName)}
                <div className="name">{userName}</div>
                <div className="status">{status === 0 ? '当班' : '休息'}</div>
                <Button className="button" type="primary" onClick={() => handleClick(staffId)}>{status === 0 ? '交班' : '上班'}</Button>
            </div>
        )
    }
}

export default PersonCard;
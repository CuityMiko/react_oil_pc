/**
 * 表格组件,样式参考营销分析的的表格效果，传参为数据源detailData，数据类型参考propTypes类型定义
 * 调用形式：<TableUser detailData={detailDataRetain}></TableUser>
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Icon,message } from 'antd';
import classNames from 'classnames';
import moment from 'moment';

import { receiveData } from '@/base/redux/actions';

import './table_user.less';

class TableUser extends Component {
    // 数据类型
    static propTypes = {
        detailData: PropTypes.shape({
            titleText: PropTypes.string,
            numText: PropTypes.string,
            perText: PropTypes.string,
            // 表格循环数据数组
            dataItems:PropTypes.arrayOf(PropTypes.shape(
                {
                    title: PropTypes.string,
                    num:PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.number,
                    ]),
                    per:PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.number,
                    ])
                }
            )),
        }).isRequired,
    };

    // 默认参数
    static defaultProps = {
        detailData:{
            titleText:'--',
            numText:'--',
            perText:'--',
            dataItems:[
                {
                    title:'--',
                    num:'--',
                    per:'--'
                },
                {
                    title:'--',
                    num:'--',
                    per:'--'
                },
                {
                    title:'--',
                    num:'--',
                    per:'--'
                }
            ]
        }
    };

    render() {
        const {detailData} = this.props;
        return (
            <div className="table-content">
               <Row className="title-content">
                   <Col md={14} xs={14} lg={14}>{detailData.titleText}</Col>
                   <Col md={5} xs={5} lg={5}>{detailData.numText}</Col>
                   <Col md={5} xs={5} lg={5}>{detailData.perText}</Col>
               </Row>
                {
                    detailData.dataItems.map((val, index) => {
                        return (
                            <Row key={index} className="text-content">
                                <Col md={14} xs={14} lg={14}>{val.title}</Col>
                                <Col md={5} xs={5} lg={5}>{val.num}</Col>
                                <Col md={5} xs={5} lg={5}>{val.per}</Col>
                            </Row>
                        )
                    })
                }
            </div>
        )
    }
}
export default connect(
    state => {
        const {responsive, menu} = state.AppData;
        const LoginUserInfo = state.LoginUserInfo;
        return {
            responsive,
            menu,
            LoginUserInfo
        }
    }, {receiveData})(TableUser);

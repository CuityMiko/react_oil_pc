/*
 * NumberCard组件：用于展示key-value形式的数据
 *
 * prop: 1.numberData,数据格式为map，必填
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import './number_card.less';

class NumberCard extends Component {
    static propTypes = {
        numberData: PropTypes.object.isRequired
    };

    render() {
        const { numberData } = this.props;

        const cardLayout = {
            xs: {span: 24},
            sm: {span: 12},
            md: {span: 6},
            lg: {span: 4},
            xl: {span: 4},
            xxl: {span: 4}
        };

        return (
            <div className="number-card-container">
                <Row>
                    {
                        [...numberData].map((item, index) => {
                            return (
                                <Col {...cardLayout} key={index}>
                                    <div className="box">
                                        <div className="key">{item[0]}</div>
                                        <div>{item[1]}</div>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        )
    }
}

export default NumberCard;
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'antd'

import styles from './header_logo.module.less'
import logo from '@/base/assets/images/logo.svg'
import {Link} from 'react-router-dom'

export default class HeadLogo extends Component {    
    static propTypes = {
        title: PropTypes.string.isRequired
    }
    
    static defaultProps = {
        title: '加油站后台管理'
    }

    render() {
        const {title} = this.props;
        return (
            <Link to='/login/index'>
                <div className={styles.login_logo}>
                    <Row>
                        <Col xs={24} md={4}><img src={logo} /></Col>
                        <Col xs={24} md={20}><span className={styles.hlogo}>{title}</span></Col>
                    </Row>
                </div>
            </Link>
        )
    }
}
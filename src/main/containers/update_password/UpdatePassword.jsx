import React, {Component} from 'react'
import {connect} from 'react-redux'

import WingBlank from '@/common/components/wing_blank/WingBlank'
import WhiteSpace from '@/common/components/white_space/WhiteSpace'
import Panel from '@/common/components/panel/Panel'
import {receiveData} from '@/base/redux/actions'

import WrappedResetPasswordForm from './components/WrappedResetPasswordForm'

class UpdatePassword extends Component {
    state = {
        title: '密码设置'
    };

    componentWillMount() {
        const {receiveData} = this.props;
        receiveData(null, 'breadcrumb');
    }

    render() {
        return (
            <div className="personal-information">
                {/*<WhiteSpace />*/}
                <Panel panelHeader={true} title="密码设置">
                    <WrappedResetPasswordForm></WrappedResetPasswordForm>
                </Panel>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(UpdatePassword);
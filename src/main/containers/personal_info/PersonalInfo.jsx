import React, {Component} from 'react'
import {connect} from 'react-redux';

import WhiteSpace from '@/common/components/white_space/WhiteSpace'
import Panel from '@/common/components/panel/Panel'
import {receiveData} from '@/base/redux/actions';
import WrappedInformationForm from './components/WrappedInformationForm'

class PersonalInfo extends Component {
    state = {
        title: '个人信息'
    };

    componentWillMount() {
        const {receiveData} = this.props;
        receiveData(null, 'breadcrumb');
    }

    render() {
        return (
            <div className="personal-information">
                <Panel panelHeader={true} title="个人信息">
                    <WrappedInformationForm></WrappedInformationForm>
                </Panel>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(PersonalInfo);
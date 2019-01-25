import React, {Component} from 'react';
import {connect} from "react-redux";

import WingBlank from '@/common/components/wing_blank/WingBlank';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import Panel from '@/common/components/panel/Panel';
import {receiveData} from '@/base/redux/actions';
import OiltationInfoForm from './components/OiltationInfoForm';

class OiltationInformationEdit extends Component {
    state = {
        title: '加油站信息',
    }

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '加油站信息',
            routes: [
                {title: '加油站管理'},
                {title: '加油站信息', path: '/main/oiltation_manage/oiltation_information'}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    render() {
        return (
            <div>
                <Panel>
                    <WhiteSpace size="v-xl" />
                    <WingBlank size="l-2xl">
                        <WhiteSpace size="v-xl" />
                        <OiltationInfoForm history={this.props.history} />
                    </WingBlank>
                </Panel>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(OiltationInformationEdit);
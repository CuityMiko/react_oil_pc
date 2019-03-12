import React, {Component} from 'react';
import {Button} from 'antd';
import {connect} from "react-redux";

import DetailShowComplex from '@/common/components/detail_show/DetailShowComplex';
import {receiveData} from '@/base/redux/actions';
import oiltationInformationService
    from '@/oiltation_manage/services/oiltation_information/oiltation_information.service';

class OiltationInformation extends Component {
    state = {
        title: '油站信息',
        dataSource: {},
        latitude: '',
        longitude: ''
    };

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
        oiltationInformationService.merchantGetInfo().then(res => {
            let data = new Map();
            if(res.latitude==null || res.latitude == undefined || res.latitude === ''){
                res.latitude = ''
            }
            if(res.longitude==null || res.longitude == undefined || res.longitude === ''){
                res.longitude = ''
            }
            data.set('联系人', res.contactName);
            data.set('联系电话', res.contactMobile);
            data.set('油站logo', res.logoUrl);
            data.set('省/市', res.cityMergerName);
            data.set('详细地址', res.address);
            data.set('位置', res.latitude + '+' + res.longitude)
            this.setState({
                dataSource: data
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                <DetailShowComplex headerHave={true} footerHave={false} titleName="" btnTitle={true}
                                   data={this.state.dataSource} direction="vertical" showPosition="showCenter">
                    <Button type="primary" onClick={() => {
                        this.props.history.push('/main/oiltation_manage/oiltation_information_edit')
                    }}>编辑</Button>
                </DetailShowComplex>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(OiltationInformation);
/**
 * 每升立减编辑
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Card, Icon, Button, Modal, message} from 'antd'

import {receiveData} from '@/base/redux/actions';
import Panel from "@/common/components/panel/Panel"
import WrapEditForm from './components/EditForm'

import perRiseMinusService from '@/marketing_center/services/per_rise_minus/per_rise_minus.service'

class PerRiseMinusEdit extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const {
            id
        } = this.props.params;
        const breadcrumbdata = {
            title: '每升立减编辑',
            routes: [
                {title: '营销中心', path: ''},
                {title: '每升立减', path: '/main/marketing_center/per_rise_minus_edit/' + id}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    //获取表单数据
    getFormData = (form) => {
        this.form = form;
    };

    // 按钮提交
    handleSubmit = (e) => {
        e.preventDefault();
        const {id} = this.props.params;
        this.form.validateFields((err, values) => {
            // 设置活动详情
            let _details = [];
            // 会员有优惠下标数组列表
            let _isMemberIndexList = [];
            // 非会员有优惠下标数组列表
            let _notMemberIndexList = [];
            //获取下标
            for (let i in values.isMember) {
                if (values.isMember[i]) {
                    _isMemberIndexList.push(i);
                }
            }
            for (let i in values.notMember) {
                if (values.notMember[i]) {
                    _notMemberIndexList.push(i);
                }
            }
            // 合并下标数组并去重
            let _indexList = Array.from(new Set(_isMemberIndexList.concat(_notMemberIndexList)));
            // 判断是否设置过优惠
            if(_indexList.length == 0){
                message.error('请至少设置一个油品优惠')
                return;
            }
            // 通过下标取值
            for (let i of _indexList) {
                let detail = {};
                detail.skuId = i;
                detail.mbrSubtract = values.isMember[i];
                detail.nonMbrSubtract = values.notMember[i];
                // }
                _details.push(detail);
            }
            // 表单提交数据处理
            let postData = {};
            postData.name = values.name;
            postData.startTime = values.time[0].format('x');
            postData.endTime = values.time[1].format('x');
            postData.details = _details;
            postData.id = id;
            console.log(postData, 'postData');
            perRiseMinusService.litreActivityModify({...postData}).then(res => {
                message.success('修改成功');
                this.props.history.push('/main/marketing_center/per_rise_minus')
            }).catch(
                err => {
                    console.log(err)
                }
            )
        });
    };

    onCancel = () => {
        this.props.history.push('/main/marketing_center/per_rise_minus')
    };

    render() {
        const {
            id
        } = this.props.params;

        return (
            <div>
                <Panel title="编辑活动"
                       headerBtnHtml={
                           <div>
                               <Button onClick={this.onCancel}>取消</Button>
                               <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                           </div>}>
                    <WrapEditForm ref={this.getFormData} id={id} />
                </Panel>
            </div>

        )
    }
}

export default connect(state => ({}), {receiveData})(PerRiseMinusEdit);
import React, {Component} from 'react'
import DetailShowSimple from '@/common/components/detail_show/DetailShowSimple'

export default class OperatorDetail extends Component {
    // 数据类型
    render() {
        console.log(this.props.record)
        let data = new Map();
        data.set("姓名", this.props.record.realname ? this.props.record.realname : '');
        if (this.props.record.sex) {
            data.set("性别", this.props.record.sex == 1 ? '男' : '女');
        }
        data.set("角色", this.props.record.roleNames ? this.props.record.roleNames : '');
        data.set("手机号", this.props.record.mobilePhone ? String(this.props.record.mobilePhone) : '');
        data.set("用户头像", this.props.record.headimgUrl ? String(this.props.record.headimgUrl) : '');
        return (
            <DetailShowSimple data={data} />
        )
    }
}
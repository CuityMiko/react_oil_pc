import React, {Component, Fragment} from 'react';
import { Row, message, Col, Button, Icon } from 'antd';
import PropsType from 'prop-types';
import {connect} from 'react-redux';

import moment from 'moment';

import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import { receiveData } from '@/base/redux/actions';

import stepImg1 from '../../../../assets/images/step-1.png';
import stepImg2 from '../../../../assets/images/step-2.png';
import stepImg3 from '../../../../assets/images/step-3.png';
import stepImg4 from '../../../../assets/images/step-4.png';
import stepImg5 from '../../../../assets/images/step-5.png';
import stepImg6 from '../../../../assets/images/step-6.png';

class MemberImportHelper extends Component {

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '帮助手册',
            routes: [
                {title: '会员中心'},
                {title: '会员列表', path: '/main/member_center/member_list'},
                {title: '会员导入', path: '/main/member_center/member_import'},
                {title: '帮助手册', path: '/main/member_center/member_import_help'}
            ],
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    componentDidMount() {
    }

    // 渲染html
    render() {

        return (
            <div className="mbr-list-container import-help-container">
                <WingBlank size="l-3xl">
                    <WhiteSpace size="v-xl" />
                       <div>
                           <p className="step-1-p">
                               1.登录爱加油后台管理系统 - 会员中心 - 会员列表，点击左上角“导入”功能（会员列表）
                           </p>
                           <img src={stepImg1} alt=""/>
                       </div>
                    <div>
                        <p>
                            2.进入导入记录页，点击“批量导入”按钮
                        </p>
                        <img src={stepImg2} alt=""/>
                    </div>
                    <div>
                        <p>
                            3.下载会员导入模板，并将Execl格式的模板表格保存在电脑内
                        </p>
                        <img src={stepImg3} alt=""/>
                    </div>
                    <div>
                        <p>
                            4.根据下载的模板要求，添加需要导入的会员信息在表格内，完成后保存
                        </p>
                        <img src={stepImg4} alt=""/>
                    </div>
                    <div>
                        <p>
                            5.点击导入 - 批量导入-选择文件-上传，将之前保存的EXCEL文件拖动到该区域，点击“确定”即可，完成后会显示本次导入的成功及失败的数据
                        </p>
                        <img src={stepImg5} alt=""/>
                    </div>
                    <div>
                        <p>
                            6.导入失败的数据，可以点击“下载报表”至电脑内，查看失败的数据，并修改后，重新导入
                        </p>
                        <img src={stepImg6} alt=""/>
                    </div>

                    <WhiteSpace size="v-xl" />
                </WingBlank>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(MemberImportHelper);
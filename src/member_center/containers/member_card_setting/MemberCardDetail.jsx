import React, {Component} from 'react';
import PropsType from 'prop-types';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import classNames from 'classnames';
import { Modal, Row, message, Form, Col, Button } from 'antd';

import { receiveData } from '@/base/redux/actions';
import BreadcrumbCustom from '@/common/components/breadcrumb/BreadcrumbCustom';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import WingBlank from '@/common/components/wing_blank/WingBlank';
import DetailShowComplex from '@/common/components/detail_show/DetailShowComplex';
import H5Link from './components/H5Link';

import h5Back from '@/member_center/assets/images/h5-preview.png';
import maskBack from '@/member_center/assets/images/h5-user-back.png';

import MemberCardService from '@/member_center/services/member_card_setting/member_card_setting.service';
import OilstationInfoService from '@/oiltation_manage/services/oiltation_information/oiltation_information.service';

import './member_card_setting.less';

const FormItem = Form.Item;

class MemberCardDetail extends Component {
    // 状态参数
    state = {
        title: '会员卡设置',
        detailData:{},
        dataMbrCardBasic: new Map(),
        dataMbrCardGet: new Map(),
        visible: false,
        modalTitle: '',
        mbrCovers:'0',
        cardCoverChoice:'',
        merchantLogoPreview:'',
        h5BackImgUser:'',
        merchantName:'',
        giftCouponNumber:'',
        H5LinkUrl:''
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '会员卡设置',
            routes: [
                {title: '会员中心'},
                {title: '会员卡设置', path: '/main/member_center/member_card_detail'}
            ],
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }
    componentDidMount() {
        // 详情接口
        const {LoginUserInfo} = this.props;
        MemberCardService.detailMbrCard().then((dataMbrCard)=>{
            this.setState({
                detailData:dataMbrCard.originData,
                dataMbrCardBasic:dataMbrCard.dataMbrCardBasic,
                dataMbrCardGet:dataMbrCard.dataMbrCardGet,
                giftCouponNumber:dataMbrCard.originData.giftCouponNumber,
                mbrCovers:dataMbrCard.mbrCovers,
                cardCoverChoice:dataMbrCard.cardCoverChoice,
                h5BackImgUser:dataMbrCard.mbrCovers==1?dataMbrCard.originData.cardCoverChoice:''
            })
        }).catch(
            (err) => {
                console.log('err');
            }
        );

        // 商户信息
        OilstationInfoService.merchantGetInfo().then(data => {
            this.setState({
                merchantLogoPreview: data.logoUrl?data.logoUrl:'',
                merchantName: data.name?data.name:''
            });
        }).catch(err => {
            console.log(err)
        })

    }

    edit = ()=>{
        this.props.history.push('/main/member_center/member_card_setting/1')
    };

    detailCoupon = ()=>{
        const {giftCouponNumber} = this.state;
        this.props.history.push('/main/marketing_center/coupon_detail?' +
            'couponNumber='+giftCouponNumber+'&couponDetailScene=couponGift');
    };

    linkH5 = () => {
        // H5链接 merchantId，后期从redux中读取
        const {LoginUserInfo} = this.props;
        MemberCardService.linkQrcodeH5(LoginUserInfo.merchantId).then((res)=>{
            this.setState({
               H5LinkUrl:res
            })
        }).catch(
            (err) => {
                console.log('err');
            }
        );
        this.showModal('会员中心')
    };
    // H5链接模态框
    showModal = (title) => {
        this.setState({
            visible: true,
            modalTitle: title,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    renderGift() {
        let detailDatas = this.state.detailData;
        if(detailDatas.giftScore && detailDatas.giftCouponNumber){
            return (
                <span>
                    <span className="style-gift">{detailDatas.giftScore+'积分,'}</span>
                    <span className="style-gift" onClick={this.detailCoupon}>{detailDatas.giftCouponName}</span>
                </span>
            )
        }
        if(detailDatas.giftScore && !detailDatas.giftCouponNumber){
            return (
                <span className="style-gift">{detailDatas.giftScore+'积分'}</span>
            )
        }
        if(!detailDatas.giftScore && detailDatas.giftCouponNumber){
            return (
                <span className="style-gift" onClick={this.detailCoupon}>{detailDatas.giftCouponName}</span>
            )
        }
        if(!detailDatas.giftScore && !detailDatas.giftCouponNumber){
            return (
                <span className="style-gift">暂无赠送</span>
            )
        }
    }

    render() {
        // 手机端还是电脑端
        const {responsive,LoginUserInfo} = this.props;
        const {mbrCovers,cardCoverChoice,merchantLogoPreview,
            merchantName,h5BackImgUser,H5LinkUrl,detailData} = this.state;
        let detailDatas = this.state.detailData;
        // 默认会员卡封面
        let h5BackImgDefault = h5Back ;
        // 自定义会员卡封面时的遮罩层图片
        let h5MaskBackUser = maskBack;
        let h5BackImgUsers = h5BackImgUser;
        let mbrCover = mbrCovers;
        if(mbrCover==1){
            h5BackImgUsers = cardCoverChoice
        }
        // 默认和自定义封面的box-shadow
        const h5BaseHeader = classNames('h5-base-header',{'user-img-shadow':mbrCover==1},{'default-img-shadow':mbrCover==0});
        // 根据单选框的状态值调整预览显示的会员卡封面效果
        const styleH5Preview = {
            h5BackImgPreview:{
                backgroundImage:(mbrCover==1)?('url('+h5MaskBackUser+')'+','+'url('+h5BackImgUsers+')'):'url('+h5BackImgDefault+')'
            }
        };
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs:{span:24},
                md:{ span:6},
                lg:{ span:6},
            },
            wrapperCol: {
                xs:{span:24},
                md:{ span:16},
                lg:{ span:16},
            }
        };
        const headerBtnHtml = <Row gutter={0}>
            <Col>
                <Button onClick={this.linkH5} type="primary">链接/二维码</Button>
            </Col>
        </Row>;
        const headerBtnHtmlMbr = (
            <Row gutter={0}>
                <Col>
                    <Button onClick={this.edit} type="primary">编辑</Button>
                </Col>
            </Row>
        );
        return (
            <div className="base-edit base-detail">
                <Row gutter={16}>
                    <Col md={8} xs={24} className={responsive.data.isMobile?'mobile-preview common-mbr-preview':'computer-preview common-mbr-preview'} type="flex" align="middle" justify="center">
                        <div className="scrollable-container" ref={(node) => { this.container = node; }}>
                            {/*<Affix offsetTop={0} target={() => this.container}>*/}
                                <div>
                                    <div className="exhibition">
                                        <Panel panelHeader={true} panelFooter={false} title="会员卡预览" headerBtnHtml={headerBtnHtml}>
                                            <div className="h5-base">
                                                <div className={h5BaseHeader} style={styleH5Preview.h5BackImgPreview} >
                                                    <div className="merchant-container">
                                                        <div className="logo-show-container">
                                                            <img src={merchantLogoPreview} className="logo-show" alt=""/>
                                                        </div>
                                                        <div className="merchant-name">{merchantName}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*H5模态框*/}
                                            <Modal className="H5-container"
                                                   title={this.state.modalTitle}
                                                   visible={this.state.visible}
                                                   onCancel={this.handleCancel}
                                                   footer={null}
                                            >
                                                <H5Link url={H5LinkUrl}></H5Link>
                                            </Modal>
                                        </Panel>
                                    </div>
                                </div>
                            {/*</Affix>*/}
                        </div>
                    </Col>
                    <Col md={16} xs={24} className={responsive.data.isMobile?'mobile-set common-mbr-set':'computer-set common-mbr-set'}>
                      {/*  <DetailShowComplex headerHave={true} footerHave={false} titleName="会员卡基础设置" btnTitle={true} data ={this.state.dataMbrCardBasic} direction="vertical" showPosition="showLeft">
                            <div>
                                <Button onClick={this.edit} type="primary">编辑</Button>
                            </div>
                        </DetailShowComplex>*/}
                        <Panel panelHeader={true} panelFooter={false} title="会员卡基础设置" headerBtnHtml={headerBtnHtmlMbr}>
                            <WhiteSpace />
                            <Row type="flex" align="middle" justify="start" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" justify="start" className="row-col-container">
                                    <FormItem {...formItemLayout} label="油站logo:" className="upload-img-container-logo">
                                        {getFieldDecorator('mbrLogo')(
                                            <img src={merchantLogoPreview} className="gas-logo-show" alt=""/>
                                        )}
                                        <span className="gas-logo">
                                           如需修改，请前往<Link to='/main/oiltation_manage/oiltation_information_edit'>加油站信息</Link>更新，更新后将同步获取
                                        </span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="会员卡封面:" className="upload-img-container-logo">
                                        {getFieldDecorator('mbrCover')(
                                            <img src={detailDatas.cardCoverType==1?detailDatas.cardCoverChoice:'http://chuangjiangx-files.oss-cn-hangzhou.aliyuncs.com/image/729DA9BC-A1F5-4907-B646-06AF2E1FCF29.png'} className="gas-logo-show" alt=""/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="会员期限:" className="detail-common-form-item">
                                        {getFieldDecorator('validateTime')(
                                           <span>永久有效</span>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label='联系电话' className="detail-common-form-item">
                                        {getFieldDecorator('mobile')(
                                            <span>{detailDatas.contactNumber ? detailDatas.contactNumber : '--'}</span>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="会员特权说明:" className="detail-common-form-item">
                                        {getFieldDecorator('mbrPrivilege')(
                                            <label>{detailDatas.cardPrivilegeExplain ? detailDatas.cardPrivilegeExplain : '--'}</label>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="使用须知:" className="detail-common-form-item">
                                        {getFieldDecorator('mbrUseInstructions')(
                                            <span>{detailDatas.cardUseNotice ? detailDatas.cardUseNotice : '--'}</span>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Panel>
                        <WhiteSpace size="v-lg" />
                       {/* <div className="detail-get-card">
                            <DetailShowComplex labelClick={this.detailCoupon} headerHave={true} footerHave={false} titleName="会员卡领卡设置" data ={this.state.dataMbrCardGet} direction="vertical" showPosition="showLeft">
                            </DetailShowComplex>
                        </div>*/}

                        <Panel panelHeader={true} panelFooter={false} title="会员卡领卡设置">
                            <WhiteSpace />
                            <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label='领取方式' className="detail-common-form-item">
                                        {getFieldDecorator('receiveWay')(
                                            <span>免费激活领取</span>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label='领取赠送' className="detail-common-form-item">
                                        {getFieldDecorator('gifts',{
                                        })(
                                            <span>{this.renderGift()}</span>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Panel>

                    </Col>
                </Row>
            </div>
        )
    }
}
export default connect(
    state => {
        const {responsive} = state.AppData;
        const LoginUserInfo = state.LoginUserInfo;
        return {
            responsive,LoginUserInfo

        }
    },{receiveData}
)(Form.create()(MemberCardDetail));

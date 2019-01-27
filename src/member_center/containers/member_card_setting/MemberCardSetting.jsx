import React, {Component} from 'react';
import PropsType from 'prop-types';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import { Form,Row, Col, Input, Radio, Checkbox ,Modal, Button,Upload,Icon,message,Affix } from 'antd';
import classNames from 'classnames';
import { receiveData } from '@/base/redux/actions';

import BreadcrumbCustom from '@/common/components/breadcrumb/BreadcrumbCustom';
import Panel from '@/common/components/panel/Panel';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import UploadImg from "../member_card_setting/components/UploadImg";
import {UploadUrl} from '@/common/services/common/common.url';
import AddCoupon from '@/marketing_center/components/AddCoupon';

import h5Back from '@/member_center/assets/images/h5-preview.png';
import maskBack from '@/member_center/assets/images/h5-user-back.png';

import MemberCardService from '@/member_center/services/member_card_setting/member_card_setting.service';
import OilstationInfoService from '@/oiltation_manage/services/oiltation_information/oiltation_information.service';

import './member_card_setting.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

class MemberCardSetting extends Component {
    state = {
        title: '会员卡设置',
        cardCoverType:0,
        valueExpire:1,
        valueActivation:1,
        disabledPay: true,
        cardCoverChoice:'http://chuangjiangx-files.oss-cn-hangzhou.aliyuncs.com/image/729DA9BC-A1F5-4907-B646-06AF2E1FCF29.png',
        giftScore:'',
        giftCouponNumber:'',
        giftCouponId:'',
        giftScoreFlag:false,
        giftCouponFlag:false,
        // 详情数据
        detailData:{},
        // img
        loading: false,
        loadingMbr:false,
        h5BackImgUser:'',
        merchantLogoPreview:'',
        merchantName:'',
        top:10,
        // 赠送卡券弹出框显示变量
        visibleCoupon:false,
        visibleEditCoupon:false,
       // 是否添加过卡券
        addCouponFlag:false,
        // 卡券名称，首次是详情接口返回，如果编辑过需要调整
        giftCouponName:'',
    };
    componentWillMount() {
        const {receiveData} = this.props;
        const {pageIndex} = this.props.params;
        const breadcrumbdata = {
            title: '会员卡设置',
            routes: [
                {title: '会员中心'},
                {title: '会员卡设置', path: pageIndex?'/main/member_center/member_card_setting/'+pageIndex:
                    '/main/member_center/member_card_setting'
                }
            ],
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    }
    componentDidMount() {
        // 详情接口
        const {LoginUserInfo} = this.props;
        MemberCardService.detailMbrCard().then((dataMbrCard)=>{
            dataMbrCard.originData.cardUseNotice = dataMbrCard.originData.cardUseNotice.replace(/<br\/>/g, '\n');
            dataMbrCard.originData.cardPrivilegeExplain = dataMbrCard.originData.cardPrivilegeExplain.replace(/<br\/>/g, '\n');
            // 如果是详情页面跳到编辑页的就不做判断跳转
            if(this.props.params.pageIndex != 1){
                // 判断是否编辑过
                if(!!dataMbrCard.originData.cardPrivilegeExplain){
                    this.props.history.push('/main/member_center/member_card_detail');
                }else{
                    this.props.history.push('/main/member_center/member_card_setting');
                }
            }
            this.setState({
                mbrCovers:dataMbrCard.mbrCovers,
                cardCoverChoice:dataMbrCard.mbrCovers==1?dataMbrCard.cardCoverChoice:'http://chuangjiangx-files.oss-cn-hangzhou.aliyuncs.com/image/729DA9BC-A1F5-4907-B646-06AF2E1FCF29.png',
                detailData:dataMbrCard.originData,
                giftScoreFlag:dataMbrCard.originData.giftScore?true:false,
                giftCouponFlag:dataMbrCard.originData.giftCouponNumber?true:false,
                giftCouponNumber:dataMbrCard.originData.giftCouponNumber,
                giftCouponId:dataMbrCard.originData.giftCouponId,
                imageUrl:dataMbrCard.originData.gasLogo,
                giftCouponName:dataMbrCard.originData.giftCouponName,
                loading:false,
                imageUrlMbr:dataMbrCard.mbrCovers==1?dataMbrCard.originData.cardCoverChoice:'',
                loadingMbr:false,
                h5BackImgUser:dataMbrCard.mbrCovers==1?dataMbrCard.originData.cardCoverChoice:'',
                addCouponFlag:dataMbrCard.originData.giftCouponNumber?true:false
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
                merchantName:data.name?data.name:''
            });
        }).catch(err => {
            console.log(err)
        })
    }
    // 会员卡背景色radio切换
    onChangeBack = (e) => {
        this.setState({
            cardCoverType: e.target.value,
        });
    };
    onChangeGifts = (checkedValues)=>{
        // e是多选框选中的情况，数组形式
        const {detailData} = this.state;
        if(checkedValues.length==2){}else if(checkedValues.length==1){
            if(checkedValues[0]!=1){
                this.setState({
                    // giftsScore: '',
                    giftsScore:detailData.giftScore?detailData.giftScore:'',
                    giftScoreFlag:false
                });
                this.props.form.setFieldsValue({
                    // giftsScore: '',
                    giftsScore:detailData.giftScore?detailData.giftScore:'',
                });
            }
        }else{
            this.setState({
                // giftsScore: '',
                giftsScore:detailData.giftScore?detailData.giftScore:'',
                giftScoreFlag:false
            });
            this.props.form.setFieldsValue({
                // giftsScore: '',
                giftsScore:detailData.giftScore?detailData.giftScore:'',
            });
        }

    };

    // 新建卡券模态框
    addCoupon = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.showModalCoupon('添加卡券');
    };

    // 添加新建卡券模态框
    showModalCoupon = (title) => {
        this.setState({
            visibleCoupon: true,
            modalTitle: title,
        });
    };

    // 获取卡券弹框新建结果数据
    getCouponId = (result) => {
        // 卡券赠送页面回来时判断赠送的couponNumber
        let giftsParams = this.props.form.getFieldValue('gifts');
        if(giftsParams.length==2){
            this.setState({
                giftCouponFlag:true,
                giftCouponNumber:result.couponNumber,
                giftCouponId:result.id,
                giftCouponName:result.name,
                addCouponFlag:true
            });
        }else if(giftsParams.length == 1){
            if(giftsParams[0]==2){
                this.setState({
                    giftCouponFlag:true,
                    giftCouponNumber:result.couponNumber,
                    giftCouponId:result.id,
                    giftCouponName:result.name,
                    addCouponFlag:true,
                    giftScore:''
                },function(){
                });
            }else{
                this.setState({
                    giftCouponFlag:false,
                    giftCouponNumber:'',
                    giftCouponId:'',
                    addCouponFlag:false
                });
            }
        }else{
            this.setState({
                giftCouponFlag:false,
                giftCouponNumber:'',
                giftCouponId:'',
                addCouponFlag:false
            });
        }

    };

    // 回调函数关闭新建卡券模态框
    closeModalCoupon = () => {
        this.setState({
            visibleCoupon: false,
        });
    };

    // 编辑卡券模态框
    editCoupon = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.showModalEditCoupon('编辑卡券');
    };

    // 编辑卡券模态框
    showModalEditCoupon = (title) => {
        this.setState({
            visibleEditCoupon: true,
            modalTitle: title,
        });
    };

    // 获取卡券弹框编辑结果数据
    getEditCouponId = (result) => {
        // 卡券赠送页面回来时判断赠送的couponNumber
        let giftsParams = this.props.form.getFieldValue('gifts');
        if(giftsParams.length==2){
            this.setState({
                giftCouponFlag:true,
                giftCouponNumber:result.couponNumber,
                giftCouponId:result.id,
                giftCouponName:result.name
                // addCouponFlag:true
            });
        }else if(giftsParams.length == 1){
            if(giftsParams[0]==2){
                this.setState({
                    giftCouponFlag:true,
                    giftCouponNumber:result.couponNumber,
                    giftCouponId:result.id,
                    giftCouponName:result.name,
                    // addCouponFlag:true,
                    giftScore:''
                },function(){

                });
            }else{
                this.setState({
                    giftCouponFlag:false,
                    giftCouponNumber:'',
                    giftCouponId:'',
                    // addCouponFlag:false
                });
            }
        }else{
            this.setState({
                giftCouponFlag:false,
                giftCouponNumber:'',
                giftCouponId:'',
                // addCouponFlag:false
            });
        }

    };

    // 回调函数关闭模态框
    closeModalEditCoupon = () => {
        this.setState({
            visibleEditCoupon: false,
        });
    };

    beforeUpload = (file) => {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isImg) {
            message.error('图片格式不正确!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小需小于2MB!');
        }
        return isImg && isLt2M;
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // 得到返回结果
            this.setState({
                imageUrl:info.file.response.data.results[0].url,
                loading:false
            });
        }
    };

    beforeUploadMbr = (file) => {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isImg) {
            message.warning('图片格式不正确!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.warning('图片大小需小于2MB!');
        }
        return isImg && isLt2M;
    }

    handleChangeMbr = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingMbr: true });
            return;
        }
        if (info.file.status === 'done') {
            // 得到返回结果
            this.setState({
                imageUrlMbr:info.file.response.data.results[0].url,
                loadingMbr:false
            });
            // 判断是默认会员卡封面还是自定义
            if(this.state.cardCoverType == 1){
                this.setState({
                    h5BackImgUser:this.state.imageUrlMbr
                });
            }
        }
    };

    giftScoreInput = (e)=>{
        let giftsParam = this.props.form.getFieldValue('gifts');
        if(giftsParam.length==2){
            this.setState({
                giftScoreFlag:true,
                giftScore: e.target.value
            });
        }else if(giftsParam.length == 1){
            if(giftsParam[0]==1){
                this.setState({
                    giftScoreFlag:true,
                    giftScore: e.target.value,
                    giftCouponNumber:''
                });
            }else{
                this.setState({
                    giftScoreFlag:false,
                    giftScore:''
                });
            }
        }else{
            this.setState({
                giftScoreFlag:false,
                giftScore:''
            });
        }
    };
    // 提交保存按钮，区分是新增还是编辑，点击编辑按钮时带页面参数过来用于识别
    save = (e) => {
        e.preventDefault();
        const {cardCoverType, cardCoverChoice,giftScore,giftScoreFlag,
            giftCouponFlag,giftCouponNumber,imageUrl,imageUrlMbr} = this.state;
        const propsParam = this.props.form;
        this.props.form.validateFields((err, values) => {
            // pageIndex存在且为1时则为编辑页面，否则为设置新增页面
            if (!err) {
                if(this.props.params.pageIndex == 1){
                   // 编辑接口
                    MemberCardService.modifyMbrCard({
                        gasLogo:imageUrl?imageUrl:'',
                        cardCoverType:cardCoverType,
                        cardCoverChoice:cardCoverType==0?cardCoverChoice:imageUrlMbr,
                        contactNumber:propsParam.getFieldValue('mobile'),
                        cardPrivilegeExplain:propsParam.getFieldValue('mbrPrivilege'),
                        cardUseNotice:propsParam.getFieldValue('mbrUseInstructions'),
                        giftScore:giftScoreFlag?propsParam.getFieldValue('giftsScore'):'',
                        giftCouponNumber:giftCouponFlag?giftCouponNumber:''
                    }).then((res)=>{
                        // 跳转详情页面，后期更改为后台返回true再跳
                        message.success('编辑成功');
                        this.props.history.push('/main/member_center/member_card_detail');
                    }).catch(
                        (err) => {
                            console.log('err');
                        }
                    );

                }else{
                    // 新增接口
                    MemberCardService.saveMbrCard({
                        gasLogo:imageUrl?imageUrl:'',
                        cardCoverType:cardCoverType,
                        cardCoverChoice:cardCoverType==0?cardCoverChoice:imageUrlMbr,
                        contactNumber:propsParam.getFieldValue('mobile'),
                        cardPrivilegeExplain:propsParam.getFieldValue('mbrPrivilege'),
                        cardUseNotice:propsParam.getFieldValue('mbrUseInstructions'),
                        giftScore:giftScoreFlag?propsParam.getFieldValue('giftsScore'):'',
                        giftCouponNumber:giftCouponFlag?giftCouponNumber:''
                    }).then((res)=>{
                        // 跳转详情页面，后期更改为后台返回true再跳
                        message.success('会员卡设置成功');
                        this.props.history.push('/main/member_center/member_card_detail');
                    }).catch(
                        (err) => {
                            console.log('err');
                        }
                    );
                }

            }

        });
    };

    cancel = ()=>{
        var _self = this.props.history;
        if(this.props.params.pageIndex == 1){
            Modal.confirm({
                title: '提示',
                content: '确定放弃更改？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _self.push('/main/member_center/member_card_detail');
                },
                onCancel() {}
            });
        }else{
            // 清空输入框
            this.props.form.resetFields();
            this.setState({
                imageUrlMbr:'',
                imageUrl:'',
                loading:false,
                loadingMbr:false
            })
        }
    };

    render() {
        // 判断终端和左侧菜单栏合起-展开状态
        const {responsive,menu,LoginUserInfo} = this.props;
        const {giftScoreFlag,giftCouponFlag,cardCoverType,cardCoverChoice,
            h5BackImgUser,merchantLogoPreview,merchantName,detailData,
            addCouponFlag,giftCouponNumber,giftCouponId,giftCouponName,giftScoreInputDisabled
             } = this.state;
        let detailDatas = this.state.detailData;
        const mbrBtnContainer = classNames('mbr-btn-container',{'mbr-btn-container-collapse':menu.data.Collapsed});
        let params = this.props.form;
        const mbrPrivilegeStyle = classNames('inline-feedback-style', {'inline-feedback-pri-style':
                params.getFieldValue('mbrPrivilege') && params.getFieldValue('mbrPrivilege').length>9},
                {'inline-feedback-pri-style-99': params.getFieldValue('mbrPrivilege') &&
                params.getFieldValue('mbrPrivilege').length>99},{'inline-feedback-pri-style-999':
            params.getFieldValue('mbrPrivilege') && params.getFieldValue('mbrPrivilege').length>999});
        const useKnowsStyle = classNames('inline-feedback-style-knows', {'inline-feedback-style-knows-style':
        params.getFieldValue('mbrUseInstructions') && params.getFieldValue('mbrUseInstructions').length>9},{
            'inline-feedback-style-knows-style-99':
            params.getFieldValue('mbrUseInstructions') && params.getFieldValue('mbrUseInstructions').length>99
        });

        // 默认会员卡封面
        let h5BackImgDefault = h5Back ;
        // 自定义会员卡封面时的遮罩层图片
        let h5MaskBackUser = maskBack;
        // 下面测试为自定义会员卡封面,后期替换为获取的上传图片
        // let h5BackImgUser = "http://techuangjiangx-files.oss-cn-hangzhou.aliyuncs.com/1544581540944/20181212/h8ABa5M3.jpg"
        let h5BackImgUsers = h5BackImgUser;
        let mbrCover = this.props.form.getFieldValue('mbrCover');
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
        let formOptionalLabel = {
            'mobileOptionLabel' : (<span><span>联系电话</span><span className="optional-style">(选填)</span></span>),
            'wayOptionLabel' : (<span><span>领取方式</span><span className="optional-style">(选填)</span></span>),
            'giftOptionLabel' : (<span><span>领取赠送</span><span className="optional-style">(选填)</span></span>)
        };

        const imageUrl = this.state.imageUrl;
        const imageUrlMbr = this.state.imageUrlMbr;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">点击上传</div>
            </div>
        );
        const uploadButtonMbr = (
            <div>
                <Icon type={this.state.loadingMbr ? 'loading' : 'plus'} />
                <div className="ant-upload-text">点击上传</div>
            </div>
        );

        return (
            <div className="base-edit">
                <Row gutter={16}>
                    <Col md={8} xs={24} className={responsive.data.isMobile?'mobile-preview common-mbr-preview':'computer-preview common-mbr-preview'}>
                        <div className="scrollable-container" ref={(node) => { this.container = node; }}>
                            {/*<Affix offsetTop={0} target={() => this.container}>*/}
                            <div>
                                <div className="exhibition">
                                    <Panel panelHeader={true} panelFooter={false} title="会员卡预览">
                                        {/*<Row gutter={16} type="flex" justify="center" >*/}
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
                                        {/*</Row>*/}
                                    </Panel>
                                </div>
                            </div>
                            {/*</Affix>*/}
                        </div>
                    </Col>
                    <Col md={16} xs={24} className={responsive.data.isMobile?'mobile-set common-mbr-set':'computer-set common-mbr-set'}>
                        <div className="">
                            <div>
                              <Form onSubmit={this.save}>
                                <Panel panelHeader={true} panelFooter={false} title="会员卡基础设置">
                                    <WhiteSpace />
                                    <Row type="flex" align="middle" justify="start" className="row-spacing">
                                        <Col md={24} xs={24} type="flex" align="middle" justify="start" className="row-col-container">
                                           {/* <FormItem {...formItemLayout} label="油站logo:" className="upload-img-container-logo">
                                                {getFieldDecorator('mbrLogo',{
                                                    rules: [{ required: true, message: '请上传油站logo!'}],
                                                    initialValue: detailDatas.gasLogo ? detailDatas.gasLogo : null
                                                })(
                                                    <Upload
                                                        name="files"
                                                        listType="picture-card"
                                                        className="avatar-uploader"
                                                        showUploadList={false}
                                                        action={UploadUrl}
                                                        beforeUpload={this.beforeUpload}
                                                        onChange={this.handleChange}
                                                    >
                                                        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                                                    </Upload>
                                                )}
                                            </FormItem>*/}
                                            <FormItem {...formItemLayout} label="油站logo:" className="upload-img-container-logo">
                                                {getFieldDecorator('mbrLogo',{
                                                    // rules: [{ required: true, message: '请上传油站logo!'}],
                                                    // initialValue: detailDatas.gasLogo ? detailDatas.gasLogo : null
                                                })(
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
                                            <FormItem {...formItemLayout} label="会员卡封面:">
                                                {getFieldDecorator('mbrCover',{
                                                    initialValue: detailDatas.cardCoverType ? Number(detailDatas.cardCoverType) : 0
                                                }, {
                                                    rules: [{ required: true, message: '请上传会员卡封面' }],
                                                })(
                                                    <RadioGroup onChange={this.onChangeBack}>
                                                        <div><Radio value={0}>默认图片</Radio></div>
                                                        <WhiteSpace size="v-md"></WhiteSpace>
                                                        <div>
                                                            <Radio value={1}>自定义图片</Radio>
                                                            <FormItem {...formItemLayout} label="" className="upload-img-container">
                                                                {getFieldDecorator('userMbrBack',{
                                                                    rules: [{ required: cardCoverType==1?true:false, message: '请上传会员卡封面'}],
                                                                    initialValue: cardCoverType==1 ? imageUrlMbr : null
                                                                })(
                                                                    <Upload
                                                                        name="files"
                                                                        listType="picture-card"
                                                                        className="avatar-uploader"
                                                                        showUploadList={false}
                                                                        action={UploadUrl}
                                                                        beforeUpload={this.beforeUploadMbr}
                                                                        onChange={this.handleChangeMbr}
                                                                        disabled={cardCoverType==0?true:false}>
                                                                        {imageUrlMbr ? <img src={imageUrlMbr} alt="avatar" /> : uploadButtonMbr}
                                                                    </Upload>
                                                                )}
                                                            </FormItem>
                                                        </div>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                        <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                            <FormItem {...formItemLayout} label="会员期限:">
                                                {getFieldDecorator('validateTime',{
                                                    initialValue:1
                                                })(
                                                    <RadioGroup setFieldsValue={this.state.valueExpire}>
                                                        <div><Radio value={1}>永久有效</Radio></div>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                        <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                            <FormItem {...formItemLayout} label={formOptionalLabel.mobileOptionLabel}>
                                                {getFieldDecorator('mobile',{
                                                    rules: [
                                                        {pattern:/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/, message: '联系电话格式不正确!'},
                                                        {max:24, message: '联系电话长度不能超过24位'}
                                                    ],
                                                    initialValue: detailDatas.contactNumber ? detailDatas.contactNumber : ''
                                                })(
                                                    <Input placeholder="请输入商户的联系电话" type="number" autoComplete="off" className="field-width-limit" />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                        <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                            <FormItem {...formItemLayout} label="会员特权说明:" className={mbrPrivilegeStyle}>
                                                {getFieldDecorator('mbrPrivilege', {
                                                    rules: [{ required: true, message: '请输入会员特权说明'}],
                                                    initialValue: detailDatas.cardPrivilegeExplain ? detailDatas.cardPrivilegeExplain : ''
                                                })(
                                                    <TextArea md={10} maxLength={1024} placeholder="建议填写会员权益等信息" rows={4} className="field-width-limit field-tip-align" />
                                                )}
                                                <span className="field-tip-align">
                                                    <span>{this.props.form.getFieldValue('mbrPrivilege') && this.props.form.getFieldValue('mbrPrivilege').length?this.props.form.getFieldValue('mbrPrivilege').length:'0'}</span>
                                                    <span>/1024</span>
                                                </span>
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                        <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                            <FormItem {...formItemLayout} label="使用须知:" className={useKnowsStyle}>
                                                {getFieldDecorator('mbrUseInstructions', {
                                                    rules: [{ required: true, message: '请输入使用须知'}],
                                                    initialValue: detailDatas.cardUseNotice ? detailDatas.cardUseNotice : ''
                                                })(
                                                    <TextArea placeholder="建议填写会员使用须知" maxLength={512} rows={4} className="field-width-limit field-tip-align" />
                                                )}
                                                <span className="field-tip-align">
                                                    <span>{this.props.form.getFieldValue('mbrUseInstructions') && this.props.form.getFieldValue('mbrUseInstructions').length?this.props.form.getFieldValue('mbrUseInstructions').length:'0'}</span>
                                                    <span>/512</span>
                                                </span>
                                            </FormItem>

                                        </Col>
                                    </Row>
                                </Panel>
                                <WhiteSpace size="v-lg" />
                                <Panel panelHeader={true} panelFooter={false} title="会员卡领卡设置">
                                    <WhiteSpace />
                                    <Row gutter={{ xs: 8, md: 24, lg: 32 }}  type="flex" align="middle" className="row-spacing">
                                        <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                            <FormItem {...formItemLayout} label={formOptionalLabel.wayOptionLabel}>
                                                {getFieldDecorator('receiveWay',{
                                                    initialValue:1
                                                }, {
                                                    rules: [{ required: true, message: '请选择领取方式' }],
                                                })(
                                                    <RadioGroup setFieldsValue={this.state.valueActivation}>
                                                        <Radio value={1}>免费激活领取</Radio>
                                                        <Radio value={2} disabled={this.state.disabledPay}>付费领取(暂未开放)</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={{ xs: 8, md: 24, lg: 32 }} type="flex" align="middle" className="row-spacing">
                                        <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                            <FormItem {...formItemLayout} label={formOptionalLabel.giftOptionLabel}>
                                                {getFieldDecorator('gifts',{
                                                    initialValue: (detailData.giftScore && detailData.giftCouponNumber)?
                                                        ['1','2']:detailData.giftScore?['1']:detailData.giftCouponNumber?['2']:[]
                                                })(
                                                    <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeGifts}>
                                                        <div>
                                                            <Checkbox value="1">赠送积分</Checkbox>
                                                            <FormItem {...formItemLayout} label="" className="score-form-item">
                                                                {getFieldDecorator('giftsScore',{
                                                                    rules: [
                                                                        {pattern:/^(?!0+(\.0*)?$)\d{0,4}$/, message: '赠送积分格式不正确'},
                                                                    ],
                                                                    initialValue: detailDatas.giftScore ? detailDatas.giftScore : ''
                                                                })(
                                                                    <Input disabled={(params.getFieldValue('gifts') &&
                                                                        params.getFieldValue('gifts').length &&
                                                                        params.getFieldValue('gifts').length == 1 &&
                                                                        params.getFieldValue('gifts')[0] == 1 )?false:
                                                                        (params.getFieldValue('gifts') &&
                                                                            params.getFieldValue('gifts').length
                                                                            && params.getFieldValue('gifts').length == 2
                                                                            && (params.getFieldValue('gifts')[0] == 1
                                                                                ||params.getFieldValue('gifts')[1] == 1)
                                                                        )?false:true}
                                                                           onChange={this.giftScoreInput} autoComplete="off" maxLength={4}
                                                                           className="mbr-card-gift-score" placeholder="请输入"/>
                                                                )}
                                                            </FormItem>
                                                            <span className="score-span">积分</span>
                                                        </div>
                                                        <WhiteSpace size="v-md"></WhiteSpace>
                                                        <div>
                                                            <Checkbox value="2">赠送卡券</Checkbox>
                                                            {!addCouponFlag && (
                                                                <Button onClick={this.addCoupon} type="primary"
                                                                        disabled={(params.getFieldValue('gifts')
                                                                            && params.getFieldValue('gifts').length &&
                                                                            params.getFieldValue('gifts').length == 1 &&
                                                                            params.getFieldValue('gifts')[0] == 2 )?false:
                                                                            (params.getFieldValue('gifts') &&
                                                                                params.getFieldValue('gifts').length &&
                                                                                params.getFieldValue('gifts').length == 2 &&
                                                                                (params.getFieldValue('gifts')[0] == 2||
                                                                                    params.getFieldValue('gifts')[1] == 2) )
                                                                                ?false:true}>
                                                                    + 新建卡券
                                                                </Button>)}
                                                            {addCouponFlag && (
                                                                <Button onClick={this.editCoupon} disabled={(params.getFieldValue('gifts')
                                                                    && params.getFieldValue('gifts').length &&
                                                                    params.getFieldValue('gifts').length == 1 &&
                                                                    params.getFieldValue('gifts')[0] == 2 )?false:
                                                                    (params.getFieldValue('gifts') &&
                                                                        params.getFieldValue('gifts').length &&
                                                                        params.getFieldValue('gifts').length == 2 &&
                                                                        (params.getFieldValue('gifts')[0] == 2||
                                                                            params.getFieldValue('gifts')[1] == 2) )
                                                                        ?false:true}
                                                                        type="primary">{giftCouponName}</Button>
                                                            )}

                                                        </div>
                                                    </Checkbox.Group>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Panel>
                                <WhiteSpace size="v-lg" />
                            </Form>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row md={24} xs={24} type="flex" justify="center" align="middle" className={mbrBtnContainer}>
                    <Button className="btn-fixed" onClick={this.cancel} type="default">取消</Button>
                    <Button className="btn-fixed" onClick={this.save} type="primary" htmlType="submit">提交</Button>
                </Row>

                {/*赠送卡券新建模态框*/}
                <Modal
                    wrapClassName = "add-coupon-modal"
                    title="添加卡券"
                    visible={this.state.visibleCoupon}
                    footer={null}
                    onCancel={this.closeModalCoupon}
                    destroyOnClose={true}
                >
                    <AddCoupon ref='couponForm' couponScene={1} promoteType={3} couponSource="modalSource"
                               getCouponId={this.getCouponId} closeModalCoupon={this.closeModalCoupon} />
                </Modal>

                {/*赠送卡券编辑模态框*/}
                <Modal
                    wrapClassName = "add-coupon-modal"
                    title="编辑卡券"
                    visible={this.state.visibleEditCoupon}
                    footer={null}
                    onCancel={this.closeModalEditCoupon}
                    destroyOnClose={true}
                >
                    <AddCoupon ref='couponForm' couponScene={2} promoteType={3} couponSource="modalSource"
                               couponNumber={giftCouponNumber} couponId={giftCouponId}
                               getCouponId={this.getEditCouponId} closeModalCoupon={this.closeModalEditCoupon} />
                </Modal>

            </div>
        )
    }
}

export default connect(
    state => {
        const {responsive, menu} = state.AppData;
        const LoginUserInfo = state.LoginUserInfo;
        return {
            responsive,
            menu,
            LoginUserInfo
        }
    },
    {receiveData}
)(Form.create()(MemberCardSetting));

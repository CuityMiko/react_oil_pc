/**
 * 新增-编辑-复制-代金券-业务组件，某个字段是否存在以props属性控制，业务组件中会调用service
 * 新增卡券组件支持以页面路由形式调用(取参this.props.query中获取，路由跳转时以？形式拼接参数)和组件形式调用(props传参)，
 * 必传参数：
 * couponSource-调用组件的来源，页面形式-还是弹窗形式(可选值modalSource、pageSource)
 * couponScene-1表示新增卡券，2表示编辑卡券，3表示复制卡券
 * couponNumber-卡券number，用于获取详情
 * couponId-卡券id，用于编辑传参
 * getCouponId-couponSource为modalSource时获取卡券信息的回调函数
 * closeModalCoupon-couponSource为modalSource时关闭卡券弹出框的回调函数,
 * promoteType-推广类型，modal形式传参，数值，3-领卡赠券，4-充值赠送，5-支付后赠送
 * 调用方法：
 * (1)页面路由跳转形式couponSource=pageSource默认值，页面形式可以不传此参数
 *  新增--  this.props.history.push('/main/marketing_center/coupon_operate?couponScene=1')
 *  编辑-- this.props.history.push('/main/marketing_center/coupon_operate?couponScene=2
 *  &couponNumber='+couponNumber+'&couponId='+couponId)
 *  复制--   this.props.history.push('/main/marketing_center/coupon_operate?couponScene=3&couponNumber='
    +couponNumber+'&couponId='+id+'&couponSource=pageSource');
 * (2)模态框形式
 * 新增-- <AddCoupon ref='couponForm' couponScene={1} couponSource="modalSource"
   getCouponId={this.getCouponId} closeModalCoupon={this.closeModalCoupon} />
   编辑--<AddCoupon ref='couponForm' couponScene={2} couponNumber={9999} couponId={39} couponSource="modalSource"
 getCouponId={this.getCouponId} closeModalCoupon={this.closeModalCoupon} />
   复制--<AddCoupon ref='couponForm' couponScene={3} couponNumber={9999} couponId={39} couponSource="modalSource"
 getCouponId={this.getCouponId} closeModalCoupon={this.closeModalCoupon} />
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from 'moment';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Radio,
    Checkbox,
    DatePicker,
    Row,
    message,
    Icon,
    Col,
    Upload,
    Button,
    Switch,
    TreeSelect,
    Modal
} from 'antd';

import {receiveData} from '@/base/redux/actions';
import WhiteSpace from '@/common/components/white_space/WhiteSpace';
import Panel from '@/common/components/panel/Panel';
import {UploadUrl} from '@/common/services/common/common.url';
import QrcodeDownload from '@/common/components/qrcodedownload/QrcodeDownload';

import CouponService from '@/marketing_center/services/card_ticket/card_ticket.service';
import OilService from '@/oil_manage/services/oil_manage.service';

import './add_coupon.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const dateFormat = 'YYYY.MM.DD';

class AddCoupon extends Component {
    // 定义数据类型
    static propTypes = {
        // 卡券适用场景，默认1，
        // 1表示新增卡券，2表示编辑卡券，3表示复制卡券，
        couponScene: PropTypes.oneOf([1,2,3]),
        // 卡券number，用于获取详情
        couponNumber:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        // 卡券id，用于编辑传参
        couponId:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        // 弹窗形式调用时候的回调函数,拿到新增成功后的数据
        getCouponId: PropTypes.func,
        // 弹窗形式，关闭卡券组件modal的回调函数，关闭modal
        closeModalCoupon:PropTypes.func,
        promoteType:PropTypes.number,
        // 调用组件的来源，页面形式-还是弹窗形式
        couponSource:PropTypes.oneOf(['modalSource','pageSource']),
        rechargeRuleType:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])
    };

    // 定义默认值
    static defaultProps = {
        // DataCard组件属性
        couponScene: 1,
        couponNumber:'',
        couponId:'',
        couponSource:'pageSource',
        promoteType:1,
        status:'',
        rechargeRuleType:''
    };

    // 状态参数
    state = {
        title: '卡券营销',
        pageNo: 1,
        pageSize: 20,
        valueActivation: 1,
        // 单选框后的表单的必填标志
        // 卡券使用期限1立即生效
        usedTimeDaysFlag:true,
        // 卡券使用期限2固定时间
        usedTimeFixedFlag:false,
        // 发放总量
        limitInventoryFlag:false,
        // 最低消费
        minConsumeFlag:false,
        // 每位用户限领标志
        minGetFlag:false,
        // 固定时间值
        fixedTime:[],
        // 投放时间值
        putInTime:[],
        // 适用油品数据
        dataOil: [],
        originData:[],
        imageUrl:'',
        loading:false,
        valueOils:[],
        // 从详情中获取couponId，用于其他模块后台没有给卡券id的情况
        couponIdFromDetail:'',
        // 下载二维码组件参数
        showDowload: false,
        dowloadUrl: '',
        codeName: ''

    };
    componentWillMount() {
      this.initBreadcrum()
    }

    componentDidMount() {
        // 获取组件识别所需参数
        const dataParam = this.getParamsValue();
        // 适用油品列表接口，参数proCategoryId，行业id 石油行业是1，暂时传死
        OilService.merchantOilList(sessionStorage.getItem('oilCategoryId')).then((res)=>{
            this.setState({
                dataOil: res
            });
        }).catch((result) => {
           console.log(result)
        });

       // 卡券详情-编辑2-复制3---页面-弹出框
        if(dataParam.couponSceneValue == 2 || dataParam.couponSceneValue ==3){
            if(dataParam.couponIdValue){
                CouponService.detailCouponId(dataParam.couponIdValue).then((res)=>{
                    // 将适用油品处理成id的字符串数组形式，用于编辑初始化显示
                    let oils = [];
                    res.originData.skus.map(item => {
                        // 防止id为null的情况，阻止继续执行
                        if(item.id!=null){
                            oils.push((item.id).toString())
                        }
                    });
                    this.setState({
                        originData:res.originData,
                        imageUrl:res.originData.logo,
                        usedTimeDaysFlag:res.originData.dateType==1?true:false,
                        usedTimeFixedFlag:res.originData.dateType==0?true:false,
                        limitInventoryFlag:res.originData.totalInventory!=99999?true:false,
                        minConsumeFlag:res.originData.leastCost!=0?true:false,
                        minGetFlag:res.originData.getLimit!=99999?true:false,
                        valueOils:oils,
                        couponIdFromDetail:res.originData.id
                    })
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                );
            }else if(dataParam.couponNumberValue){
                CouponService.detailCoupon(dataParam.couponNumberValue).then((res)=>{
                    // 将适用油品处理成id的字符串数组形式，用于编辑初始化显示
                    let oils = [];
                    res.originData.skus.map(item => {
                        // 防止id为null的情况，阻止继续执行
                        if(item.id!=null){
                            oils.push((item.id).toString())
                        }
                    });
                    this.setState({
                        originData:res.originData,
                        imageUrl:res.originData.logo,
                        usedTimeDaysFlag:res.originData.dateType==1?true:false,
                        usedTimeFixedFlag:res.originData.dateType==0?true:false,
                        limitInventoryFlag:res.originData.totalInventory!=99999?true:false,
                        minConsumeFlag:res.originData.leastCost!=0?true:false,
                        minGetFlag:res.originData.getLimit!=99999?true:false,
                        valueOils:oils,
                        couponIdFromDetail:res.originData.id
                    })
                }).catch(
                    (err) => {
                        console.log('err');
                    }
                );
            }


        }

        // 一开始就让按钮不能点击，表单验证
        // this.props.form.validateFields();

    }

    initBreadcrum = () => {
        // 获取组件识别所需参数
        const dataParam = this.getParamsValue();
        // console.log(dataParam,'00-0--00')
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '新增代金券',
            routes: [
                {title: '营销中心', path: ''},
                {title: '卡券营销', path: '/main/marketing_center/card_ticket'},
                // {title: '新增代金券', path: '/main/marketing_center/coupon_operate'}
                 {title: '新增代金券', path: '/main/marketing_center/coupon_operate'+
                   '?couponScene='+dataParam.couponSceneValue+'&couponNumber='+dataParam.couponNumberValue+'&couponId='+
                 dataParam.couponIdValue+'&couponSource='+dataParam.couponSourceValue
                 }
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    };

    // 判断参数来源及取值
    getParamsValue = () => {
        const {couponNumber,couponId,couponScene,couponSource,promoteType,status} = this.props;
        // 场景值，可能来源于组件调用props传参，也可能来源于页面路由跳转传参
        let couponSceneValue;
        if(this.props.query && this.props.query.couponScene){
            couponSceneValue = ((couponScene == (this.props.query && this.props.query.couponScene))
                ? couponScene : this.props.query.couponScene);
        }else{
            couponSceneValue = couponScene;
        }
        // 卡券number值，可能来源于组件调用props传参，也可能来源于页面路由跳转传参
        let couponNumberValue;
        if(this.props.query && this.props.query.couponNumber){
            couponNumberValue = ((couponNumber == (this.props.query && this.props.query.couponNumber))
                ? couponNumber : this.props.query.couponNumber);
        }else{
            couponNumberValue = couponNumber;
        }
        // 卡券id值，可能来源于组件调用props传参，也可能来源于页面路由跳转传参
        let couponIdValue;
        if(this.props.query && this.props.query.couponId){
            couponIdValue = ((couponId == (this.props.query && this.props.query.couponId))
                ? couponId : this.props.query.couponId);
        }else{
            couponIdValue = couponId;
        }

        // 卡券id值，可能来源于组件调用props传参，也可能来源于页面路由跳转传参
        let couponSourceValue;
        if(this.props.query && this.props.query.couponSource){
            couponSourceValue = ((couponSource == (this.props.query && this.props.query.couponSource))
                ? couponSource : this.props.query.couponSource);
        }else{
            couponSourceValue = couponSource;
        }

        // 推广渠道，1-卡券广场，2-二维码推广，3-领卡赠券，4-充值赠送，5-支付后赠送三种
        let promoteTypeValue;
        if(this.props.query && this.props.query.promoteType){
            promoteTypeValue = ((promoteType == (this.props.query && this.props.query.promoteType))
                ? promoteType : this.props.query.promoteType);
        }else{
            promoteTypeValue = promoteType;
        }

        // 卡券状态，可能来源于组件调用props传参，也可能来源于页面路由跳转传参
        let couponStatusValue;
        if(this.props.query && this.props.query.status){
            couponStatusValue = ((status == (this.props.query && this.props.query.status))
                ? status : this.props.query.status);
        }else{
            couponStatusValue = status;
        }

        // 把该组件需要的参数提取出放到data对象里，方便其他地方读取
        let data = {
            couponSceneValue:couponSceneValue,
            couponNumberValue:couponNumberValue,
            couponIdValue:couponIdValue,
            couponSourceValue:couponSourceValue,
            promoteTypeValue:promoteTypeValue,
            couponStatusValue:couponStatusValue
        };
        return data;

    };

    // 上传图片前的判断
    beforeUpload = (file) => {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isImg) {
            message.error('图片格式不正确!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isImg && isLt2M;
    };
    // 上传图片
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // 得到返回结果
            this.setState({
                imageUrl: info.file.response.data.results[0].url,
                loading: false
            });

        }
    };
    // 适用油品级联变动
    onChange = (value) => {};

    //过期提醒
    onChangeTip = (value)=>{};
    // 卡券使用期限
    onChangeCouponUsedTime = (e) => {
        // 0-固定时间 1-领取立即生效
        if (e.target.value == 0) {
            this.setState({
                usedTimeDaysFlag: false,
                usedTimeFixedFlag: true
            }, () => {
                this.props.form.resetFields('days');
                this.props.form.setFieldsValue({
                    'days':''
                });
                this.props.form.resetFields('time');
            });
        }else {
            this.setState({
                usedTimeDaysFlag: true,
                usedTimeFixedFlag: false
            }, () => {
                this.props.form.resetFields('days');
                this.props.form.resetFields('time');
                this.props.form.setFieldsValue({
                    'time':''
                });
            });
        }
    };

    // 发放总量
    onChangeCouponTotal = (e) => {
        if (e.target.value == 2) {
            this.setState({
                limitInventoryFlag: true
            }, () => {
                this.props.form.resetFields('totalInventory');
            });
        }else {
            this.setState({
                limitInventoryFlag: false
            }, () => {
                this.props.form.resetFields('totalInventory');
                this.props.form.setFieldsValue({
                    'totalInventory':''
                });
            });
        }
    };

    // 投放渠道
    onChangeCouponScene = (e) => {};

    //  最低消费
    onChangeMinConsume = (e) => {
        if (e.target.value == 2) {
            this.setState({
                minConsumeFlag: true
            }, () => {
                this.props.form.resetFields('minConsume');
            });
        }else {
            this.setState({
                minConsumeFlag: false
            }, () => {
                this.props.form.resetFields('minConsume');
                this.props.form.setFieldsValue({
                    'minConsume':''
                });
            });
        }
    };

    // 每位用户限领
    onChangeLimitGet = (e) => {
        if (e.target.value == 2) {
            this.setState({
                minGetFlag: true
            }, () => {
                this.props.form.resetFields('minGet');
            });
        }else {
            this.setState({
                minGetFlag: false
            }, () => {
                this.props.form.resetFields('minGet');
                this.props.form.setFieldsValue({
                    'minGet':''
                });
            });
        }
    };

    // 投放时间日期选择框禁用情况,今天之前日期禁用
    disabledDate = (current)=>{
        return current && current < moment().startOf('day') ;
        // return current && current < moment().endOf('day');
    };

    // 投放时间段
    onChangePutInTime = (value, dateString)=>{
        this.setState({
            putInTime: dateString
        });
    };
    // 固定时间
    onChangeFixedTime = (value, dateString)=>{
        this.setState({
            fixedTime: dateString
        });
    };

    // 取消事件
    cancel = () => {
        // 获取组件识别所需参数
        const dataParam = this.getParamsValue();
        const {closeModalCoupon} = this.props;
        var _self = this.props.history;
        Modal.confirm({
            title: '提示',
            content: '确定返回？将不保留已输入的内容',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                // 取消事件根据场景来源决定返回哪里，目前只牵涉到详情到编辑点取消返回编辑，
                // 卡券列表新建或复制点取消返回卡券列表，其他赠券返回情况后期写到再补充
                // 点击取消先判断是页面还是弹窗，页面哪里来回哪里去，弹窗直接关闭模态框
                if(dataParam.couponSourceValue=='pageSource'){
                    if(dataParam.couponSceneValue ==1 || dataParam.couponSceneValue ==3){
                        _self.push('/main/marketing_center/card_ticket');
                    }else if(dataParam.couponSceneValue == 2){
                        _self.push('/main/marketing_center/coupon_detail?couponNumber='+
                            dataParam.couponNumberValue+'&couponId='+dataParam.couponIdValue);
                    }
                }else if(dataParam.couponSourceValue=='modalSource'){
                    closeModalCoupon();
                }

            },
            onCancel() {
            }
        });

    };

    hasErrors = (fieldsError) =>{
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    // 提交保存按钮，区分是新增-编辑-复制-新建卡券还是其他方式赠券，带页面参数过来用于识别
    save = (e) => {
        e.preventDefault();
        const {imageUrl,dataOil,couponIdFromDetail } = this.state;
        const {getCouponId,closeModalCoupon} = this.props;
        const propsParam = this.props.form;
        // 获取组件识别所需参数
        const dataParam = this.getParamsValue();
        // this.props.form.clearValidate();
        this.props.form.validateFields((err, values) => {
            let suitedOil;
            // 适用油品选择情况处理，需要将大类的id转换为小类id进行拼接
            if(values.suitedOil && values.suitedOil.length>0){
                let _result = [];
                values.suitedOil.map(v => {
                    let _data = dataOil.find(c => c.id == v);
                    if (_data != null) {
                        _result += _data.goodsIdNames.map(c=>c.skuId).join(',') + ',';
                    } else {
                        _result += v + ',';
                    }
                });
                suitedOil = _result.substring(0, _result.lastIndexOf(','));
            }

            // 卡券使用期限和投放时间比较
            // 使用期限
            if(values && values.validUsedTime==0 && values.time){
                if(moment(values.time[0]).valueOf() >= moment(values.time[1]).valueOf()){
                    message.warning("卡券使用结束日期不能小于等于开始日期");
                    return ;
                }
                if(values.putInTime){
                    if(new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime()
                        < new Date((moment(Number(values.putInTime[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime()){
                        message.warning("卡券使用开始时间不能早于投放开始时间");
                        return ;
                    }
                    if(new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime()
                        < new Date((moment(Number(values.putInTime[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00')){
                        message.warning("卡券使用结束时间不能晚于投放结束时间");
                        return ;
                    }
                }
            }
            // 投放时间
            if(values && values.putInTime){
                if(moment(values.putInTime[0]).valueOf() >= moment(values.putInTime[1]).valueOf()){
                    message.warning("投放结束日期不能小于等于开始日期");
                    return ;
                }
            }

            // 根据页面还是弹窗形式，处理下面字段
            let totalInventoryUser,timePutStartUser,timePutEndUser,scenePutUser,limitGetUser;
            if(dataParam.couponSourceValue=='pageSource'){
               // 页面来源有下面4个字段处理
               // 发放总量
                totalInventoryUser = values.putInTotal==1?99999:Number(propsParam.getFieldValue('totalInventory'));
               // 投放时间段
               //  timePutStartUser = values.putInTime[0] ? moment(values.putInTime[0]).valueOf() : '';
               //  timePutEndUser = values.putInTime[1] ? moment(values.putInTime[1]).valueOf() : '';
                timePutStartUser = values.putInTime[0] ? new Date((moment(Number(values.putInTime[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime() : '';
                timePutEndUser = values.putInTime[1] ? new Date((moment(Number(values.putInTime[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime() : '';
               // 投放渠道
                scenePutUser = values.wayPutIn;
               // 每位用户限领
                limitGetUser = values.minGetType==1?99999:Number(propsParam.getFieldValue('minGet'));
            }else if(dataParam.couponSourceValue=='modalSource'){
                // 弹窗来源的下面4个字段的对应处理，页面上没有这些字段，但需要给后台相应字段
                // 发放总量
                totalInventoryUser = '99999';
                // 投放时间段
                timePutStartUser = '';
                timePutEndUser = '';
                // 投放渠道
                scenePutUser = dataParam.promoteTypeValue;
                // 每位用户限领
                limitGetUser = '99999';
            }
            if (!err) {
                if(dataParam.couponSourceValue=='pageSource'){
                // 页面级别的请求处理
                    //1表示新增卡券，2表示编辑卡券，3表示复制卡券
                    if (dataParam.couponSceneValue == 1 ||dataParam.couponSceneValue==3 ) {
                        // 新建-复制-CouponService
                        CouponService.addCoupon({
                            // 卡券类型-代金券
                            type: 1,
                            // 卡券名称
                            name: values.couponName,
                            // 卡券面值
                            amount: Number(values.couponAmount),
                            // 卡券logo
                            logo: imageUrl?imageUrl:'',
                            // 卡券使用期限'0固定时间 1立即生效,类型之后的传参参数呢？'
                            dateType: Number(values.validUsedTime),
                            fixedTerm: values.validUsedTime==1?Number(propsParam.getFieldValue('days')):'',
                            // useTimeBegin:values.validUsedTime==0?moment(values.time[0]).valueOf():'',
                            // useTimeEnd: values.validUsedTime==0?moment(values.time[1]).valueOf():'',
                            useTimeBegin:values.validUsedTime==0?new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime():'',
                            useTimeEnd: values.validUsedTime==0?new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime():'',
                            // 适用油品-卡种id-关联商品，逗号拼接字符串,暂时写死
                            productSkuId: suitedOil,
                            // 发放总量-不限制传99999
                            totalInventory: totalInventoryUser,
                            availInventory:totalInventoryUser,
                            // 卡券投放时间段
                            actTimeStart: timePutStartUser,
                            actTimeEnd: timePutEndUser,
                            // 卡券说明
                            remark: values.couponExplain,
                            // 投放渠道'1-卡券广场，2-二维码推广'
                            promoteType:scenePutUser,
                            // 最低消费'不限制为0'
                            leastCost:values.minConsumeType==1?0:Number(propsParam.getFieldValue('minConsume')) ,
                            // 适用时段，参数不定
                            useTimeHour: "00:00-23:59",
                            useTimeWeek: '1,2,3,4,5,6,7',
                            // 每位用户限领'不限制传99999'
                            getLimit:limitGetUser,
                            // 过期提醒，字段未定
                            invalidTip:values.invalidTip==1?'1':'0'
                        }).then((res) => {
                            // 页面级别的新增-复制-跳过来，新建成功，跳转回卡券列表页面
                            if (dataParam.couponSceneValue == 1 || dataParam.couponSceneValue == 3){
                                if(dataParam.couponSceneValue == 1){
                                    message.success('新增卡券成功');
                                    if(scenePutUser==2){
                                        const {dowloadUrl} = this.state;
                                        // 推广二维码url接口,却参数
                                        CouponService.expandCoupon(res.id).then((res)=>{
                                            if(res.url){
                                                this.setState({
                                                    // url字段需跟后台确认
                                                    dowloadUrl:res.url
                                                })
                                            }
                                        }).catch(
                                            (err) => {
                                                console.log('err');
                                            }
                                        );
                                        this.setState({
                                            showDowload: true,
                                            dowloadUrl: dowloadUrl,
                                            codeName: res.name
                                        })
                                    }else{
                                        this.props.history.push('/main/marketing_center/card_ticket');
                                    }
                                }else{
                                    message.success('复制卡券成功');
                                    if(scenePutUser==2){
                                        const {dowloadUrl} = this.state;
                                        // 推广二维码url接口,却参数
                                        CouponService.expandCoupon(res.id).then((res)=>{
                                            if(res.url){
                                                this.setState({
                                                    // url字段需跟后台确认
                                                    dowloadUrl:res.url
                                                })
                                            }
                                        }).catch(
                                            (err) => {
                                                console.log('err');
                                            }
                                        );
                                        this.setState({
                                            showDowload: true,
                                            dowloadUrl: dowloadUrl,
                                            codeName: res.name
                                        })
                                    }else{
                                        this.props.history.push('/main/marketing_center/card_ticket');
                                    }
                                    // this.props.history.push('/main/marketing_center/card_ticket');
                                }
                                // this.props.history.push('/main/marketing_center/card_ticket');
                            }
                        }).catch(
                            (err) => {
                                console.log('err');
                            }
                        );
                    } else if (dataParam.couponSceneValue == 2) {
                        // 页面级别的编辑接口
                        CouponService.editCoupon({
                            id:dataParam.couponIdValue?dataParam.couponIdValue:couponIdFromDetail,
                            // 卡券类型-代金券
                            type: 1,
                            // 卡券名称
                            name: values.couponName,
                            // 卡券面值
                            amount: Number(values.couponAmount),
                            // 卡券logo
                            logo: imageUrl?imageUrl:'',
                            // 卡券使用期限'0固定时间 1立即生效'
                            dateType: Number(values.validUsedTime),
                            fixedTerm: values.validUsedTime==1?Number(propsParam.getFieldValue('days')):'',
                            // useTimeBegin:values.validUsedTime==0?moment(values.time[0]).valueOf():'',
                            // useTimeEnd: values.validUsedTime==0?moment(values.time[1]).valueOf():'',
                            useTimeBegin:values.validUsedTime==0?new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime():'',
                            useTimeEnd: values.validUsedTime==0?new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime():'',
                            // 适用油品-卡种id-关联商品，逗号拼接字符串,暂时写死
                            productSkuId: suitedOil,
                            // 发放总量-不限制传99999
                            totalInventory: totalInventoryUser,
                            availInventory:totalInventoryUser,
                            // 卡券投放时间段
                            actTimeStart: timePutStartUser,
                            actTimeEnd: timePutEndUser,
                            // 卡券说明
                            remark: values.couponExplain,
                            // 投放渠道'1-卡券广场，2-二维码推广'
                            promoteType:scenePutUser,
                            // 最低消费'不限制为0'
                            leastCost:values.minConsumeType==1?0:Number(propsParam.getFieldValue('minConsume')) ,
                            // 适用时段，参数不定
                            useTimeHour: "00:00-23:59",
                            useTimeWeek: '1,2,3,4,5,6,7',
                            // 每位用户限领'不限制传99999'
                            getLimit:limitGetUser,
                            // 过期提醒，字段未定
                            invalidTip:values.invalidTip==1?'1':'0'
                        }).then((res) => {
                            // 页面级别-编辑成功，跳转回详情页面
                            if (dataParam.couponSceneValue == 2){
                                message.success('编辑卡券成功');
                                this.props.history.push('/main/marketing_center/coupon_detail?couponNumber='
                                    +dataParam.couponNumberValue+'&couponId='+dataParam.couponIdValue+'&status='+dataParam.couponStatusValue);
                            }
                        }).catch(
                            (err) => {
                                console.log('err');
                            }
                        );
                    }

                }else if(dataParam.couponSourceValue=='modalSource'){
                     // 弹窗级别的请求处理-1新增，2编辑，3复制
                    if (dataParam.couponSceneValue == 1 ||dataParam.couponSceneValue==3) {
                        // 新建-复制-CouponService
                        CouponService.addCoupon({
                            // 卡券类型-代金券
                            type: 1,
                            // 卡券名称
                            name: values.couponName,
                            // 卡券面值
                            amount: Number(values.couponAmount),
                            // 卡券logo
                            logo: imageUrl?imageUrl:'',
                            // 卡券使用期限'0固定时间 1立即生效'
                            dateType: Number(values.validUsedTime),
                            fixedTerm: values.validUsedTime==1?Number(propsParam.getFieldValue('days')):'',
                            // useTimeBegin:values.validUsedTime==0?moment(values.time[0]).valueOf():'',
                            // useTimeEnd: values.validUsedTime==0?moment(values.time[1]).valueOf():'',
                            useTimeBegin:values.validUsedTime==0?new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime():'',
                            useTimeEnd: values.validUsedTime==0?new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime():'',
                            // 适用油品-卡种id-关联商品，逗号拼接字符串,暂时写死
                            productSkuId: suitedOil,
                            // 发放总量-不限制传99999
                            totalInventory: totalInventoryUser,
                            availInventory:totalInventoryUser,
                            // 卡券投放时间段
                            actTimeStart: timePutStartUser,
                            actTimeEnd: timePutEndUser,
                            // 卡券说明
                            remark: values.couponExplain,
                            // 投放渠道'1-卡券广场，2-二维码推广'
                            promoteType:scenePutUser,
                            // 最低消费'不限制为0'
                            leastCost:values.minConsumeType==1?0:Number(propsParam.getFieldValue('minConsume')) ,
                            // 适用时段，参数不定
                            useTimeHour: "00:00-23:59",
                            useTimeWeek: '1,2,3,4,5,6,7',
                            // 每位用户限领'不限制传99999'
                            getLimit:limitGetUser,
                            // 过期提醒，字段未定
                            invalidTip:values.invalidTip==1?'1':'0'
                        }).then((res) => {
                            // 弹窗级别的回调函数调用，将成功后的结果返给页面
                            getCouponId(res);
                            if (dataParam.couponSceneValue == 1 || dataParam.couponSceneValue == 3){
                                if(dataParam.couponSceneValue == 1){
                                    message.success('新增卡券成功');
                                }else{
                                    message.success('复制卡券成功');
                                }
                                closeModalCoupon();
                            }
                        }).catch(
                            (err) => {
                                console.log('err');
                            }
                        );
                    } else if (dataParam.couponSceneValue == 2) {
                        // 编辑接口
                        CouponService.editCoupon({
                            id:dataParam.couponIdValue?dataParam.couponIdValue:couponIdFromDetail,
                            // 卡券类型-代金券
                            type: 1,
                            // 卡券名称
                            name: values.couponName,
                            // 卡券面值
                            amount: Number(values.couponAmount),
                            // 卡券logo
                            logo: imageUrl?imageUrl:'',
                            // 卡券使用期限'0固定时间 1立即生效,类型之后的传参参数呢？'
                            dateType: Number(values.validUsedTime),
                            fixedTerm: values.validUsedTime==1?Number(propsParam.getFieldValue('days')):'',
                            // useTimeBegin:values.validUsedTime==0?moment(values.time[0]).valueOf():'',
                            // useTimeEnd: values.validUsedTime==0?moment(values.time[1]).valueOf():'',
                            useTimeBegin:values.validUsedTime==0?new Date((moment(Number(values.time[0])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 00:00:00').getTime():'',
                            useTimeEnd: values.validUsedTime==0?new Date((moment(Number(values.time[1])).format('YYYY.MM.DD')).replace(/\./g, "/") +' 23:59:59').getTime():'',
                            // 适用油品-卡种id-关联商品，逗号拼接字符串,暂时写死
                            productSkuId: suitedOil,
                            // 发放总量-不限制传99999
                            totalInventory: totalInventoryUser,
                            availInventory:totalInventoryUser,
                            // 卡券投放时间段
                            actTimeStart: timePutStartUser,
                            actTimeEnd: timePutEndUser,
                            // 卡券说明
                            remark: values.couponExplain,
                            // 投放渠道'1-卡券广场，2-二维码推广'
                            promoteType:scenePutUser,
                            // 最低消费'不限制为0'
                            leastCost:values.minConsumeType==1?0:Number(propsParam.getFieldValue('minConsume')) ,
                            // 适用时段，参数不定
                            useTimeHour: "00:00-23:59",
                            useTimeWeek: '1,2,3,4,5,6,7',
                            // 每位用户限领'不限制传99999'
                            getLimit:limitGetUser,
                            // 过期提醒，字段未定
                            invalidTip:values.invalidTip==1?'1':'0'
                        }).then((res) => {
                            // 弹窗级别的回调函数调用，将成功后的结果返给页面
                            getCouponId(res);
                            message.success('编辑卡券成功');
                            closeModalCoupon();
                        }).catch(
                            (err) => {
                                console.log('err');
                            }
                        );
                    }
                }
            }
        });
    };

    // 时间戳格式化
    getMomentType = (timestimp) => {
        return moment(moment(timestimp).format(dateFormat), dateFormat);
    };

    afterClose = ()=>{
        this.props.history.push('/main/marketing_center/card_ticket');
    }

    render() {
        const {getFieldDecorator,getFieldsError,getFieldError} = this.props.form;
        // 判断终端和左侧菜单栏合起-展开状态
        const {responsive, menu, LoginUserInfo,rechargeRuleType} = this.props;
        const {showDowload, dowloadUrl, codeName} = this.state;
        // console.log(showDowload,'showDowload')
        // 获取组件识别所需参数
        const dataParam = this.getParamsValue();
        const {originData, imageUrl,usedTimeDaysFlag,usedTimeFixedFlag,
                 limitInventoryFlag,minConsumeFlag,minGetFlag,valueOils,
                 dataOil} = this.state;
        let params = this.props.form;
        const addCouponContainer = classNames('add-coupon-container',
            {'mobile-add-coupon-style':responsive.data.isMobile},
            {'modal-add-coupon':dataParam.couponSourceValue=='modalSource'});
        const mbrBtnContainer = classNames('mbr-btn-container',
            {'mbr-btn-container-collapse': menu.data.Collapsed},
            {'mobile-add-style':responsive.data.isMobile});
        const couponExplainStyle = classNames('inline-feedback-style-explain', {'explain-style':
        params.getFieldValue('couponExplain') && params.getFieldValue('couponExplain').length>9},
            {'explain-style-99': params.getFieldValue('couponExplain') && params.getFieldValue('couponExplain').length>99});
        let formOptionalLabel = {
            'couponExplain': (<span><span>卡券说明</span><span className="optional-style">(选填)</span></span>),
            'wayOptionLabel': (<span><span>领取方式</span><span className="optional-style">(选填)</span></span>),
            'giftOptionLabel': (<span><span>领取赠送</span><span className="optional-style">(选填)</span></span>)
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">点击上传</div>
            </div>
        );
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                md: {span: 4},
                lg: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                md: {span: 16},
                lg: {span: 16},
            }
        };

        // 适用油品数据处理
        let treeData = [];
        dataOil.map((item, index) => {
            let treeObj = {
                title: item.categoryName,
                key: item.id,
                value: item.id
            };
            let treeDataSub = [];
            item.goodsIdNames.map((itemSub, indexSub) => {
                let treeObjSub = {
                    title: itemSub.skuName,
                    key: itemSub.skuId,
                    value: itemSub.skuId
                };
                treeDataSub.push(treeObjSub);
            });
            treeObj.children = treeDataSub;
            treeData.push(treeObj)
        });

        const tProps = {
            treeData,
            onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '选择油品',
            treeDefaultExpandAll:true,
            style: {
                // width: 300,
            },
        };

        return (
            <div className={addCouponContainer}>
                <div className={responsive.data.isMobile ? 'mobile-set' : ''}>
                    <Form onSubmit={this.save}>
                        <Panel panelHeader={true} panelFooter={false} title="主要信息">
                            <WhiteSpace/>
                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="卡券名称">
                                        {getFieldDecorator('couponName', {
                                            rules: [
                                                {required: true, message: '请输入卡券名称'},
                                                {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '名称仅支持中英文数字'}
                                            ],
                                            initialValue: originData.name ? originData.name : ''
                                        })(
                                            <Input disabled={(dataParam.promoteTypeValue ==4 && dataParam.couponSceneValue==2 && rechargeRuleType == 0)?true:false} autoComplete="off" placeholder="请输入" className="field-width-limit" maxLength={20} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="卡券面值"
                                              className="inline-feedback-style">
                                        {getFieldDecorator('couponAmount', {
                                            rules: [
                                                {required: true, message: '请输入卡券面值'},
                                                {
                                                    pattern: /^(?!0+(\.0*)?$)\d{0,4}(\.\d{1,2})?$/,
                                                    message: '面值仅支持4位整数，2位小数，且不能为0'
                                                }
                                            ],
                                            initialValue: originData.amount ? originData.amount : ''
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" className="field-width-limit" />
                                        )}
                                        {/* <InputNumber className="field-width-limit" autoComplete="off" placeholder="请输入" min={0.01} max={9999.99}
                                                         step={0.01} />*/}
                                        <span className="last-des-span">元</span>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" justify="start"
                                 className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" justify="start"
                                     className="row-col-container">
                                    <FormItem {...formItemLayout} label="卡券logo:" className="upload-img-container-logo">
                                        {getFieldDecorator('couponLogo', {
                                            rules: [{required: true, message: '请上传卡券logo'}],
                                            initialValue: imageUrl ? imageUrl : null
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
                                                {imageUrl ? <img src={imageUrl} alt="avatar"/> : uploadButton}
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="卡券使用期限" className="expired-time-use-content">
                                        {getFieldDecorator('validUsedTime', {
                                            initialValue:originData.dateType==0?'0':'1'
                                        })(
                                            <RadioGroup onChange={this.onChangeCouponUsedTime}>
                                                <div>
                                                    <Radio value="1">领取后立即生效，有效期为
                                                        <FormItem {...formItemLayout} label=""
                                                                  className="inline-input-item inline-feedback-style">
                                                            {getFieldDecorator('days', {
                                                                rules: [
                                                                    {required: (usedTimeDaysFlag)?true:false, message: '请输入有效期天数'},
                                                                    {pattern: /^[1-9][0-9]*$/, message: '有效期天数格式不正确!'},
                                                                ],
                                                                initialValue: originData.dateType==1 ? originData.fixedTerm : ''
                                                            })(
                                                                <Input autoComplete="off" disabled={usedTimeDaysFlag?false:true} onChange={this.giftScoreInput}
                                                                       className="mbr-card-gift-score"
                                                                       placeholder="请输入" maxLength={4}/>
                                                            )}
                                                            <span className="last-des-span">天</span>
                                                        </FormItem>
                                                    </Radio>
                                                </div>
                                                <div>
                                                    <Radio value="0">固定时间
                                                        <Form.Item {...formItemLayout} label=""
                                                                   className="inline-input-item inline-input-item-date">
                                                            {getFieldDecorator('time', {
                                                                rules: [
                                                                    {required: usedTimeFixedFlag?true:false, message: '请输入有效期时间'},
                                                                ],
                                                                initialValue:(originData.dateType==0)?[this.getMomentType(originData.useTimeBegin), this.getMomentType(originData.useTimeEnd)]:''
                                                            })(
                                                                <RangePicker allowClear={false} disabledDate={this.disabledDate} disabled={usedTimeFixedFlag?false:true} format={dateFormat} placeholder={[
                                                                    '开始时间', '结束时间'
                                                                ]} onChange={this.onChangeFixedTime}/>
                                                            )}
                                                        </Form.Item>
                                                    </Radio>
                                                </div>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="适用油品">
                                        {getFieldDecorator('suitedOil', {
                                            rules: [
                                                {required: true, message: "请选择适用油品"}
                                            ],
                                            initialValue: valueOils.length>0 ? valueOils : ''
                                        })(
                                            <TreeSelect {...tProps} className="field-width-limit"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {(dataParam.couponSourceValue=='pageSource') && (
                                <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle"
                                     className="row-spacing">
                                    <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                        <FormItem {...formItemLayout} label="发放总量">
                                            {getFieldDecorator('putInTotal', {
                                                initialValue: originData.totalInventory?originData.totalInventory==99999?'1':'2':'1'
                                            })(
                                                <RadioGroup onChange={this.onChangeCouponTotal}>
                                                    <div>
                                                        <Radio value="1">不限制</Radio>
                                                    </div>
                                                    <div>
                                                        <Radio value="2">限制总量
                                                            <FormItem {...formItemLayout} label=""
                                                                      className="inline-input-item inline-feedback-style">
                                                                {getFieldDecorator('totalInventory', {
                                                                    rules: [
                                                                        {required: limitInventoryFlag?true:false, message: '请输入发放总量'},
                                                                        {
                                                                            pattern: /^[1-9][0-9]*$/,
                                                                            message: '发放总量格式不正确'
                                                                        },
                                                                    ],
                                                                    initialValue: originData.totalInventory!=99999 ? originData.totalInventory : ''
                                                                })(
                                                                    <Input autoComplete="off" disabled={limitInventoryFlag?false:true} onChange={this.giftScoreInput}
                                                                           className="mbr-card-gift-score"
                                                                           placeholder="请输入" maxLength={4}/>
                                                                )}
                                                                <span className="last-des-span">张</span>
                                                            </FormItem>
                                                        </Radio>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            )}
                            {(dataParam.couponSourceValue=='pageSource') && (
                                <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle"
                                     className="row-spacing">
                                    <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                        <Form.Item {...formItemLayout} label="卡券投放时间段">
                                            {getFieldDecorator('putInTime', {
                                                rules: [
                                                    {required: true, message: '请输入卡券投放时间'}
                                                ],
                                                initialValue: (originData.actTimeStart&& originData.actTimeEnd) ? [this.getMomentType(originData.actTimeStart), this.getMomentType(originData.actTimeEnd)] : ''
                                            })(
                                                <RangePicker allowClear={false} disabledDate={this.disabledDate} format={dateFormat} className="field-width-limit" placeholder={[
                                                    '开始时间', '结束时间'
                                                ]} onChange={this.onChangePutInTime}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label={formOptionalLabel.couponExplain}
                                              className={couponExplainStyle}>
                                        {getFieldDecorator('couponExplain', {
                                            initialValue: originData.remark ? originData.remark : ''
                                        })(
                                            <TextArea autoComplete="off" placeholder="请填写卡券说明" rows={4}
                                                      className="field-width-limit field-tip-align" maxLength={500}/>
                                        )}
                                        <span className="last-des-span">
                                            <span>{this.props.form.getFieldValue('couponExplain') && this.props.form.getFieldValue('couponExplain').length ? this.props.form.getFieldValue('couponExplain').length : '0'}</span>
                                            <span>/500</span>
                                        </span>
                                    </FormItem>
                                </Col>
                            </Row>

                        </Panel>
                        <WhiteSpace size="v-lg"/>
                        <Panel panelHeader={true} panelFooter={false} title="规则配置">
                            <WhiteSpace />
                            {(dataParam.couponSourceValue=='pageSource') && (
                                <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle"
                                     className="row-spacing">
                                    <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                        <FormItem {...formItemLayout} label="投放渠道">
                                            {getFieldDecorator('wayPutIn', {
                                                initialValue:originData.promoteType==2?'2':'1'
                                            }, {
                                                rules: [],
                                            })(
                                                <RadioGroup onChange={this.onChangeCouponScene}>
                                                    <Radio value="1">卡券广场</Radio>
                                                    <Radio value="2">二维码广场</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            )}
                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="最低消费">
                                        {getFieldDecorator('minConsumeType', {
                                            initialValue:originData.leastCost?originData.leastCost==0?'1':'2':'1'
                                        })(
                                            <RadioGroup onChange={this.onChangeMinConsume}>
                                                <div>
                                                    <Radio value="1">不限制</Radio>
                                                </div>
                                                <div>
                                                    <Radio value="2">设定最低消费
                                                        <FormItem {...formItemLayout} label=""
                                                                  className="inline-input-item inline-feedback-style">
                                                            {getFieldDecorator('minConsume', {
                                                                rules: [
                                                                    {required: minConsumeFlag?true:false, message: '请输入最低消费'},
                                                                    {
                                                                        pattern: /^(?!0+(\.0*)?$)\d{0,4}(\.\d{1,2})?$/,
                                                                        message: '最低消费仅支持4位整数，2位小数，且不能为0'
                                                                    },
                                                                ],
                                                                initialValue: originData.leastCost!=0?originData.leastCost : ''
                                                            })(
                                                                <Input autoComplete="off" disabled={minConsumeFlag?false:true} onChange={this.giftScoreInput}
                                                                       className="mbr-card-gift-score"
                                                                       placeholder="请输入"/>
                                                            )}
                                                            <span className="last-des-span">元</span>
                                                        </FormItem>
                                                    </Radio>
                                                </div>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="使用时段">
                                        {getFieldDecorator('usedTime', {
                                            initialValue: '1'
                                        }, {
                                            rules: [],
                                        })(
                                            <RadioGroup>
                                                <Radio value="1">不限制</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            {(dataParam.couponSourceValue=='pageSource') && (
                                <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle"
                                     className="row-spacing">
                                    <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                        <FormItem {...formItemLayout} label="每位用户限领">
                                            {getFieldDecorator('minGetType', {
                                                initialValue:originData.getLimit?originData.getLimit==99999?'1':'2':'1'
                                            })(
                                                <RadioGroup onChange={this.onChangeLimitGet}>
                                                    <div>
                                                        <Radio value="1">不限制</Radio>
                                                    </div>
                                                    <div>
                                                        <Radio value="2">设置每人限领
                                                            <FormItem {...formItemLayout} label=""
                                                                      className="inline-input-item inline-feedback-style">
                                                                {getFieldDecorator('minGet', {
                                                                    rules: [
                                                                        {required: minGetFlag?true:false, message: '请输入限领张数'},
                                                                        {
                                                                            pattern: /^[1-9][0-9]*$/,
                                                                            message: '每人限领张数格式不正确'
                                                                        },
                                                                    ],
                                                                    initialValue:originData.getLimit!=99999?originData.getLimit:''
                                                                })(
                                                                    <Input autoComplete="off" disabled={minGetFlag?false:true} onChange={this.giftScoreInput}
                                                                           className="mbr-card-gift-score"
                                                                           placeholder="请输入" maxLength={4} />
                                                                )}
                                                                <span className="last-des-span">张</span>
                                                            </FormItem>
                                                        </Radio>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            )}
                        </Panel>
                        <WhiteSpace size="v-lg"/>
                        {/*过期提醒先隐藏*/}
                    {/*    <Panel panelHeader={true} panelFooter={false} title="其他配置">
                            <WhiteSpace/>
                            <Row gutter={{xs: 8, md: 24, lg: 32}} type="flex" align="middle" className="row-spacing">
                                <Col md={24} xs={24} type="flex" align="middle" className="row-col-container">
                                    <FormItem {...formItemLayout} label="过期提醒">
                                        {getFieldDecorator('invalidTip', {
                                            initialValue: '0'
                                        }, {
                                            rules: [],
                                        })(
                                            <Switch defaultChecked onChange={this.onChangeTip}/>
                                        )}
                                        <div>过期前3天提醒1次，卡券有效期必须大于3天才能发送</div>
                                    </FormItem>

                                </Col>
                            </Row>

                        </Panel>
                        <WhiteSpace size="v-lg"/>*/}
                    </Form>
                </div>

                {(dataParam.couponSourceValue=='pageSource') && (
                    <Row md={24} xs={24} type="flex" justify="center" align="middle" className={mbrBtnContainer}>
                        <Button className="btn-fixed" onClick={this.cancel} type="default">取消</Button>
                        <Button className="btn-fixed btn-conf" onClick={this.save} type="primary"
                                htmlType="submit">{dataParam.couponSceneValue == 1 ? '确认新建' : '确认'}</Button>
                    </Row>
                    // disabled={this.hasErrors(getFieldsError())}
                )}
                {(dataParam.couponSourceValue=='modalSource') && (
                    <Row md={24} xs={24} type="flex" justify="center" align="middle">
                        <Button className="btn-fixed" onClick={this.cancel} type="default">取消</Button>
                        <Button className="btn-fixed btn-conf" onClick={this.save} type="primary"
                                htmlType="submit">{dataParam.couponSceneValue == 1 ? '确认新建' : '确认'}</Button>
                    </Row>
                )
                }

                {/*下载二维码*/}
                <QrcodeDownload isShow={showDowload} url={dowloadUrl} afterClose={this.afterClose} name={codeName}></QrcodeDownload>

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
)(Form.create()(AddCoupon));

/**
 * 会员中心
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 会员列表
 */
const MemberList = Loadable({
    loader: () => import('../containers/member_list/containers/list/List'),
    loading: Loading
});

/**
 * 会员卡设置
 */
const MemberCardSetting = Loadable({
    loader: () => import('../containers/member_card_setting/MemberCardSetting'),
    loading: Loading
});


// 会员卡详情页面
const MemberCardDetail = Loadable({
    loader: () => import('../containers/member_card_setting/MemberCardDetail'),
    loading: Loading
});

// 会员详情页面
const MemberDetail = Loadable({
    loader: () => import('../containers/member_list/containers/detail/index'),
    loading: Loading
});

// 会员导入列表页面
const MemberImport = Loadable({
    loader: () => import('../containers/member_list/containers/import/Import'),
    loading: Loading
});

// 会员导入手册页面
const MemberImportHelper = Loadable({
    loader: () => import('../containers/member_list/containers/import/ImportHelp'),
    loading: Loading
});
/**
 * 加油卡
 */
const OilCard = Loadable({
    loader: () => import('../containers/oil_card/index'),
    loading: Loading
});

/**
 * 积分规则
 */
const PointRule = Loadable({
    loader: () => import('../containers/oil_card/containers/point_rule/PointRule'),
    loading: Loading
});

/**
 * 充值规则
 */
const StoreRule = Loadable({
    loader: () => import('../containers/oil_card/containers/store_rule/StoreRuleList'),
    loading: Loading
});

/**
 * 积分商城
 */
const PointMall = Loadable({
    loader: () => import('../containers/point_mall/index'),
    loading: Loading
});

/*
*  积分商城添加积分活动页面
* */
const AddPointActivity = Loadable({
    loader: () => import('../containers/point_mall/containers/AddPointActivity'),
    loading: Loading
});

/*
*  积分商城编辑积分活动页面
* */
const EditPointActivity = Loadable({
    loader: () => import('../containers/point_mall/containers/EditPointActivity'),
    loading: Loading
});

/*
*  积分商城积分活动详情页面
* */
const DeatilPointActivity = Loadable({
    loader: () => import('../containers/point_mall/containers/DeatilPointActivity'),
    loading: Loading
});

export default {
    MemberList,
    MemberCardSetting,
    OilCard,
    PointMall,
    MemberCardDetail,
    MemberDetail,
    MemberImport,
    MemberImportHelper,
    AddPointActivity,
    EditPointActivity,
    DeatilPointActivity,
    PointRule,
    StoreRule
}
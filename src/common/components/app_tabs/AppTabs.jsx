/**
 * Tabs组件 （更改原Tab切换分离内容部分，如果不考虑Tab切换不分离内容部分则直接使用antd的Tabs组件即可）
 * 参数
 *  1、tabobj: antd原有属性
 *  2、tabs: {key: tab项唯一标识key, title: tab标题，handleClick: 点击tab项触发事件}
 */
import React from 'react';
import {Tabs} from 'antd';
import PropTypes from 'prop-types';

const {TabPane} = Tabs

class AppTabs extends React.Component {
    static propTypes = {
        tabobj: PropTypes.object,
        tabs: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string,
                title: PropTypes.string,
                handleClick: PropTypes.func
            })
        )
    }

    bindChange = (key) => {
        const {tabs} = this.props;
        const _tab = tabs.find(tab => tab.key === key);
        if (_tab) {
            _tab.handleClick(key);
        }
    }

    render() {
        const {tabobj, tabs} = this.props;
        return (
            <div>
                <Tabs {...tabobj} onChange={this.bindChange}>
                    {
                        tabs.map(tab => (<TabPane tab={tab.title} key={tab.key}></TabPane>))
                    }
                </Tabs>
                {(
                    // 当前组件下修改tabs样式
                    <style>
                    {`
                        .ant-tabs-bar {
                            margin: 0;
                            border-bottom:none;
                        }
                    `}
                    </style>
                )}
            </div>
        )
    }
}

export default AppTabs;
import React from 'react';
import { Spin } from 'antd';

export default () => 
<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <Spin size="large" tip="加载中..." />
</div>
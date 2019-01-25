import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '@/common/components/404/NotFound';
import LoginRouter from '@/login/login.route';
import App from '@/base/App.jsx';

export default () => (
    <Router forceRefresh={true}>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/main/index" push />} />        
            <Route path="/main" component={App} />
            <Route path="/404" component={NotFound} />
            <Route path="/login" component={LoginRouter} />
            <Route component={NotFound} />
        </Switch>
    </Router>
)

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import AllComponents from './modules';
import routesConfig from './route';
import queryString from 'query-string';

export default class CRouter extends Component {
    // 权限验证
    requireAuth = (permission, component) => {
        try {
            const {LoginUserInfo} = this.props;
            const permissions = LoginUserInfo.menus;
            const _currp = permissions.find(m => m.code == permission);
            if (!permissions || !_currp) return <Redirect to={'404'} />;
            return component;
        } catch (error) {
            return component;
        }
    };
    // 登录验证
    requireLogin = (component, permission) => {
        try {
            const {LoginUserInfo} = this.props;
            if (this.props == null || LoginUserInfo.menus.length <= 0) {
                return component;
            } else {
                return permission ? this.requireAuth(permission, component) : component;
            }
        } catch (error) {
            return component;
        }
    };
    render() {
        return (
            <Switch>
                {
                    Object.keys(routesConfig).map(key => 
                        routesConfig[key].map(r => {
                            const route = r => {
                                const Component = AllComponents[r.component];
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        render={props => {
                                            Object.assign(props, {query: queryString.parse(props.location.search), params: props.match.params});
                                            return r.login ? 
                                            <Component {...props} />
                                            : this.requireLogin(<Component {...props} />, r.power_code)}
                                        }
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r));
                        })
                    )
                }

                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}
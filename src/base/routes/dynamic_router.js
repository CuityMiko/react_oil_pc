
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import AllComponents from './modules';
import routesConfig from './route';
import queryString from 'query-string';
import PropTypes from 'prop-types'

class DynamicRouter extends Component {

    static propTypes = {
        routes: PropTypes.array.isRequired
    }

    render() {
        const {routes} = this.props;
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
                                            return <Component {...props} />}
                                        }
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r));  
                            // routes.map((routekey, index1) => {
                            //     console.log(routekey, 'dsadsadsaroutekey', index1)
                            //     return r.component && r.key == routekey ? route(r) : r.subs.map(r => route(r));  
                            // })
                        })
                    )
                }
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}

export default DynamicRouter;
import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './containers/login/Login';
import FindPwssword from './containers/find_pwssword/FindPwssword';

class LoginRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path="/login/index" component={Login} />
                <Route path="/login/find_password" component={FindPwssword} />
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}

export default LoginRouter;
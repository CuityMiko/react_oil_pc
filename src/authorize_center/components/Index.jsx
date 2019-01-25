import React, {Component} from 'react'

export default class AuthorizeCenterComponent extends Component {
    state = {
        title: '授权中心-组件'
    }

    render() {
        return (
            <div>{this.state.title}</div>
        )
    }
}
import React, {Component} from 'react'

class OiltationManageComponent extends Component {
    state = {
        title: '油站管理-组件'
    }

    render() {
        return (
            <div>{this.state.title}</div>
        )
    }
}

export default OiltationManageComponent;
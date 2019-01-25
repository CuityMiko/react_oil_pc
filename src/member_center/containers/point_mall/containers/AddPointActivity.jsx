import React from 'react';
import PropTypes from 'prop-types';
import WrappedAddOrEditPointActivityForm
    from "../components/add_or_edit_point_activity_form/AddOrEditPointActivityForm";
import {message} from "antd/lib/index";

class AddPointActivity extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    state = {
        title: '新增活动'
    }

    render() {
        const {
            history
        } = this.props;

        return (
            <div>
                <WrappedAddOrEditPointActivityForm history={history} />
            </div>
        )
    }
}

export default AddPointActivity;
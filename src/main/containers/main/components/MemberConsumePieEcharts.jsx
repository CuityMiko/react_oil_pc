import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import echarts from 'echarts';

class MemberConsumePieEcharts extends React.Component {
    static propTypes = {
        data: PropTypes.object
    }

    static defaultProps = {
        data: {
            x: [],
            y: []
        }
    }

    state = {
        option: {}
    }

    componentWillMount() {
        this.bindOptions();
    }

    bindOptions = () => {
        const {data} = this.props;
        const option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'right',
                data: data.x || []
            },
            calculable : true,
            color: ['#1890ff', '#00DF84'],
            series : [
                {
                    name: '',
                    type:'pie',
                    radius : ['40%', '60%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                     /*   emphasis : {
                            label : {
                                show : true,
                                position : 'center',
                                textStyle : {
                                    fontSize : '16',
                                    fontWeight : 'bold'
                                }
                            }
                        }*/
                    },
                    data: data.y || []
                }
            ]
        };
        this.setState({option});
    }

    render() {
        const {option} = this.state;
        return (
            <ReactEcharts
                option={option}
                style={{height: '330px', width: '100%'}}
                className={'react_for_echarts'}
            />
        )
    }
}

export default MemberConsumePieEcharts;
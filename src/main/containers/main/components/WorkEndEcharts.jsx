import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import PropTypes from 'prop-types';

class WorkEndEcharts extends React.Component {
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
        const {data} = this.props;
        const option = {
            title: {
                left: '50%',
                show: false,
                textAlign: 'center'
            },
            legend: {
                right: 20,
                orient: 'vertical',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                backgroundColor: 'rgba(255,255,255,1)',
                padding: [5, 10],
                textStyle: {
                    color: '#1890ff',
                },
                extraCssText: 'box-shadow: 0 0 5px #1890ff'
            },
            xAxis: {
                type: 'category',
                data: data.x || [],
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color:'#d9d9d9'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 14,
                        color:'rgba(0, 0, 0, 0.65)'
                    }
                }
            },
            yAxis: {
                name:'金额/班次',
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color:'#d9d9d9'
                    }
                },
                axisLabel: {
                    margin: 4,
                    textStyle: {
                        fontSize: 14,
                        color:'rgba(0, 0, 0, 0.65)'
                    }
                }
            },
            series: [{
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                data: data.y || [],
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(216, 244, 247,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(216, 244, 247,1)'
                        }], false)
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#1890ff'
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            }]
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

export default WorkEndEcharts;
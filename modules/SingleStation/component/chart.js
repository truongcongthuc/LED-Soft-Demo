import React from 'react'
import * as _ from 'lodash'
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HC_more from "highcharts/highcharts-more";
HC_more(Highcharts);

const chartThems = {
    colors: ['#FFB343'],
    chart: {
        backgroundColor: 'transparent',
        style: {
            fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#606063'
    },
    subtitle: {
        style: {
            color: '#E0E0E3',
            textTransform: 'uppercase'
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    }
}

const ChartCoponent = (props) => {
    const {dataChart, indicators, meaKey, heightChart} = props

    // render QCVN text
    const renderQCVN = (mea) => {
        let text = ''
        if(!_.isEmpty(mea.qcvn_code)) {
            text += mea.qcvn_code
        }
        if(!_.isEmpty(mea.qcvn_detail_type_code)) {
            text += `- Cột ${mea.qcvn_detail_type_code}`
        }
        return text
    }

     // Action render options for chart
    const renderChartOption = () => {
        const newListMea = _.keyBy(indicators, 'key')
        const indicatorActive = _.get(newListMea, [meaKey], {})
        const meaName = _.get(newListMea, [meaKey, 'name'], null)
        const textQCVN = renderQCVN(indicatorActive)
        const valQCVN = _.get(indicatorActive, 'qcvn_detail_max_value', null)
        const config = {
            chart: {
                backgroundColor: 'transparent',
                style: {
                    fontFamily: '\'Unica One\', sans-serif'
                },
                plotBorderColor: '#606063'
            },
            time: {
                useUTC: false
            } ,
            title: {
                text: null,
                enabled: false 
            },
            exporting: { 
                enabled: false 
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            rangeSelector: {
                selected: 1,
                enabled:false
            },
            scrollbar: {
                enabled:false
            },
            xAxis: {
                type: 'datetime',
                categories: _.get(dataChart,'categories', []),
                gridLineColor: '#707073',
                labels: {
                format: '{value:%H:%M}',
                    style: {
                        color: '#ffffff',
                        fontWeight: '500',
                        fontSize: 14
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            yAxis: {
                // max: _.get(dataChart, [indicatorKeyActive, 'yAxisMax'], 0),
                // min: _.get(dataChart, [indicatorKeyActive, 'yAxisMin'], 0),
                labels: {
                    style: {
                        color: '#ffffff',
                        fontWeight: '500',
                        fontSize: 14
                    }, 
                    
                },
                title: {
                    text: meaName,
                    style: {
                        color: '#ffffff',
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                plotLines: [
                    {
                        value: valQCVN,
                        color: '#CC1313',
                        width: 3,
                        label: {
                            text: textQCVN,
                            style: {
                                color: '#ffffff'
                            }
                        },
                        zIndex: 1000000
                    }
                ]
            },
            series: [{
                type: 'spline',
                name: '',
                data: _.get(dataChart,'series', []),
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        lineWidth: 0
                    }
                },
                enableMouseTracking: false
            }, {
                type: 'scatter',
        
                name: '',
                data: _.get(dataChart,'scatter', []),
        
            }
            ],
                plotOptions: {
                scatter: {
                    marker: {
                        radius: 8,
                        symbol: 'circle',
                        
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                }
            },
        }
        return {...config, ...chartThems}
    }

    return (
        <HighchartsReact 
            highcharts={Highcharts} 
            constructorType={'chart'} 
            containerProps={{ style: { height: (heightChart - 40) } }}
            options={renderChartOption()} />
    )

}



export default ChartCoponent;
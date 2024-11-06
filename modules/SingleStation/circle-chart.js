import React, { useRef } from 'react'
import styled from 'styled-components'
import { Progress } from 'antd';
import * as _ from 'lodash'
import moment from 'moment'
import { useHistory } from "react-router-dom";


const CircleChartComponent = ({ station }) => {
    const ref = useRef(null);

    const { indicators, data, } = station
    let lastTimeData = null
    const newArrData = _.values(data)
    let totalExceed = 0
    indicators.forEach(({ name }) => {
        if (_.get(data, [name, 'status'], '-') === 3) {
            totalExceed += 1
        }
    });
    const total = _.size(indicators)
    const percent = totalExceed === 0 ? 100 : total - totalExceed / total * 100

    _.forEach(newArrData, row => {
        if (_.isEmpty(lastTimeData)) {
            lastTimeData = _.get(row, 'get_time', null)
        } else {
            return;
        }
    })

    return (
        <div ref={ref} style={{ paddingTop: '10px', overflow: 'hidden', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Progress
                type="dashboard"
                strokeLinecap="butt"
                strokeColor={{
                    '0%': '#1d976c',
                    '100%': '#1DCE6C',
                }}
                trailColor={{
                    '0%': '#a10e03',
                    '100%': '#FF2C08',
                }}
                strokeWidth={10}
                percent={percent}
                width={ref.current ? ref.current.offsetWidth * 0.75 : 300}
                format={() => <ProgressTitleBox>
                    <ProgressText>{`${total - totalExceed}/${total}`}</ProgressText>
                    <TitleSmall>Thông số đạt<br></br>quy chuẩn</TitleSmall>
                </ProgressTitleBox>}
            />
        </div>
    )
}


const TitleSmall = styled.div`
    margin-top: 1.0vh;
    margin-bottom: 1.0vh;
    font-style: normal;
    font-weight: normal;
    font-size: 3.0vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 12px;
    }
`
const ProgressTitleBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.5vh;
`

const ProgressText = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 5.0vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 15px;
        line-height: 18px;
    }
`

export default CircleChartComponent
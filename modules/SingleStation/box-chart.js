import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import ChartCoponent from './component/chart'
import './index.css'



const BoxHightChart = ({ dataStation, numderIndicator, dataHistory }) => {
    const { indicators, id } = dataStation
    const [flexBoxSize, setFlexBoxSize] = useState({})
    const [indicatorActive, setIndicatorActive] = useState('')
    const [indicatorKeyActive, setIndicatorKeyActive] = useState('')
    const [isPlayTimer, setIsPlayTimer] = useState(false)
    const [currentIndicatorActive, setCurrentIndicatorActive] = useState(null)
    const [heightChart, setHeightChart] = useState(null)

    useEffect(() => {
        if (_.size(indicators) > 0) {
            setIndicatorKeyActive(_.get(indicators[0], 'name', ''))
            setCurrentIndicatorActive(0)
            setIndicatorActive(_.get(indicators[0], 'name', ''))
            setIsPlayTimer(true)
        }
        return () => {
            //  coponents unmount
            setIndicatorActive('')
            setCurrentIndicatorActive(null)
            setIsPlayTimer(false)
        }
    }, [dataHistory])

    useEffect(() => {
        renderSizeFlexBox(numderIndicator)
    }, [numderIndicator])

    // Render size flex box
    const renderSizeFlexBox = (number) => {
        if (6 < number) {
            // setFlexBoxSize({containerWidth: '50%'})
            setFlexBoxSize({ containerWidth: '60%' })
        }
        if (4 < number && number <= 6) {
            setFlexBoxSize({ containerWidth: '60%' })
        }
        if (0 < number && number < 4) {
            setFlexBoxSize({ containerWidth: '80%' })
        }
        if (number === 4) {
            setFlexBoxSize({ containerWidth: '60%' })
        }
        if (number === 2) {
            setFlexBoxSize({ containerWidth: '80%' })
        }
    }


    // Render number timer
    const renderTimerText = ({ remainingTime }) => {
        return (
            <div className="timer">
                <div className="value">{remainingTime}</div>
            </div>
        );
    };

    // Action callback with timer finish
    const finishTimer = () => {
        if (currentIndicatorActive + 1 === numderIndicator) {
            setIndicatorKeyActive(_.get(indicators[0], 'name', ''))
            setCurrentIndicatorActive(0)
            setIndicatorActive(_.get(indicators[0], 'name', ''))
        } else {
            setIndicatorKeyActive(_.get(indicators[currentIndicatorActive + 1], 'name', ''))
            setCurrentIndicatorActive(currentIndicatorActive + 1)
            setIndicatorActive(_.get(indicators[currentIndicatorActive + 1], 'name', ''))
        }
        return [true, 1000];
    };


    return (
        <ChartContainer>
            {/* <div style={{ width: '30%' }}>
                <TitleStation>{_.get(dataStation, 'station_name', '')}</TitleStation>
            </div> */}
            <BoxChart>
                <MeaChartBox>
                    <MeaContaier>
                        {_.map(indicators, mea =>
                            <ChartMeaItem key={mea.key} active={_.get(mea, 'name', '') === indicatorActive}>{_.get(mea, 'name', '')}</ChartMeaItem>
                        )}
                    </MeaContaier>
                    <ChartReload>
                        <CountdownCircleTimer
                            isPlaying={isPlayTimer}
                            duration={5}
                            size={50}
                            strokeWidth={3}
                            colors={[["#ffffff", 0.33], ["#ffffff", 0.33], ["#ffffff"]]}
                            trailColor="#282F4A"
                            onComplete={() => finishTimer()}
                        >
                            {renderTimerText}
                        </CountdownCircleTimer>
                    </ChartReload>
                </MeaChartBox>
                <ChartMaxMin>
                    <BoxMaxMin>
                        <BoxMaxMinContent>
                            <TitleMaxMin>Giá trị nhỏ nhất</TitleMaxMin>
                            <BoxValueMaxMin>
                                <PointMin />
                                <ValueMaxMin>{_.get(dataHistory, [indicatorKeyActive, 'valMin'], '')}</ValueMaxMin>
                            </BoxValueMaxMin>
                        </BoxMaxMinContent>
                        <BoxMaxMinContent>
                            <TitleMaxMin>Giá trị lớn nhất</TitleMaxMin>
                            <BoxValueMaxMin>
                                <PointMax />
                                <ValueMaxMin>{_.get(dataHistory, [indicatorKeyActive, 'valMax'], '')}</ValueMaxMin>
                            </BoxValueMaxMin>
                        </BoxMaxMinContent>
                    </BoxMaxMin>
                </ChartMaxMin>
                <HighChartContainer ref={(divElement) => {
                    // Lấy kích thước container khi chưa vẽ chart
                    if (divElement && !heightChart) {
                        const rect = divElement.getBoundingClientRect()
                        setHeightChart(rect.height)
                    }
                }}>
                    {
                        (heightChart > 0) && <BoxItemChart>
                            {_.map(dataHistory, dataRow =>
                                <div key={`highchart-${dataRow.key}`}>
                                    {indicatorKeyActive === dataRow.key && <ChartCoponent heightChart={heightChart} id={dataRow.key} dataChart={dataRow} meaKey={dataRow.key} indicators={indicators} />}
                                </div>
                            )}
                        </BoxItemChart>}
                </HighChartContainer>
            </BoxChart>
        </ChartContainer>
    )
}


const ChartContainer = styled.div`
    flex: 2;
    flex-direction: row;
    display: flex;
    height: 100%;
    padding-right: 1.6vh;
    padding-top: 2.6vh;
`

const BoxChart = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: transparent;
    box-sizing: border-box;
`

const MeaChartBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.0vh;
`
const MeaContaier = styled.div`
    display: flex;
    overflow: auto;
    align-items: center;
`
const ChartMeaItem = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 3.5vh;
    margin-right: 1.0vh;
    margin-left: 1.0vh;
    color: ${(props) => props.active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.28)'};
    @media (max-width: 1299px) {
        font-size: 28px;
        line-height: 26px;
    }
    @media (max-width: 909px) {
        font-size: 20px;
        line-height: 18px;
    }
`
const ChartReload = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 3.0vh;
    color: #FFFFFF;
    @media (max-width: 1299px) {
        font-size: 24px;
        line-height: 22px;
    }
    @media (max-width: 909px) {
        font-size: 22px;
        line-height: 20px;
    }
`

const ChartTimeTitle = styled.div`
    font-family: sans-serif;
    margin-left: 20px;
    margin-top: 10px;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 22px;
    color: #FFFFFF;
    @media (max-width: 1299px) {
        font-size: 22px;
        line-height: 20px;
    }
    @media (max-width: 909px) {
        font-size: 18px;
        line-height: 16px;
    }
`

const ChartMaxMin = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const BoxMaxMin = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5vh;
`

const BoxMaxMinContent = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2.0vh;
    margin-left: 2.0vh;
    justify-content: center;
    align-items: center;
`

const ValueMaxMin = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 3.5vh;
    line-height: 3.5vh;
    color: #FFFFFF;
    margin-top: 10px;
    @media (max-width: 1299px) {
        font-size: 32px;
        line-height: 30px;
    }
    @media (max-width: 909px) {
        font-size: 22px;
        line-height: 20px;
    }
`

const TitleMaxMin = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 20px;
    color: #DCDCDC;
    @media (max-width: 1299px) {
        font-size: 20px;
        line-height: 18px;
    }
    @media (max-width: 909px) {
        font-size: 18px;
        line-height: 16px;
    }
`
const BoxValueMaxMin = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const PointMax = styled.div`
    margin-top: 10px;
    margin-right: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #CC1313;
    // background: linear-gradient(203.63deg, #CC1313 6.66%, #F86E0A 89.54%);
`

const PointMin = styled.div`
    margin-top: 10px;
    margin-right: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #FFFFFF;
`


const HighChartContainer = styled.div`
    height: 100%;
    width: 100%;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
`
const BoxItemChart = styled.div`
    height:calc(100% - 10px);
    width:calc(100% - 10px);
    background-color: transparent;
`
const TitleStation = styled.div`
    height: 48%;
    font-family: sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 38px;
    color: #FFFFFF;
    margin-bottom: 10px;
    @media (max-width: 900px) {
        font-size: 22px;
        line-height: 20px;
    }
`

const TitleAddress = styled.div`
    height: 48%;
    font-family: sans-serif;
    font-style: normal;
    font-size: 24px;
    line-height: 25px;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 14px;
        line-height: 15px;
    }
`

export default BoxHightChart
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Header from './component/header'
import { getApi } from '../../commons/fetch-data/fetch'
import { SW } from '../../config-app'
import StationListComponent from './component/station-list'
import TimeOclock from './component/time'
import './index.css'
import _ from 'lodash'
import Highcharts from "highcharts/highstock"
import PieChart from "highcharts-react-official";
import Carousel from 'react-bootstrap/Carousel'


const styleFlexCenter = { display: 'flex', alignItems: 'center' }
const styleFlexEnd = { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }
const styleFlexBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

const MultiStationNm = () => {
    const [data, setData] = useState()
    const [chunkedData, setChunkedData] = useState()
    const [numberGood, setNumberGood] = useState(0)
    const [numberExceed, setNumberExceed] = useState(0)
    const [numberAdjust, setNumberAdjust] = useState(0)
    const [numberError, setNumberError] = useState(0)
    const [numberDisconnect, setNumberDisconnect] = useState(0)

    useEffect(() => {
        fetchData()
    }, [])

    const options = {
        chart: {
            backgroundColor: null,
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            style: {
                color: '#FFF',
                fontSize: '6.0vh',
                fontWeight: 'bold',
            },
            text: `${numberGood + numberExceed + numberAdjust + numberError + numberDisconnect}`,
            align: 'center',
            verticalAlign: 'middle',
            y: 32
        },
        credits: {
            enabled: false
        },
        subtitle: {
            style: {
                color: '#FFF',
                fontSize: '3.5vh',
                fontWeight: '300'
            },
            text: `Tổng trạm`,
            align: 'center',
            verticalAlign: 'middle',
            y: 64
        },
        plotOptions: {
            pie: {
                // startAngle: -145,
                // endAngle: 145,
                allowPointSelect: false,
                cursor: 'pointer',
                colors: ['#1DCE6C', '#FF2C08', '#FFB951', '#AE45F9', '#C7BCBC'],
                dataLabels: {
                    enabled: false,
                }
            }
        },
        series: [
            {
                innerSize: '60%',
                data: [
                    {
                        name: "Hoạt động tốt",
                        y: numberGood
                    },
                    {
                        name: "Vượt quy chuẩn",
                        y: numberExceed
                    },
                    {
                        name: "Lỗi thiết bị",
                        y: numberError
                    },
                    {
                        name: "Hiệu chuẩn",
                        y: numberAdjust
                    },
                    {
                        name: "Mất kết nối",
                        y: numberDisconnect
                    }
                ]
            }
        ]
    };


    // Statistical station
    useEffect(() => {
        if (_.size(data) > 0) {
            renderStatiscalStation(data)
        }
    }, [data])

    // render Statistical station
    const renderStatiscalStation = (arr) => {
        let totalGood = 0
        let totalExceed = 0
        let totalAdjust = 0
        let totalError = 0
        let totalDisconnect = 0

        arr.forEach(({ status }) => {
            switch (status) {
                case 0:
                    totalGood += 1
                    break
                case 3:
                    totalExceed += 1
                case 6:
                    totalError += 1
                case 5:
                    totalAdjust += 1
                case 4:
                    totalDisconnect += 1

            }
        });
        setNumberGood(totalGood)
        setNumberExceed(totalExceed)
        setNumberError(totalError)
        setNumberAdjust(totalAdjust)
        setNumberDisconnect(totalDisconnect)
    }
    // Action fetch data
    const fetchData = async () => {
        try {
            const res = await getApi(SW, '')
            if (res.data.success) {
                setData(res.data.data)
                setChunkedData(_.chunk(_.clone(res.data.data), 3))
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log('Error', error)
        }
    }

    // Action render number text timer
    const renderTimerText = ({ remainingTime }) => {
        return (
            <TextTimer>{remainingTime}</TextTimer>
        );
    };

    // Callback when timer finish
    const finishTimer = () => {
        const res = fetchData()
        return [true, 1000];
    };

    return (
        <Container>
            <ContainerHeader>
                <Header isShowTime={true} />
                <div className="row" style={{ margin: 10 }} hidden>
                    <div className="col-6 text-light" style={{ ...styleFlexEnd }}>
                        <TitleTime><TimeOclock /></TitleTime>
                        <CountdownCircleTimer
                            isPlaying={true}
                            duration={60}
                            size={40}
                            strokeWidth={2}
                            colors={[["#ffffff", 0.33], ["#ffffff", 0.33], ["#ffffff"]]}
                            trailColor="#282F4A"
                            onComplete={() => finishTimer()}
                        >
                            {renderTimerText}
                        </CountdownCircleTimer>
                    </div>
                </div>
            </ContainerHeader>
            <ContainerBody>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <PieChart highcharts={Highcharts} options={options} />
                    <div>
                        <div className="col-fluid text-light mb-2" style={{ ...styleFlexCenter }}>
                            <CycleInfo color='linear-gradient(to right, #1DCE6C, #1d976c)'>{numberGood}</CycleInfo>
                            <Title >Trạm hoạt động tốt</Title>
                        </div>
                        <div className="col-fluid text-light mb-2" style={{ ...styleFlexCenter }}>
                            <CycleInfo color='linear-gradient(to right, #FF2C08, #a10e03)'>{numberExceed}</CycleInfo>
                            <Title>Trạm vượt quy chuẩn</Title>
                        </div>
                        <div className="col-fluid text-light mb-2" style={{ ...styleFlexCenter }}>
                            <CycleInfo color='linear-gradient(to right, #FFB951, #FF9800)'>{numberError}</CycleInfo>
                            <Title >Trạm lỗi thiết bị</Title>
                        </div>
                        <div className="col-fluid text-light mb-2" style={{ ...styleFlexCenter }}>
                            <CycleInfo color='linear-gradient(to right, #AE45F9, #6A0DAD)'>{numberAdjust}</CycleInfo>
                            <Title>Trạm đang hiệu chuẩn</Title>
                        </div>
                        <div className="col-fluid text-light mb-2" style={{ ...styleFlexCenter }}>
                            <CycleInfo color='linear-gradient(to right, #C7BCBC, #999999)'>{numberDisconnect}</CycleInfo>
                            <Title >Trạm mất kết nối</Title>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 3 }}>
                    {_.size(data) <= 3 && <StationListComponent stationList={data} />}

                    {_.size(data) > 3 &&
                        <Carousel controls={false} style={{ height: '100%' }}>
                            {_.map(chunkedData, (item) =>
                                <Carousel.Item interval={15000}>
                                    <StationListComponent stationList={item} />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    }
                </div>
            </ContainerBody>
        </Container>
    )
}

const Container = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #22253A;
`

const ContainerHeader = styled.div`
    height: 10%;
    display: contents;
    background: linear-gradient(to right, #141e30, #243b55);    
`
const ContainerBody = styled.div`
    height: 90%;
    display: inline-flex;
`

const Title = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 3.0vh;
    line-height: 3.0vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 15px;
    }
`

const TitleTime = styled.div`
    margin-right: 30px;
    font-family: sans-serif;
    font-style: normal;
    font-size: 20px;
    line-height: 25px;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 15px;
        margin-right: 20px;
    }
`

const TextTimer = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-size: 20px;
    line-height: 25px;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 15px;
    }
`

const CycleInfo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    padding: 5px;
    margin-left: 2.0vh;
    margin-right: 2.0vh;
    height: 5.0vh;
    width: 5.0vh;
    background: ${(props) => props.color};
    font-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 3.0vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 11px;
        line-height: 15px;
        height: 30px;
        width: 30px;
    }
`

export default MultiStationNm
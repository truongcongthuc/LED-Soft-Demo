import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import moment from 'moment'
import { getApi, postApi } from '../../commons/fetch-data/fetch'
import { SW, SW_HISTORY } from '../../config-app'
import BoxIndicator from './box-indicators'
import BoxHightChart from './box-chart'
import Header from '../MultiStation/component/header'
import CircleChartComponent from './circle-chart'
import { ClockCircleOutlined } from '@ant-design/icons'

const styleFlexEnd = { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }
const styleFlexStart = { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }

const OneStationNmAutoFetch = () => {
    const [data, setData] = useState()
    const [stationId, setStationId] = useState()
    const [arrStationId, setArrStationId] = useState([])
    const [currentStationId, setCurrentStationId] = useState(null)
    const [dataHistory, setDataHistory] = useState()
    const [numberGood, setNumberGood] = useState(0)
    const [numberAdjust, setNumberAdjust] = useState(0)
    const [numberError, setNumberError] = useState(0)

    useEffect(() => {
        if (_.size(data) > 0) {
            renderIndicatorStatiscal(data)
        }
    }, [data])

    const renderIndicatorStatiscal = (data) => {
        let totalGood = 0
        let totalError = 0
        let totalAdjust = 0
        _.values(_.get(data, 'indicators', [])).forEach(({ name }) => {
            switch (_.get(data, ['data', name, 'status'], '-')) {
                case 0:
                    totalGood += 1
                    break
                case 1:
                    totalAdjust += 1
                    break
                case 2:
                    totalError += 1
                    break
            }
        });
        setNumberGood(totalGood)
        setNumberError(totalError)
        setNumberAdjust(totalAdjust)
    }

    useEffect(() => {
        fetchListStation()
        const timer = setInterval(() => {
            fetchListStation();
        }, 60 * 60 * 1000);
        return () => {
            //  coponents unmount
            clearInterval(timer);
            setData(null)
        }
    }, [])

    useEffect(() => {
        const timerChangeStation = setInterval(() => {
            const lengthArr = _.size(arrStationId)
            if (currentStationId === (lengthArr - 1)) {
                setCurrentStationId(0)
                setStationId(arrStationId[0])
                fetchDataHistory(arrStationId[0])
                fetchStationById(arrStationId[0])
            } else {
                setCurrentStationId(currentStationId + 1)
                setStationId(arrStationId[currentStationId + 1])
                fetchDataHistory(arrStationId[currentStationId + 1])
                fetchStationById(arrStationId[currentStationId + 1])
            }
        }, 60 * 1000);
        return () => {
            //  coponents unmount
            clearInterval(timerChangeStation);
            setData(null)
        }
    }, [arrStationId, currentStationId])


    // useEffect(() => {
    //     fetchDataHistory(stationId)
    //     fetchStationById(stationId)
    // }, [arrStationId, stationId])


    // Action fetch data
    const fetchListStation = async () => {
        const url = `${SW}`
        try {
            const res = await getApi(url, '')
            if (res.data.success) {
                const lstStation = _.get(res.data, 'data', [])
                if (_.size(lstStation) > 0) {
                    const newArr = []
                    _.forEach(lstStation, item => {
                        newArr.push(_.get(item, 'id', ''))
                    })
                    setCurrentStationId(0)
                    setArrStationId(newArr)
                    setStationId(newArr[0])
                    fetchDataHistory(newArr[0])
                    fetchStationById(newArr[0])
                }
            } else {
                setTimeout(() => window.location.reload(), 30000)
            }
        } catch (error) {
            setTimeout(() => window.location.reload(), 30000)
        }
    }

    // Action fetch station by id
    const fetchStationById = async (id) => {
        const url = `${SW}/${id}`
        try {
            const res = await getApi(url, '')
            if (res.data.success) {
                setData(res.data.data)
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log('Error', error)
        }
    }

    // Action fetch data history by station
    const fetchDataHistory = async (id) => {
        const body = { station_id: id }
        try {
            const res = await postApi(SW_HISTORY, body, '')
            if (res.success) {
                setDataHistory(res.data)
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log('Error', error)
        }
    }


    // Render time data
    const renderTimeDataAt = (data) => {
        let timeDataAt = ''
        if (data) {
            const newArr = _.values(data)
            const timeNew = _.get(newArr[0], 'get_time', new Date())
            timeDataAt = `${moment(timeNew).format('HH:mm')} ${moment(timeNew).format('DD/MM/YYYY')}`
        }
        return timeDataAt
    }
    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return '#1DCE6C'
            case 3:
                return '#FF2C08'
            case 6:
                return '#FFB951'
            case 5:
                return '#AE45F9'
            case 4:
                return '#C7BCBC'
            default:
                return '#1DCE6C'
        }
    }

    return (
        <Container>
            <ContainerHeader>
                <Header isShowTime={true} />
            </ContainerHeader>
            <ContainerBody>
                <div style={{ display: 'inline-flex', justifyContent: 'space-between', flex: 1, flexDirection: 'column', padding: '10px' }}>
                    {data && <div>
                        <div className='station-title' style={{ background: getStatusColor(_.get(data, 'status', 0)) }}>{_.get(data, 'station_name', '')}</div>
                        <div className="sub-title"> {renderTimeDataAt(_.get(data, 'data', []))}
                            <ClockCircleOutlined style={{ width: '3.5vh' }} />
                        </div>
                        <div className="sub-title" >
                            <div>Thiết bị hoạt động tốt</div>
                            <div className='cirle-div' style={{ background: 'linear-gradient(to right, #1DCE6C, #1d976c)' }} > {numberGood}</div>
                        </div>
                        <div className="sub-title" >
                            <div >Thiết bị lỗi</div>
                            <div className='cirle-div' style={{ background: 'linear-gradient(to right, #FFB951, #FF9800)' }}>{numberError}</div>
                        </div>
                        <div className="sub-title" >
                            <div>Thiết bị hiệu chuẩn</div>
                            <div className='cirle-div' style={{ background: 'linear-gradient(to right, #AE45F9, #6A0DAD)' }}>{numberAdjust}</div>
                        </div>
                    </div>}
                    {data && <CircleChartComponent station={data} />}
                </div>
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                    {data && <BoxIndicator dataStation={data} numderIndicator={_.size(data.indicators)} />}
                    {data && dataHistory && <BoxHightChart dataHistory={dataHistory} dataStation={data} numderIndicator={_.size(data.indicators)} />}
                </div>
            </ContainerBody>
        </Container >
    )
}


const Container = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-image: linear-gradient(to right, #141e30, #243b55);
`

const ContainerHeader = styled.div`
    height: 10%;
    display: contents;
`
const ContainerBody = styled.div`
    height: 90%;
    display: inline-flex;
    flex-direction: row;
`

const BoxHeader = styled.div`
    display: flex;
    flex-direction: column;
`

const TitleTime = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-size: 24px;
    line-height: 40px;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 14px;
        line-height: 15px;
    }
`

export { OneStationNmAutoFetch }
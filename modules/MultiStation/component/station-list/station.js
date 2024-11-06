import React from 'react'
import styled from 'styled-components'
import { Progress } from 'antd';
import * as _ from 'lodash'
import moment from 'moment'
import { useHistory } from "react-router-dom";
import IconCheck from '../../assets/check_circle.svg'
import IconWarning from '../../assets/warning.svg'


const StationComponent = ({ station }) => {
    const history = useHistory();
    const { station_name, address, indicators, last_time, data, status, id } = station
    let lastTimeData = null
    const newArrData = _.values(data)
    let totalExceed = 0
    const total = _.size(indicators)
    const percent = totalExceed === 0 ? 0 : totalExceed / total * 100
    indicators.forEach(({ name }) => {
        if (_.get(data, [name, 'status'], '-') === 3) {
            totalExceed += 1
        }
    });

    _.forEach(newArrData, row => {
        if (_.isEmpty(lastTimeData)) {
            lastTimeData = _.get(row, 'get_time', null)
        } else {
            return;
        }
    })

    const getIndicatorStatusColor = (status, isExceed) => {
        if (isExceed)
            return 'linear-gradient(to right, #FF2C08, #a10e03)'
        switch (status) {
            case 0:
                return 'linear-gradient(to right, #1DCE6C, #1d976c)'
            case 1:
                return 'linear-gradient(to right, #AE45F9, #6A0DAD)'
            case 2:
                return 'linear-gradient(to right, #FFB951, #FF9800)'
            default:
                return 'linear-gradient(to right, #1DCE6C, #1d976c)'
        }
    }

    const renderListMea = () => {
        return (
            <BoxMeasuring>
                {_.size(indicators) <= 8 && _.map(indicators, ind =>
                    <div className="col-3" style={{ padding: '0.5vh' }}>
                        <MeaItem key={ind.key} color={getIndicatorStatusColor(_.get(data, [ind.name, 'status'], 0), _.get(data, [ind.name, 'is_exceed'], true))}>
                            <MeaNameBox>
                                <MeaName>{_.get(ind, 'name', '')}</MeaName>
                                {!_.isEmpty(_.get(ind, 'unit', '')) && <MeaUnit>{_.get(ind, 'unit', '')}</MeaUnit>}
                            </MeaNameBox>
                            <MeaValue>{_.get(data, [_.get(ind, 'name', ''), 'value'], '-')}</MeaValue>
                        </MeaItem>
                    </div>
                )}
                {_.size(indicators) > 8 && _.map(indicators, ind =>
                    <div className="col-2" style={{ padding: '3px' }}>
                        <MeaItem key={ind.key} color={getIndicatorStatusColor(_.get(data, [ind.name, 'status'], 0), _.get(data, [ind.name, 'is_exceed'], true))}>
                            <MeaNameBox>
                                <MeaName>{_.get(ind, 'name', '')}</MeaName>
                                {!_.isEmpty(_.get(ind, 'unit', '')) && <MeaUnit>{_.get(ind, 'unit', '')}</MeaUnit>}
                            </MeaNameBox>
                            <MeaValue>{_.get(data, [_.get(ind, 'name', ''), 'value'], '-')}</MeaValue>
                        </MeaItem>
                    </div>
                )}

            </BoxMeasuring>
        )
    }

    const renderQCVN = () => {
        let text = ''
        const mea = indicators[0]
        if (!_.isEmpty(mea.qcvn_code)) {
            text += mea.qcvn_code
        }
        if (!_.isEmpty(mea.qcvn_detail_type_code)) {
            text += `- Cột ${mea.qcvn_detail_type_code}`
        }
        return text
    }
    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return 'linear-gradient(to right, #1DCE6C, #1d976c)'
            case 3:
                return 'linear-gradient(to right, #FF2C08, #a10e03)'
            case 6:
                return 'linear-gradient(to right, #FFB951, #FF9800)'
            case 5:
                return 'linear-gradient(to right, #AE45F9, #6A0DAD)'
            case 4:
                return 'linear-gradient(to right, #C7BCBC, #999999)'
            default:
                return 'linear-gradient(to right, #1DCE6C, #1d976c)'
        }
    }

    return (
        <BoxStation color={getStatusColor(status)}>
            <StationHeader color={getStatusColor(status)}>
                <Title>{station_name}</Title>
                <TitleSmall>Dữ liệu lúc {moment(lastTimeData).format('DD/MM/YYYY HH:mm')}</TitleSmall>
            </StationHeader>

            <StationContentBody>
                {renderListMea()}
            </StationContentBody>
            {/* <StationContentEnd>
                <StationTimeData>
                    <BoxTitileInfoData>
                        <TitileInfoData>Dữ liệu lúc</TitileInfoData>
                        <TitleSmall>{moment(lastTimeData).format('DD/MM/YYYY HH:mm')}</TitleSmall>
                    </BoxTitileInfoData>
                    <BoxTitileInfoData>
                        <TitileInfoData>QCVN</TitileInfoData>
                        <TitleQCVN>{renderQCVN()}</TitleQCVN>
                    </BoxTitileInfoData>
                </StationTimeData>
                <StationInfoData>
                    <Progress
                        type="circle"
                        className="light-text"
                        strokeColor={'#FF2C08'}
                        trailColor={'#0BA24E'}
                        percent={percent}
                        width={105}
                        format={() => <ProgressTitleBox>
                            <ProgressText>{`${totalExceed}/${total}`}</ProgressText>
                            <TitleSmall>Thông số vượt<br></br>quy chuẩn</TitleSmall>
                        </ProgressTitleBox>}
                    />
                </StationInfoData>
            </StationContentEnd> */}
        </BoxStation>
    )
}


const BoxStation = styled.div`
    display: flex;
    flex-direction: column;
    background: #282F4A;
    justify-content: space-between;
    border: 0.5px solid;
    border-color:  ${(props) => props.color};
    box-sizing: border-box;
    border-radius: 2.0vh;
    height: 31%;
    margin-right: 2.0vh;
    margin-left: 2.0vh;
    margin-top: 1%;
    margin-bottom: 1%;
`

const StationHeader = styled.div`
    border-radius: 2.0vh 2.0vh 0 0;
    display: flex;
    background:  ${(props) => props.color};
    justify-content: space-between;
    align-items: center;
    padding: 1.0vh
    `
const Title = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 3.0vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 15px;
    }
`

const StationContentBody = styled.div`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;
`

const TitleSmall = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 2.5vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 12px;
    }
`

const StationContentEnd = styled.div`
    display: flex;
    flex-direction: row;
    width: 25%;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
`

const StationTimeData = styled.div`
    flex: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const StationInfoData = styled.div`
    padding: 5px;
    flex: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
`

const ProgressTitleBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
`

const ProgressText = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 34px;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 15px;
        line-height: 18px;
    }
`

const BoxTitileInfoData = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 50%;
`

const TitileInfoData = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: #A3A3A3;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 12px;
    }
`



const StationIconCol = styled.div`
    display: flex;
    justify-content: center;
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
    background-color: ${(props) => props.color};
    width: 5%;
    padding: 5px;
    
`
const BoxMeasuring = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const MeaItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0.2vh 1.0vh 0.2vh 1.0vh;
    background: ${(props) => props.color};
    border-radius: 1.2vh;
    color: #FFFFFF;
`

const MeaNameBox = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
const MeaName = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 3.0vh;
    line-height: 3.0vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 8px;
        line-height: 12px;
    }
`
const MeaUnit = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 2.5vh;
    line-height: 2.5vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 6px;
        line-height: 10px;
    }
`
const MeaValue = styled.div`
    font-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 5.0vh;
    line-height: 5.0vh;
    color: #FFFFFF;
    @media (max-width: 900px) {
        font-size: 10px;
        line-height: 12px;
    }
`

export default StationComponent
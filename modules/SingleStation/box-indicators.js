import React, { useEffect, useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import styled from 'styled-components'
import * as _ from 'lodash'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'


const BoxIndicator = ({ dataStation, numderIndicator }) => {
    const { indicators, data } = dataStation
    const [flexBoxSize, setFlexBoxSize] = useState({})
    useEffect(() => {
        renderSizeFlexBox(numderIndicator)
    }, [numderIndicator])


    // Render size flex box
    const renderSizeFlexBox = (number) => {
        if (4 <= number) {
            setFlexBoxSize({ containerWidth: '100%', meaBoxWidth: '23%', meaBoxHeight: '100%' })
        }
        else if (2 < number && number < 4) {
            setFlexBoxSize({ containerWidth: '100%', meaBoxWidth: '23%', meaBoxHeight: '100%' })
        }
        else if (number <= 2) {
            setFlexBoxSize({ containerWidth: '100%', meaBoxWidth: '46%', meaBoxHeight: '100%' })
        }
    }
    const getStatusColor = (status, isExceed) => {
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
    // render Indicatorsuring item
    const renderIndicator = (flexBoxSize, listIndicator) => {
        const { meaBoxWidth, meaBoxHeight } = flexBoxSize
        return (
            <>
                {_.map(listIndicator, mea =>
                    <IndicatorBox color={getStatusColor(_.get(data, [mea.key, 'status'], 0), _.get(data, [mea.key, 'is_exceed'], false))} key={mea.key} width={meaBoxWidth} height='100%'>
                        <IndicatorName>{_.get(mea, 'name', '')}</IndicatorName>
                        {!_.isEmpty(_.get(mea, 'unit', '')) && <IndicatorUnit>{_.get(mea, 'unit', '')}</IndicatorUnit>}
                        <IndicatorValue>{_.get(data, [mea.name, 'value'], '-')}</IndicatorValue>
                    </IndicatorBox>
                )}
            </>
        )
    }

    // render QCVN text
    const renderQCVN = (mea) => {
        let text = ''
        if (!_.isEmpty(mea.qcvn_code)) {
            text += mea.qcvn_code
        }
        if (!_.isEmpty(mea.qcvn_detail_type_code)) {
            text += `- Cột ${mea.qcvn_detail_type_code}`
        }
        return text
    }

    const newArr = _.chunk(indicators, 4)
    return (
        <div style={{ flex: 1 }}>
            <Carousel controls={false} style={{ height: '100%' }}>
                {_.map(newArr, (arr, inx) =>
                    <Carousel.Item interval={5000}>
                        <IndicatorContainerCarousel>
                            {renderIndicator(flexBoxSize, arr)}
                        </IndicatorContainerCarousel>
                    </Carousel.Item>
                )}
            </Carousel>
        </div>
    )
}


const IndicatorContainerCarousel = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    padding: 1.4vh;
`
const IndicatorBox = styled.div`
    display: inline-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: ${(props) => props.width ? props.width : '46%'};
    height: 100%;
    margin: 1.4vh;
    background-image :${(props) => props.color ? props.color : '#282F4A'};
    box-sizing: border-box;
    border-radius: 2.6vh;
    @media (max-width: 1299px) {
        width: 44.5%;
        height: 30%;
        margin: 10px;
    }
    @media (max-width: 909px) {
        width: 42%;
        height: 30%;
        margin: 10px;
    }
`

const IndicatorName = styled.div`
    position: absolute;
    top: 1.5vh;
    left: 1.5vh;
    font-family: sans-serif;
    font-style: normal;
    font-weight: 300;
    max-width: 50%;
    font-size: 3.5vh;
    color: #FFFFFF;
`
const IndicatorUnit = styled.div`
    position: absolute;
    top: 1.2vh;
    right: 1.2vh;
    max-width: 50%;
    font-family: sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 3.5vh;
    color: #FFFFFF;
    @media (max-width: 50%;) {
        font-size: 24px;
        line-height: 22px;
    }
    @media (max-width: 50%;) {
        font-size: 22px;
        line-height: 20px;
    }
`
const IndicatorValue = styled.div`
    font-family: sans-serif;
    padding-top: 2.0vh;
    font-style: normal;
    font-weight: bold;
    font-size: 6.0vh;
    color: #FFFFFF;
    @media (max-width: 1299px) {
        font-size: 32px;
        line-height: 30px;
    }
    @media (max-width: 909px) {
        font-size: 29px;
        line-height: 28px;
    }
`

export default BoxIndicator
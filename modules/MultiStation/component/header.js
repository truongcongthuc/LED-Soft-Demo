import React from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import TimeOclock from './time'
import Logo from '../../../commons/assets/logo.png'
import Background from '../../../commons/assets/map.png'


const styleFlexCenter = { display: 'flex', alignItems: 'center' }
const styleFlexEnd = { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }


const Header = (props) => {
    const { isShowTime } = props

    return (
        <div className="row" style={{ backgroundImage: `url(${Background})`, backgroundColor: '#fff' }}>
            <div className="col-8" style={{ ...styleFlexCenter }}>
                <Avartar src={Logo} />
                <div className="row">
                    <TitleHeader classNameName='col-12'>ALUMIN NHÂN CƠ</TitleHeader>
                </div>
            </div>
            <div className="col-4" style={{ ...styleFlexEnd }}>
                {isShowTime && <div className="row p-3">
                    <HeaderTime classNameName='col-12'>{<TimeOclock />}</HeaderTime>
                </div>}
            </div>
        </div>
    )
}


const TitleHeader = styled.div`
    color: #aa3516;
    font-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 5.5vh;
    @media (max-width: 900px) {
        font-size: 18px;
        line-height: 20px;
    }
`

const HeaderTime = styled.div`
    color: #aa3516;
    ffont-family: sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 3.0vh;
    @media (max-width: 900px) {
        font-size: 14px;
        line-height: 17px;
    }
`

const Avartar = styled.img`
    margin-left: 20px;
    margin-right: 20px;
    width: 8.0vh;
    height: 8.0vh;
    @media (max-width: 900px) {
        width: 40px;
        height: 40px;
    }
`

export default Header
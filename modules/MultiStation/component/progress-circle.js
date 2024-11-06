import React from 'react'
import styled from 'styled-components'
import './progress-circle.css'


const ProgessCircle = (props) => {

    return (
        <Container>
            <div class="progress" data-percentage="20">
                <span class="progress-left">
                    <span class="progress-bar"></span>
                </span>
                <span class="progress-right">
                    <span class="progress-bar"></span>
                </span>
                <div class="progress-value">
                    <div>
                        20%<br></br>
                        <span>Thông số </span><br></br>
                        <span>vượt quy chuẩn</span>
                    </div>
                </div>
            </div>
        </Container>
    )
}

const Container = styled.div`
`

export default ProgessCircle
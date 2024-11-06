import React, {useState, useEffect} from 'react'
import moment from 'moment'
import * as _  from 'lodash'



const dayOfWeek = {
    1: {name: "Thứ 2"},
    2: {name: "Thứ 3"},
    3: {name: "Thứ 4"},
    4: {name: "Thứ 5"},
    5: {name: "Thứ 6"},
    6: {name: "Thứ 7"},
    0: {name: "Chủ nhật"},
}

const TimeOclock = (props) => {
    const {isShowTime} = props
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
          },60 * 1000);
        return () => {
            clearInterval(timer); 
        }
    }, [])

    
    return (
        <div>{`${_.get(dayOfWeek,`[${moment(time).weekday()}].name`)}, ${moment(time).format('DD/MM/YYYY')}, ${moment(time).format('HH:mm')}`}</div>
    )
}




export default TimeOclock
import React, { useEffect } from 'react'
import $ from 'jquery';
import StationComponent from './station'
import * as _ from 'lodash'
import './index.css'


const StationListComponent = (props) => {
    const { stationList } = props
    // useEffect(() => {
    //     var tickerHeight = $('.container-w ul li').outerHeight();
    //     $('.container-w ul li:last-child').prependTo('.container-w ul');
    //     $('.container-w ul').css('marginTop',-tickerHeight);
    //     const timer = setInterval(() => {
    //          moveTop();
    //       },10000);
    //     return () => {
    //         clearInterval(timer); 
    //     }
    // }, [stationList])

    // function moveTop(){
    //     var tickerHeight = $('.container-w ul li').outerHeight();
    //     if(_.size(stationList) > 4) {
    //         $('.container-w ul').animate({
    //             top : -tickerHeight
    //             },300, function(){
    //             $('.container-w ul li:first-child').appendTo('.container-w ul');
    //             $('.container-w ul').css('top','');
    //             });
    //     } else {
    //         console.log('Stop auto move list by size:', _.size(stationList))
    //     }


    // }
    return (
        <>
            {_.map(stationList, item =>
                <StationComponent key={item.id} station={item} />
            )}
        </>
    )
}


export default StationListComponent
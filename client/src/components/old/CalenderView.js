import React, { useState, useEffect, useRef } from 'react'
import CalenderHeader from './CalenderHeader'
import CalenderSide from './CalenderSide'
import { getMonth } from '../../util';
import './Calender.css';

const CalenderView = () =>  {
    const [month, setMonth] = useState(getMonth());
    return (
        <>
            <div classname = "calender-container">
                <CalenderHeader/>
                <div className = "calender-main">
                    <CalenderSide/>
                </div>
            </div>

        </>
    )
}

export default CalenderView;
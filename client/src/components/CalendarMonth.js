import React from 'react'
import './Calender.css'

export default function CalendarMonth([month]) {
  return (
    <div className="month-grid">
        {month.map((row,i) => (
            < React.Fragment key={i}>
                {row.map((day,idx) => {
                    <Day day={day} key={id}/>
                })}
            </React.Fragment>
        ))}
    </div>
  )
}

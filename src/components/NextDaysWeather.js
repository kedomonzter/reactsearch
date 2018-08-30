import React from 'react';
function NextDaysWeather({newLocation, months}) {
    return (
        <div>
            {newLocation === "" 
                // Return weather details for five days after today
                ? "" 
                :   <div>
                        <h2 className='weather__subheading'>Next 5 Days</h2>
                        <div className='weather__next-days'>
                        {newLocation.data.map((day, index) => {
                            return index > 0 && index < 6 
                                ?  <div key={index} className='weather__next-day'>
                                        <div>{months[new Date(day.valid_date).getMonth()] + " " + new Date(day.valid_date).getDate()}</div>
                                        <img className='weather__next-day-image' 
                                            src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`} 
                                            alt={day.weather.description}/>
                                        <div className='weather__next-day-temp'>{day.max_temp}&#176;</div>
                                    </div>
                            : null
                        })}
                        </div>
                </div>
            }
        </div>
    );
}
export default NextDaysWeather;
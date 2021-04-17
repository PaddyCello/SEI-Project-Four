import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CurrentWeather from '../weather/CurrentWeather'
import WeekWeather from '../weather/WeekWeather'
const Weather = () => {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState('current')
  const [viewport, setViewport] = useState('')

  const [locationChoice, setLocationChoice] = useState(null)

  useEffect(() => {
    // console.log(window.navigator)
    window.navigator.geolocation.getCurrentPosition(position => {
      console.log('position', position)
      const { longitude, latitude } = position.coords
      setViewport({ longitude, latitude })
    })
  }, [])

  // This is the request to geocode a place name into long and lat

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/alvechurch.json?access_token=pk.eyJ1IjoiandhcmQwMzk1IiwiYSI6ImNrbXFnM3l3azJvNHgyb256N2U3NGY1NnUifQ.j9Q8uNoEEO0GBonf6TLoew')
      setLocationChoice(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${viewport.latitude}&lon=${viewport.longitude}&exclude=hourly,minutely&appid=c7b22e378e8404d1ac5d214062e5f766`)
      setWeather(data)
    }
    getData()
  }, [viewport])

  const handleWeather = (event) => {
    if (event.target.value === 'current') setForecast('current')
    if (event.target.value === 'week') setForecast('week')
  }

  const weatherForecastFunction = () => {
    if (forecast === 'week') {
      return <WeekWeather
        weather = {weather}
      />
    }
  }
  if (!weather) return 'Loading'

  console.log('LOCATION CHOICE >>>>>>>', locationChoice.features[0].geometry.coordinates)

  return (
    <div>
      <div className="ui buttons">
        <button className="ui button" value="current" onClick={handleWeather}>Today</button>
        <div className="or"></div>
        <button className="ui blue button" value="week" onClick={handleWeather}>7 Day Forecast</button>
      </div>
      {forecast === 'current'
        ? <CurrentWeather
          weather = {weather}
        />
        : weatherForecastFunction()
      }
    </div>

  )
}

export default Weather

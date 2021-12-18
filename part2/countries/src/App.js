import React, { useState, useEffect } from 'react'
import axios from 'axios'



const Search = ({label, value, onChange}) => {
  return (
    <div>
      <label>
        {label}
        <input value={value} onChange={onChange} />
      </label>
    </div>
  )
}


const Weather = ({city}) => {
  const [weather, setWeather] = useState(null)
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [city, api_key])  

  if (weather === null) {
    return <p>Loading weather...</p>
  } 
  else {
    return (
      <div>
        <h3>Weather in {weather.name}</h3>
        <p>
          {weather.weather[0].description} with 
          themperature of: <strong>{weather.main.temp} C</strong>
        </p>
        <strong>Air pressure: </strong> {weather.main.pressure} mb<br />
        <strong>Humidity: </strong>{weather.main.humidity} %<br />
        <strong>Wind speed: </strong>{weather.wind.speed} m/s<br />
      </div>
    )    
  }
}


const ContryInfo = ({countries, searchName, setNewSearchName}) => {

  // filter list of countries
  const filtered = countries.filter(i=> (
    i.name.common
      .toLowerCase()
      .includes(searchName.toLowerCase())
  ))
  
  if (!searchName) {
    // nothing typed
    return <p>Type country name...</p>
  } 
  else if (filtered.length === 0) {
    // or nothing matches query
    return <p>No results found</p>
  }
  else if (filtered.length > 10) {
    // too many matches
    return <p>Too many matches, specify another filter</p>
  } 
  else if (filtered.length > 1) { 
    // returns results that are: 1 < filtered <= 10
    return (
      <ul>{filtered.map(i =>
        <li key={i.cca3}>
          {i.name.common}
          <button onClick={() => setNewSearchName(i.name.common)}>
            show
          </button>
        </li>
      )}</ul>
    )
  }

  // renders a single country
  const languages = filtered[0].languages
  return (
    <div>
      <h1>{filtered[0].name.common}</h1>
      <div>Capital: {filtered[0].capital}</div>
      <div>Population: {filtered[0].population}</div>
      <div>Area: {filtered[0].area}</div>
      <h3>Languages</h3>
      <ul>
        {Object.keys(languages).map(langs => 
          <li key={langs}>{languages[langs]}</li>
        )}
      </ul>
      <img width="130" src={filtered[0].flags.svg} alt="country flag" />
      <Weather 
        city={filtered[0].capital[0]}
      />
    </div>
  )
} 

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchName, setNewSearchName] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  },[])  

  const handleSearch = (event) => {
    setNewSearchName(event.target.value)
  }

  // wait for data to load...
  if (countries.length === 0) {
    return <p>Loading ...</p>
  } 
  else {
    return (
      <div>
        <Search 
          label="filter countries: "
          value={searchName} 
          onChange={handleSearch} 
        />
        <ContryInfo 
          countries={countries} 
          searchName={searchName}
          setNewSearchName={setNewSearchName}
        />
      </div>
    )    
  }

}

export default App
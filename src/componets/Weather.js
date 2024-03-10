import React, { useContext, useState } from 'react';
import userContext from '../context/user_context';
import { useNavigate } from 'react-router-dom';

export default function Weather() {
  const { user, set_user, refreshToken, set_refreshToken } = useContext(userContext)
  const [location, set_location] = useState([]);
  const [inputValue, setInputValue] = useState("")
  const navigate = useNavigate()
  
  // HANDLING WEATHER API CALL
  
  const handle_place = (e) => {
    setInputValue(e.target.value.toLowerCase())                     // [ CONVERTING EVERY ENTRY TO LOWERCASE SO THAT , SO THAT 
  }                                                                 // THERE IS NO DUPLICATES IN LOCAL STORAGE ]

  const enter_place = async () => {
    let inputPlace = inputValue
    
    if(!inputPlace)                                                 // [ IF NO LOCATION IS PROVIDED ]
    {
      alert("NO LOCATION IS PROVIDED")
      return
    }
    if(location.includes(inputPlace))                               // [ IF THE WEATHER CORRESPONDIG TO THE LOCATION IS ALREADY 
    {                                                               // SHOWING ON THE SCREEN ]
      return
    }

    let newPlace = JSON.parse(localStorage.getItem(inputPlace))     // [ GETTING THE ENTRY FROM LOCAL STORAGE ]
    
    if(!newPlace)                                                   // [ GETTING THE ENTRY FROM BACKEND ]
    {
      newPlace = await handlesubmit(inputPlace)
      if(newPlace)
        localStorage.setItem(inputPlace,JSON.stringify(newPlace))
    }
    
    if (newPlace != null) {                                         // [ UPDATING THE CURRENT LIST OF LOCATION BEEN SHOWN ON 
      let temp = location                                           // SCREEN]
      if (temp.length == 4) {
        temp.shift()
      }
      set_location([...temp, newPlace])                             
    }
    setInputValue('')                                                // [ CLEARING THE INPUT BOX ]
  }

  const handlesubmit = async (place) => {                            // [ FETCHING WEATHER FROM BACKEND ]
    console.log(`[FETCHING THE DATA OF ${place}]`)
    try {
      const response = fetch("http://localhost:3030/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/JSON",
          "Authorization": `Bearer ${user}`
        },
        body: JSON.stringify({
          place: place
        })
      })

      if(!(await response).ok)
      {
        set_location([])
        set_user('')
        set_refreshToken('')
        alert("Your Session has ended")
        navigate('/')
      }

      if ((await response).ok) {
        const json = await (await response).json()
        if (json.length == 0)
          return null

        if (json.error != undefined) {
          alert(json.error.message)
          return
        }

        if (json.location != undefined) {
          let tempWeather = {
            city: json.location.name,
            country: json.location.country,
            region: json.location.region,
            icon: json.current.condition.icon,
            text: json.current.condition.text,
            humidity: json.current.humidity,
            temp_c: json.current.temp_c
          }

          return tempWeather
        }
      }
    } catch (error) {
      console.log(error)
      navigate('/')
    }
  }

  // GETTING CURRENT LOCATION

  const GotLocation =(position) =>{
    const lat = position.coords.latitude
    const long = position.coords.longitude
    if(lat && long)
    {
      const temp = String(lat)+","+String(long)
      setInputValue(temp)
    }
  }
  const FailedLocation = () =>{
    console.log("LOCATION REQUEST DENIED")
  }
  const getCurrentLocation = () =>{
    console.log(navigator.geolocation.getCurrentPosition(GotLocation,FailedLocation))
  }

  // COMPONENTS

  return (
    <>
      <div className="container">
        <div className="input-group mb-3">
          <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={inputValue} onChange={handle_place} />
          <button type="button" className="btn btn-light" onClick={enter_place}>Location</button>
          <button type="button" className="btn btn-light" onClick={getCurrentLocation}>Current Location</button>
        </div>
        {location.length === 0 && <div style={{paddingTop : "20%"}}>
          <h1>KNOW UR <span className="badge text-bg-secondary">WEATHER</span></h1>
          <h5>Simple & <span className="badge text-bg-secondary">Precise</span></h5>
          </div>}
        {
          [...location].reverse().map((loc) => (
            <div key={loc.city} className="card" style={{ width: "18rem" }}>
              <img src={loc.icon} className="card-img-top" alt="..." /> 
              <div className="card-body">
                <div className="card-text">
                  <div className="renderPlace">
                    {loc.city} , {loc.region} , {loc.country}
                  </div>
                  <div className="weatherText">
                    {loc.text}
                  </div>
                  <div className="humidity">
                    Humidity : {loc.humidity} %
                  </div>
                  <div className="temp_c">
                    Temp : {loc.temp_c} <sup>*</sup> C
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}

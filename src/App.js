import React, { useState, useEffect } from 'react';
import { FormControl,Select, MenuItem } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map'
import './App.css';

function App() {

  const [countries , setcountries] = useState([]);
  const [country,setcountry]= useState('worldwide');
  useEffect(() => {
// send a request and wait for it
const getCountriesData = async()=> {
  await fetch("https://disease.sh/v3/covid-19/countries")
  .then((response)=>response.json())
  .then((data)=> {
    const countries = data.map((country) => (
      {
        name : country.country,
        value : country.countryInfo.iso2
      }
    ));

    setcountries(countries);
  });
};
getCountriesData();
  } , []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setcountry(countryCode);
  } ;
  return (
    <div className="App">
      <div className ="app_left">
      <div className="app_header">
      <h1>Covid-19 Tracker app</h1>
     <FormControl className="app_dropdown">
       <Select
       variants="outlined"
       onChange ={onCountryChange}
       value={country}
       >
          <MenuItem value="worldwide">WorldWide</MenuItem>
          {
            countries.map((country => (
              <MenuItem value={country.value}>{country.name}</MenuItem>)
            ))
          }
         {/* <MenuItem value="worldwide">WorldWide</MenuItem>
         <MenuItem value="worldwide">opt 1</MenuItem>

         <MenuItem value="worldwide">opt 2</MenuItem>

         <MenuItem value="worldwide">33ide</MenuItem> */}

       </Select>
     </FormControl>
     </div>
     <div className="app_stats">
          <InfoBox title="Coronavirus Cases" cases={200} total ={2000}/>

          <InfoBox title="Recovered" cases = {301} total ={3000}/>

          <InfoBox title="Deaths" cases= {401} total ={4000}/>
     </div>
     

    <Map />
       
    </div>
      </div>
      
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { FormControl,Select, MenuItem, CardContent ,Card} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from'./Table'
import './App.css';
import { sortData } from './util';
import LineGraph  from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {

  const [countries , setcountries] = useState([]);
  const [country,setcountry]= useState('worldwide');
  const [countryInfo , setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] =  useState({lat : 34.80746 , lng : -40.4790});
  const [mapZoom , setMapZoom] = useState(3);


  useEffect (() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data => {
      setCountryInfo(data);
    })
  } , []);
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

    const sortedData = sortData(data);
    setTableData(sortedData);
    setcountries(countries);
  });
};
getCountriesData();
  } , []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setcountry(countryCode);

    const url = 
      countryCode ==='worldwide' 
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        setcountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat , data.countryInfo.long]);
        setMapZoom (4);
    })
  } ;
  return (
    <div className="app">
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
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total ={2000}/>

          <InfoBox title="Recovered" cases = {countryInfo.todayRecovered} total ={3000}/>

          <InfoBox title="Deaths" cases= {countryInfo.deaths} total ={4000}/>
     </div>
     

    <Map
    center = {mapCenter}
    zoom= {mapZoom} 
    />
       
    </div>
    <Card className="app_right">
          <CardContent>
            <h3>Live cases by country </h3>
            <Table countries = {tableData} />
            <h3> WorldWide new cases</h3>
            <LineGraph />
          </CardContent>
    </Card>
      </div>
      
  );
}

export default App;

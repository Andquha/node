import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";

function App() {

  const [data,setData] = useState(null);

  useEffect(async () => {
    await axios.get(`http://api.test-andrew.space/api`,{mode:'cors'})
    .then((response) => {
      setData(response.data.msg);
    });
  },[])
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {
            !data ? "Loading..." : data
          }
        </p>
      </header>
    </div>
  );
}

export default App;

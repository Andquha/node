import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

  const [data,setData] = useState(null);

  useEffect(() => {
    console.log(fetch('/api'))
    fetch('/api')
    .then(response => response.json())
    .then(response => setData(response.message))
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

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [socket] = useState(() => io(':8000'));

  useEffect(() => {
    console.log("Is this running?");
    socket.emit('test', data => console.log(data));
    socket.on('no u', data => {
      console.log("super angry cry face");
    })
    return () => socket.disconnect(true);
  }, [])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;

import React from 'react';

//importing react router
import { BrowserRouter, Route,Routes} from "react-router";
import HomePage from './pages/HomePage.jsx';



const App = () => {
  return (
    <div className='h-screen' data-theme="coffee">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    
</div>
  )
}

export default App
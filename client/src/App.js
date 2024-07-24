import React from 'react'
import Home from './components/Home'
import Tracking from './components/Tracking'
import Identification from './components/Identification'

const App =() => {
  // set up routes to all other pages
  return (
    <>
      <Home/>
    </>
  )
}
/**
 *       <Routes>
        <Route path="/" element ={<Home/>}/>
        <Route path="/track" element={<Tracking/>}/>
        <Route path="/identify" element={<Identification/>} />
      </Routes>
 */

export default App;

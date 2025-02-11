import React from 'react'
import { Outlet } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='layout'>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>  
  )
}

export default Navbar
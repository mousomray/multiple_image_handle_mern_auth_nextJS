import React from 'react'
import Navbar from './Navbar'

const Wrapper = ({children}) => {
  return (
    <>
      <Navbar/>
      {children}
    </>
  )
}

export default Wrapper
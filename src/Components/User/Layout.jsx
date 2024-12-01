import React from 'react'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'

const Layout = ({children}) => {
  return (
    <div>
      {/* <Header /> */}
      {children}
      <Footer />
      <Toaster />
    </div>
  )
}

export default Layout

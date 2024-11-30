

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminRoutes, GeneralRoutes } from './routes'
import Loader from './Components/General/Loader'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {GeneralRoutes.map((item, index) => (
        <Route key={index} path={`/${item.path}`} element={ <Loader><item.element /> </Loader>  } />
      ))}
      {AdminRoutes.map((item, index) => (
        <Route key={index} path={`/auth/admin/${item.path}`} element={ <Loader> <item.element /> </Loader> } />
      ))}
    </Routes>
    </BrowserRouter>
  )
}

export default App
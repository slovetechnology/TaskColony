

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminNoRoutes, AdminRoutes, GeneralNoAuth, GeneralRoutes } from './routes'
import Loader from './Components/General/Loader'
import AppWrapper from './Private/AppWrapper'
import AdminRoute from './Private/AdminRoute'
import UserRoute from './Private/UserRoutes'

function App() {
  return (
    <BrowserRouter>
      <AppWrapper >
        <Routes>
          {GeneralRoutes.map((item, index) => (
            <Route key={index} path={`/${item.path}`} element={<UserRoute> <Loader><item.element /> </Loader></UserRoute>} />
          ))}
          {GeneralNoAuth.map((item, index) => (
            <Route key={index} path={`/${item.path}`} element={<> <Loader><item.element /> </Loader></>} />
          ))}

          {AdminRoutes.map((item, index) => (
            <Route key={index} path={`/auth/admin/${item.path}`} element={<AdminRoute> <Loader> <item.element /> </Loader></AdminRoute>} />
          ))}
          {AdminNoRoutes.map((item, index) => (
            <Route key={index} path={`/auth/admin/${item.path}`} element={<> <Loader> <item.element /> </Loader></>} />
          ))}
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  )
}

export default App
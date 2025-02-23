import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminNoRoutes, AdminRoutes, GeneralNoAuth, GeneralRoutes } from './routes';
import Loader from './Components/General/Loader';
import AppWrapper from './Private/AppWrapper';
import AdminRoute from './Private/AdminRoute';
import UserRoute from './Private/UserRoutes';
import GeoBlock from '../GeoRestrictedPage';


function App() {
  return (
    <BrowserRouter>
      <AppWrapper >
        <Routes>
          {/* Wrap General Routes with GeoBlock */}
          {GeneralRoutes.map((item, index) => (
            <Route
              key={index}
              path={`/${item.path}`}
              element={
                <GeoBlock>
                  <UserRoute>
                    <Loader>
                      <item.element />
                    </Loader>
                  </UserRoute>
                </GeoBlock>
              }
            />
          ))}

          {/* Other routes */}
          {GeneralNoAuth.map((item, index) => (
            <Route
              key={index}
              path={`/${item.path}`}
              element={
                <GeoBlock>
                  <Loader>
                    <item.element />
                  </Loader>
                </GeoBlock>
              }
            />
          ))}

          {/* Admin Routes */}
          {AdminRoutes.map((item, index) => (
            <Route
              key={index}
              path={`/auth/admin/${item.path}`}
              element={
                <AdminRoute>
                  <GeoBlock>
                    <Loader>
                      <item.element />
                    </Loader>
                  </GeoBlock>
                </AdminRoute>
              }
            />
          ))}
          
          {/* Admin No Auth Routes */}
          {AdminNoRoutes.map((item, index) => (
            <Route
              key={index}
              path={`/auth/admin/${item.path}`}
              element={
                <GeoBlock>
                  <Loader>
                    <item.element />
                  </Loader>
                </GeoBlock>
              }
            />
          ))}
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;

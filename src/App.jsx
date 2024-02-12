import { useState } from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ManageEvents from './pages/Admin/manageEvents'
import ManageAdmin from './pages/manageAdmin'
import { Event } from './pages/event'
import ManagePhotographer from './pages/Admin/ManagePhotographer'

function App() {

  return (
    <>
      <Routes>
         <Route path='/' Component={Login} /> 
          <Route path='/home' Component={Home} /> 
         <Route path='/manageevents' Component={ManageEvents} />
         <Route path='/manageAdmin' Component={ManageAdmin} />
         <Route path='/event' Component={Event} />
         <Route path='/manage-photographer' Component={ManagePhotographer} />
         <Route path='/manage-admin' Component={ManageAdmin} />


      </Routes>
    </>
  )
}

export default App

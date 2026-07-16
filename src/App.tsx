import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Dashboard from './pages/accountant/Dashboard'


import './App.css'

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element= {<Dashboard />}/>
      </Routes>
    </BrowserRouter>
    
     
    </>
  )
}

export default App

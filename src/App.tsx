import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Dashboard from './pages/accountant/Dashboard'
import store from './store'
import { Provider } from 'react-redux'



import './App.css'
import Login from './pages/Login'

function App() {


  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element= {<Login />}/>
        <Route path='/dashboard' element= {<Dashboard />}/>
      </Routes>
    </BrowserRouter>
    
     </Provider>
    </>
  )
}

export default App

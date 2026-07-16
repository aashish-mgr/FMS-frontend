import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Dashboard from './pages/accountant/Dashboard'
import store from './store'
import { Provider } from 'react-redux'

import './App.css'

function App() {


  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element= {<Dashboard />}/>
      </Routes>
    </BrowserRouter>
    
     </Provider>
    </>
  )
}

export default App

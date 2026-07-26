import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Dashboard from './pages/accountant/Dashboard'
import IncomePage from './pages/accountant/Income'
import ExpensePage from './pages/accountant/Expense'
import NotesPage from './pages/accountant/Notes'
import RemindersPage from './pages/accountant/Reminders'
import AuditLog from './pages/accountant/AuditLog'
import ReportsPage from './pages/accountant/Report'
import store from './store'
import { Provider } from 'react-redux'
import { useEffect } from 'react'



import './App.css'
import Login from './pages/Login'
import { useRefreshMutation } from './store/api/authApi'

function App() {
  // const [refresh] = useRefreshMutation();
  // useEffect(() => {
  //    refresh();
  // }, [])
  

  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element= {<Login />}/>
        <Route path='/dashboard' element= {<Dashboard />}/>
        <Route path='/income' element= {<IncomePage />} />
        <Route path='/expense' element= {<ExpensePage />} />
        <Route path='/notes' element= {<NotesPage />} />
        <Route path='/reminders' element= {<RemindersPage />} />
        <Route path='/audit' element= {<AuditLog />} />
        <Route path='/report' element= {<ReportsPage />} />
        </Routes>
    </BrowserRouter>
    
     </Provider>
    </>
  )
}

export default App

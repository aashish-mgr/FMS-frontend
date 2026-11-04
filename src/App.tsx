import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import Dashboard from './pages/accountant/Dashboard'
import IncomePage from './pages/accountant/Income'
import ExpensePage from './pages/accountant/Expense'
import NotesPage from './pages/accountant/Notes'
import RemindersPage from './pages/accountant/Reminders'
import AuditLog from './pages/accountant/AuditLog'
import ReportsPage from './pages/accountant/Report'
import MembersPage from './pages/accountant/Members'
import WorkspaceSettings from './pages/accountant/WorkspaceSettings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AcceptInvitation from './pages/AcceptInvitation'

import store, { type RootState, type AppDispatch } from './store'
import { initializeAuth } from './store/slices/authSlice'

import './App.css'

function AppContent() {
  const dispatch = useDispatch<AppDispatch>()
  const isInitializing = useSelector((state: RootState) => state.auth.isInitializing)
  const workspaceName = useSelector((state: RootState) => state.auth.tenant?.name)

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    const name = workspaceName?.trim()
    document.title = name ? `${name} · FMS` : 'FMS'
  }, [workspaceName])

  if (isInitializing) {
    return <p>Loading...</p>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/accept-invitation' element={<AcceptInvitation />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/income' element={<IncomePage />} />
        <Route path='/expense' element={<ExpensePage />} />
        <Route path='/notes' element={<NotesPage />} />
        <Route path='/reminders' element={<RemindersPage />} />
        <Route path='/members' element={<MembersPage />} />
        <Route path='/workspace-settings' element={<WorkspaceSettings />} />
        <Route path='/audit' element={<AuditLog />} />
        <Route path='/report' element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App    
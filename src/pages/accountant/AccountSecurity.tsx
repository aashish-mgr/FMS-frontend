import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import {
  useChangePasswordMutation,
  useLogoutAllMutation
} from '../../store/api/authApi'
import { clearAuth } from '../../store/slices/authSlice'
import { getApiErrorMessage } from '../../lib/getApiErrorMessage'

export default function AccountSecurity() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [logoutAll, { isLoading: isLoggingOutAll }] = useLogoutAllMutation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'currentPassword') setCurrentPassword(value)
    if (name === 'newPassword') setNewPassword(value)
    if (name === 'confirmPassword') setConfirmPassword(value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess('Your password has been changed.')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not change your password. Please try again.'))
    }
  }

  const handleLogoutAll = async () => {
    if (!window.confirm('Log out of every device, including this one?')) {
      return
    }

    try {
      await logoutAll().unwrap()
    } catch (error) {
      console.error('Logout all failed:', error)
    } finally {
      dispatch(clearAuth())
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 max-w-3xl">
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-ink">Account security</h2>
            <p className="text-sm text-muted mt-1">
              Change the password you use to sign in to this workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-line rounded-xl p-5 space-y-4"
          >
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-ink mb-1">
                Current password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                value={currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full border border-line rounded-lg h-10 px-3 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-indigo/40"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-ink mb-1">
                New password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                minLength={8}
                maxLength={72}
                value={newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full border border-line rounded-lg h-10 px-3 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-indigo/40"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={8}
                maxLength={72}
                value={confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full border border-line rounded-lg h-10 px-3 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-indigo/40"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-700 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Changing password...' : 'Change password'}
            </button>
          </form>

          <section className="mt-5 bg-card border border-line rounded-xl p-5">
            <h3 className="font-display text-base font-semibold text-ink">Active sessions</h3>
            <p className="text-sm text-muted mt-1 mb-4">
              Changing your password signs out other devices. You can also sign out every device manually.
            </p>
            <button
              type="button"
              onClick={handleLogoutAll}
              disabled={isLoggingOutAll}
              className="border border-negative/30 text-negative rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-negative-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOutAll ? 'Signing out...' : 'Log out of all devices'}
            </button>
          </section>
        </main>
      </div>
    </div>
  )
}

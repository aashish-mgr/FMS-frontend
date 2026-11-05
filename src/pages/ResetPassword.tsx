import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useResetPasswordMutation } from '../store/api/authApi'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [userPassword, setUserPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'userPassword') {
      setUserPassword(event.target.value)
    } else {
      setConfirmPassword(event.target.value)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError('This password reset link is invalid. Request a new one.')
      return
    }

    if (userPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await resetPassword({ token, userPassword }).unwrap()
      setSuccess(true)
      setUserPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          'Could not reset your password. The link may be invalid or expired.'
        )
      )
    }
  }

  return (
    <div className="flex justify-center align-center flex-col mt-20 gap-5 shadow-lg container w-[90vw] max-w-md min-h-[55vh] mx-auto p-5">
      <h1 className="text-xl text-center font-bold">Reset password</h1>

      {!token && (
        <p className="text-red-600 text-sm m-2">
          This password reset link is missing its token. Request a new link from the login page.
        </p>
      )}

      {success ? (
        <div className="space-y-3">
          <p className="text-green-700 text-sm">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Link
            to="/"
            className="block w-full bg-[#12161c] text-white h-10 leading-10 text-center rounded hover:bg-[#2A2E33]"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userPassword" className="font-bold">
              New password
            </label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              required
              minLength={8}
              maxLength={72}
              value={userPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="font-bold">
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
              className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm m-2">{error}</p>}

          <button
            className="w-full bg-[#12161c] text-white h-10 rounded m-2 cursor-pointer hover:bg-[#2A2E33] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading || !token}
          >
            {isLoading ? 'Resetting...' : 'Reset password'}
          </button>

          <p className="m-2 text-sm">
            <Link to="/" className="text-blue-700 hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}

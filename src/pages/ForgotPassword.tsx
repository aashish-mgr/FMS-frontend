import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useForgotPasswordMutation } from '../store/api/authApi'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [userEmail, setUserEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await forgotPassword({ userEmail }).unwrap()
      setSuccess(
        'If an account with that email exists, a password reset link has been sent. Check your inbox and spam folder.'
      )
      setUserEmail('')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not request a password reset. Please try again.'))
    }
  }

  return (
    <div className="flex justify-center align-center flex-col mt-20 gap-5 shadow-lg container w-[90vw] max-w-md min-h-[50vh] mx-auto p-5">
      <h1 className="text-xl text-center font-bold">Forgot password</h1>
      <p className="text-sm text-center text-muted">
        Enter the email for your account and we&apos;ll send a reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userEmail" className="font-bold">
            Email
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            required
            value={userEmail}
            onChange={handleChange}
            autoComplete="email"
            className="border border-gray-500 w-full m-2 rounded h-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm m-2">{error}</p>}
        {success && <p className="text-green-700 text-sm m-2">{success}</p>}

        <button
          className="w-full bg-[#12161c] text-white h-10 rounded m-2 cursor-pointer hover:bg-[#2A2E33] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>

        <p className="m-2 text-sm">
          <Link to="/" className="text-blue-700 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  )
}

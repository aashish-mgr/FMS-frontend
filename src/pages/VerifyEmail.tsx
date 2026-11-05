import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useVerifyEmailMutation } from '../store/api/authApi'
import { setAuthCredentials } from '../store/slices/authSlice'
import type { RootState } from '../store'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [verifyEmail] = useVerifyEmailMutation()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const requested = useRef(false)

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    if (!token) {
      setStatus('error')
      setMessage('This verification link is missing its token.')
      return
    }

    verifyEmail({ token })
      .unwrap()
      .then((result) => {
        setStatus('success')
        setMessage('Your email has been verified.')

        if (currentUser) {
          dispatch(
            setAuthCredentials({
              ...currentUser,
              emailVerifiedAt: result.emailVerifiedAt
            })
          )
        }
      })
      .catch((error) => {
        setStatus('error')
        setMessage(
          getApiErrorMessage(
            error,
            'This verification link is invalid or has expired.'
          )
        )
      })
  }, [currentUser, dispatch, token, verifyEmail])

  return (
    <div className="flex justify-center align-center flex-col mt-20 gap-5 shadow-lg container w-[90vw] max-w-md min-h-[45vh] mx-auto p-5">
      <h1 className="text-xl text-center font-bold">Email verification</h1>

      {status === 'loading' && (
        <p className="text-sm text-center text-muted">Verifying your email...</p>
      )}

      {status === 'success' && (
        <p className="text-green-700 text-sm text-center">{message}</p>
      )}

      {status === 'error' && (
        <p className="text-red-600 text-sm text-center">{message}</p>
      )}

      <p className="m-2 text-sm text-center">
        <Link to="/" className="text-blue-700 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}

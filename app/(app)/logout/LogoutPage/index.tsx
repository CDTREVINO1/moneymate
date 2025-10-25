'use client'

import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'

import { useAuth } from '../../_providers/Auth'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Logged out successfully.')
      } catch (_) {
        setError('You are already logged out.')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <Fragment>
      {(error || success) && (
        <div>
          <h1 className="text-primary text-2xl font-bold">
            {error || success}
          </h1>
          <p>
            {"What would you like to do next? "}
            <br />
            <Link className="underline hover:text-primary" href="/">
              Click here
            </Link>
            {` to go to the home page. To log back in, `}
            <Link className="underline hover:text-primary" href="/login">
              click here
            </Link>
            .
          </p>
        </div>
      )}
    </Fragment>
  );
}

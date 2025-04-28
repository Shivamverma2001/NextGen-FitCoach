"use client";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      HomePage
      <SignedOut>
        <SignInButton mode="modal"/>
      </SignedOut>
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
    </div>
  )
}

export default HomePage
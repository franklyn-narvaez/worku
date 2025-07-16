"use client";
import React from 'react'
import { signOut } from 'next-auth/react'

function Home() {
  return (
    <section className='h-[calc(100vh-7rem)] flex justify-center items-center'>
        <div>
            <h1 className='text-white text-5xl'>Home page</h1>
        </div>
    </section>
  )
}

export default Home
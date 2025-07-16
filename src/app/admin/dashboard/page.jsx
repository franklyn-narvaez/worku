"use client";
import React from 'react'
import { signOut } from 'next-auth/react'

function DashboardPage() {
  return (
    <section className='h-[calc(100vh-7rem)] flex justify-center items-center'>
      <div>
        <h1 className='text-white text-5xl'>Dashboard</h1>
        <button className='bg-red-500 text-white p-3 rounded-lg mt-4'
          onClick={() => signOut()}
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  )
}

export default DashboardPage
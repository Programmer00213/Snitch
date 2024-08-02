import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <article className='flex flex-col gap-5 justify-center items-center flex-1 px-10 text-center'>
        <h1 className='text-3xl md:text-4xl'>Welcome To Snitch</h1>
        <p className='text-sm md:text-lg'>Get The Latest Scoop Of Secrets, Warning The Secret Can Be Yours</p>
        <div>
            <Link to="/register" className='text-md md:text-lg border-2 p-1 rounded-md hover:bg-black hover:text-white border-black duration-200'>Register Now</Link>
        </div>
    </article>
  )
}

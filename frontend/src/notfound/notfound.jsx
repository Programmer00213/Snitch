import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Loader} from '../utilities/utilities';

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(()=>{
    setTimeout(()=>{navigate("/")},1000)
  },[])
  return (
    <div className="flex flex-col fixed top-1/2 left-1/2 justify-center items-center gap-y-7 -translate-x-1/2 -translate-y-1/2">
      <Loader/>
      <h1 className="text-4xl">Not Found</h1>
    </div>
  )
}

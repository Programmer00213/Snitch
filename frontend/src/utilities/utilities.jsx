import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectStatusMessage, setActivityStatus } from '../feature/slice/userAuthSlice';
import { FaInfoCircle } from "react-icons/fa";
//import { resetStatus } from '../feature/slice/userAuthSlice';

export function ShowStatus({ status, message }) {

  const [show, setShow] = useState(false)
  const dispatch = useDispatch()
  let borderColor=''

  if (status == "idle"){}

  if (status == "pending"){
    borderColor='border-yellow-500'
  }
  if (status == "success") {
    borderColor='border-green-500'
  }
  if(status == "rejected"){
    borderColor='border-red-500'
  }

  
  useEffect(() => {
    let timeoutId;
    if(status != "idle") setShow(true)
    timeoutId = setTimeout(() => {
      setShow(false)
      dispatch(setActivityStatus({status:"idle", message:message}))
    }, 1500)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [status])
  
  return (
    <section className={`fixed right-0 bg-white z-10 border-b-4 ${borderColor} px-5 pr-16 py-5 bottom-10 shadow-lg flex justify-center items-center ${show?"-translate-x-1":"translate-x-full"} duration-300`}>
      <p className='flex items-center gap-x-10'><FaInfoCircle/>{message}</p>
    </section>
  )
}

// initial Value takes the initial state of overflow you want for your element
export function useShowHidden(id, initialValue) {
  const [overflow, Set] = useState(false)
  const [isHidden, setHidden] = useState(initialValue)
  useEffect(() => {
    if (id.current.scrollHeight > id.current.clientHeight) {
      Set(true)
    }
    else {
      Set(false)
    }
  }, [])
  return [overflow, isHidden, setHidden]
}

export function useSetForm(initialState) {

  const [formData, setFormData] = useState(initialState)
 
  const handleChange = (eventObject) => {
    const { name, value, type, checked } = eventObject.target
   
    if (type === "checkbox") {
      setFormData({
        ...formData, checkbox: {
          ...formData.checkbox, [name]: checked
        }
      })
    }
    else if (type === "file") {
      setFormData({
        ...formData, [name]: eventObject.target.files[0]
      })
    }
    else {
     
      setFormData({ ...formData, [name]: value })
    }
  }
  const handleSubmit = (eventObject, callBack, clearForm) => {
    eventObject.preventDefault()

    if (callBack) {
      callBack()
    }

    if(clearForm) setFormData(initialState)
  }

  /* the clearForm parameter to specify that the form is to be reset to initial state or not*/
  function handleSubmitWrapper(callBack, clearForm = true) {
    return function (eventObject) {
      handleSubmit(eventObject, callBack, clearForm)
    }
  }

  return [formData, handleSubmitWrapper, handleChange, setFormData]
}

export function Loader() {
  return (
    <div className="w-16 h-16 border-4 border-black animate-spin">
      
    </div>
  )
}

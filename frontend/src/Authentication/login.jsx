import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSetForm } from "../utilities/utilities";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../feature/slice/authSlice";
import { setActivityStatus, setCredentials } from "../feature/slice/userAuthSlice";

const initialState = {
  email: '',
  password: '',
}

export default function Login() {

  const [login, state] = useLoginMutation()

  const [formData, handleSubmit, handleChange] = useSetForm(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const callback = async () => {
    dispatch(setActivityStatus({ status: "pending", message: "Pending" }))
    await login(formData).unwrap().then((result) => {
      dispatch(setCredentials({ ...result }))
      navigate("/posts", { replace: true })
      dispatch(setActivityStatus({ status: "success", message: "Success"}))
    }).catch((error) => {
      console.log(error)
      dispatch(setActivityStatus({ status: "rejected", message: error.data}))
    })

  }

  return (
    <div className="flex px-5 flex-1 flex-col items-center my-10 md:px-8 lg:px-52">
      <h1 className="text-2xl mb-3.5">Login</h1>
      <form className="w-full" onSubmit={handleSubmit(callback)}>
        <div className="flex flex-col border-slate-700 border-2 p-3 rounded-md">
          <fieldset className="border border-slate-700 p-2 rounded-md">
            <legend className="text-md">Email</legend>
            <input type="email" autoComplete="off" placeholder="Enter Your Email" value={formData.email} onChange={handleChange} className="outline-none w-full" name="email" />
          </fieldset>

          <fieldset className="border border-slate-700 p-2 rounded-md mb-3.5">
            <legend className="text-md">Password</legend>
            <input type="password" placeholder="Enter Your Password" value={formData.password} onChange={handleChange} className="outline-none w-full" name="password" />
          </fieldset>
          <button type="submit" className="text-md border-slate-700 border rounded-md py-2 hover:bg-black hover:text-white duration-200">Login</button>
        </div>
        <p className="text-center mt-1.5">if you donot have a account <Link className="underline underline-offset-5" to="/register">Register</Link></p>
        {/* <div className="flex justify-center py-3 gap-x-5">
          <button className="text-2xl" type="submit"><FaGoogle /></button>
          <button className="text-2xl" type="submit"><FaFacebook /></button>
        </div> */}
      </form>
    </div>
  )
}

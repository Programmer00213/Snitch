import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { useSetForm } from "../utilities/utilities";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../feature/slice/authSlice";
import { useDispatch } from "react-redux";
import { setActivityStatus } from "../feature/slice/userAuthSlice";

const initialState = {
    name: '',
    email: '',
    password: '',
    cpassword: '',
}

export default function Register() {

    const navigate = useNavigate()

    const [register] = useRegisterMutation()

    const [formData, handleSubmit, handleChange] = useSetForm(initialState)
    const dispatch = useDispatch()

    const callback = async () => {

        if (formData.password === formData.cpassword) {
            const { cpassword, ...data } = formData
            dispatch(setActivityStatus({ status: "pending", message: "Pending" }))
            await register(data).unwrap().then(() => {
                dispatch(setActivityStatus({ status: "success", message: "Success" }))
                navigate("/login/", { replace: true })
            }).catch((error) => {
                console.log(error)
                dispatch(setActivityStatus({ status: "rejected", message: error.data }))
            })
          
        }
        else{
            dispatch(setActivityStatus({ status: "rejected", message: "Confirm Password Does Not Match" }))
        }
    }

    return (
        <div className="flex flex-1 flex-col items-center my-10 px-5 md:px-8 lg:px-52">
            <h1 className="text-2xl mb-3.5">Register</h1>
            <form className="w-full" onSubmit={handleSubmit(callback)}>
                <div className="flex flex-col border-slate-500 border-2 p-3 rounded-md">
                    <fieldset className="border border-slate-500 p-2 rounded-md">
                        <legend className="text-md">Name</legend>
                        <input autoComplete="off" type="text" placeholder="Enter Your Name" value={formData.name} onChange={handleChange} className="outline-none w-full" name="name" />
                    </fieldset>
                    <fieldset className="border border-slate-500 p-2 rounded-md">
                        <legend className="text-md">Email</legend>
                        <input autoComplete="off" type="text" placeholder="Enter Your Email" value={formData.email} onChange={handleChange} className="outline-none w-full" name="email" />
                    </fieldset>
                    <fieldset className="border border-slate-500 p-2 rounded-md">
                        <legend className="text-md">Password</legend>
                        <input type="password" placeholder="Enter Your Password" value={formData.password} onChange={handleChange} className="outline-none w-full" name="password" />
                    </fieldset>
                    <fieldset className="border border-slate-500 p-2 rounded-md mb-3.5">
                        <legend className="text-md">Confirm Password</legend>
                        <input type="password" placeholder="Confirm Your Password" value={formData.cpassword} onChange={handleChange} className="outline-none w-full" name="cpassword" />
                    </fieldset>

                    <button className="text-md border border-slate-500 rounded-md py-2 hover:bg-black hover:text-white duration-200" type="submit">Register</button>
                </div>
                {/* <div className="flex justify-center py-5 gap-x-5">
                    <button className="text-2xl" type="submit"><FaGoogle /></button>
                    <button className="text-2xl" type="submit"><FaFacebook /></button>
                </div> */}
            </form>
        </div>
    )
}
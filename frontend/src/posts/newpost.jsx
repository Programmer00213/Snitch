import React, { useState } from 'react'
import { useSetForm } from '../utilities/utilities'
import { useAddPostMutation } from '../feature/slice/postSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserName, setActivityStatus } from '../feature/slice/userAuthSlice'

const initialState = {
    title: '',
    content: '',
    type: "post"
}

const postType = [
    { name: "type", value: "Secret" },
    { name: "type", value: "Declaration" },
    { name: "type", value: "Confession" },
    { name: "type", value: "Post" },
]


export default function NewPost() {

    const [showUserName, setShowUserName] = useState(false)
    const userName = useSelector(selectUserName)

    const [formData, handleSubmit, handleChange] = useSetForm(initialState)

    //isLoading 
    const [addPost, state] = useAddPostMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const callBack = async () => {
        if (showUserName) {
            formData.author = userName
        }
        dispatch(setActivityStatus({ status: "pending", message: "Pending" }))
        await addPost(formData).unwrap().then((result) => {
            dispatch(setActivityStatus({ status: "success", message: "Success" }))
        }).catch((error) => {
            dispatch(setActivityStatus({ status: "rejected", message: "Failed To Create Post" }))
        })
        navigate("/posts")
    }

    return (
        <div className="flex flex-1 flex-col items-center my-10 px-5 md:px-8 lg:px-52">
            <h1 className="text-2xl mb-3.5">New Post</h1>
            <form className="border-2 p-3 border-slate-500 rounded-md flex flex-col w-full" onSubmit={handleSubmit(callBack)}>
                <fieldset className="border border-slate-500 p-2 rounded-md">
                    <legend className="text-md">Title</legend>
                    <input className="outline-none w-full" type="text" value={formData.title} placeholder="Enter The Title Of Your Post" name="title" onChange={handleChange} />
                </fieldset>
                <fieldset className="border border-slate-500 p-2 rounded-md mb-3.5">
                    <legend className="text-md">Content</legend>
                    <textarea className="outline-none w-full h-24" name="content" value={formData.content} placeholder="Enter The Content Of Your Post" onChange={handleChange}>

                    </textarea>
                </fieldset>
                <fieldset className="border border-slate-500 p-2 rounded-md mb-3.5 flex gap-x-1 md:gap-x-5">
                    <legend className="text-md">Type</legend>
                    {postType.map((data, id) => {
                        return <button key={id} type="button" onClick={handleChange} name={data.name} value={data.value.toLowerCase()} className={`text-md p-1 w-full border border-slate-500 rounded-md py-2 hover:bg-black hover:text-white duration-200 ${formData.type == data.value.toLowerCase() ? 'bg-black text-white ' : ''}`}>{data.value}</button>
                    })}
                </fieldset>
                <div className="mb-3.5 flex justify-centerm items-center">
                    <label>Show User Name: </label><input onClick={() => setShowUserName(!showUserName)} className="w-5 h-5 ml-3 accent-red-500" type="checkbox" />
                </div>
                <button className="text-md border border-slate-500 rounded-md py-2 hover:bg-black hover:text-white duration-200" type="submit">Post</button>
            </form>
        </div>
    )
}

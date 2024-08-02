import React, { useEffect, useState } from 'react'
import { useSetForm } from '../utilities/utilities'
import { useGetUserPostQuery, usePatchPostMutation } from '../feature/slice/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUserName, setActivityStatus } from '../feature/slice/userAuthSlice';

const postType = [
    { name: "type", value: "Secret" },
    { name: "type", value: "Declaration" },
    { name: "type", value: "Confession" },
    { name: "type", value: "Post" },
]

export default function EditPost() {

    const { id } = useParams()
    const dispatch = useDispatch()

    const [showUserName, setShowUserName] = useState(false)
    const userName = useSelector(selectUserName)

    const { data: post, isLoading, isSuccess, isError } = useGetUserPostQuery({ userName: userName, postId: id })

    const [formData, handleSubmit, handleChange, setFormData] = useSetForm()
    const [patchPost] = usePatchPostMutation()
    const navigate = useNavigate()

    const callBack = async () => {
        formData.author = showUserName ? userName : "Anonymous"
    
        dispatch(setActivityStatus({ status: "pending", message: "Pending" }))
        await patchPost({ data: formData, id: id }).unwrap().then(() => {
            dispatch(setActivityStatus({ status: "success", message: "Success"}))
        }).catch((err) => {
            dispatch(setActivityStatus({ status: "rejected", message: "Failed To Edit Post"}))
        })
        navigate("/profile")
    }

    useEffect(() => {
        if (post) {
            console.log(post)
            post.entities[id].author != "Anonymous"?setShowUserName(true):setShowUserName(false)

            setFormData({
                title: post.entities[id].title,
                content: post.entities[id].content,
                type: post.entities[id].type,
            })
        }
    }, [post])

    if (isLoading) {
        return <h1>isLoading...</h1>
    }
    if (isError) {
        return <h1>isError</h1>
    }
    if (isSuccess) {
        return (
            <>
                <div className="flex flex-1 flex-col items-center my-10 px-5 md:px-8 lg:px-52">
                    <h1 className="text-2xl mb-3.5">Edit Post</h1>
                    {formData ?
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
                                <label>Show User Name: </label><input checked={showUserName} onChange={() => setShowUserName(!showUserName)} className="w-5 h-5 ml-3 accent-red-500" type="checkbox" />
                            </div>
                            <button className="text-md border border-slate-500 rounded-md py-2 hover:bg-black hover:text-white duration-200" type="submit">Submit</button>
                        </form> : ''
                    }
                </div>
            </>

        )
    }
}

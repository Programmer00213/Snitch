import React from 'react'
import profile from '../assets/profile.png'
import PostLayout from '../posts/postLayout'
import { useSelector } from 'react-redux'
import { useGetUserPostQuery} from '../feature/slice/postSlice'
import { Edit } from '../posts/postLayout'
import { selectUserName } from '../feature/slice/userAuthSlice'

export default function Profile() {

  const userName = useSelector(selectUserName)
  const {data:userPost, error, isLoading} = useGetUserPostQuery({userName})

  return (
    <main className="flex flex-col px-5 justify-center items-center md:px-8 lg:px-10">
        <h1 className="text-2xl my-5">User Profile</h1>
        <article className="flex w-full justfiy-center items-center border-2 border-slate-300 rounded-md mb-5">
            <img src={profile} className='w-24 h-24 mr-2' alt="profile"/>
            <div>
                <p className="mb-2 lg:mr-5">User: {userName}</p>
                <button className="text-md border-slate-700 border rounded-md py-1 px-1.5 hover:bg-black hover:text-white duration-200">Change Password</button>
                <button className="text-md border-slate-700 border ml-5 rounded-md py-1 px-1.5 hover:bg-black hover:text-white duration-200">Logout</button>
            </div>
        </article>
        <div className="flex gap-x-2 mb-5">
            <button className="text-md border-slate-700 border rounded-md py-1 px-1.5 hover:bg-black hover:text-white duration-200">My Posts</button>
            <button className="text-md border-slate-700 border rounded-md py-1 px-1.5 hover:bg-black hover:text-white duration-200">Saved Posts</button>
        </div>
        <article className="flex flex-col flex-1 border-2 w-full border-slate-300 rounded-md mb-5 gap-y-10 py-10">
          {userPost ? userPost.ids.map((id)=><PostLayout key={id} data={userPost.entities[id]} EditComponent={Edit}/>):''}
        </article>
    </main>
  )
}

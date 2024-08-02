import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ShowStatus } from '../utilities/utilities'
import { useSelector } from 'react-redux'
import { selectActivityStatus, selectStatusMessage } from '../feature/slice/userAuthSlice'
import { selecEnableComment } from '../feature/slice/commentSlice'
import Comment from "../comment/comment"

export default function Layout() {
    const [count, setCount] = useState(0)
    const commentEnabled = useSelector(selecEnableComment);
    const activityStatus = useSelector(selectActivityStatus)
    const message = useSelector(selectStatusMessage)
    return (
        <>
            <nav className="py-2.5 border-2 flex justify-between px-5 md:px-8 lg:px-10">
                <ul className="flex justify-center items-center gap-x-5 text-lg ">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/posts">Posts</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
                <Link to="/profile" aria-label='profile'><div className="rounded-full w-10 h-10 bg-slate-300"></div></Link>
                {/* <button type='button' onClick={() => setCount(count + 1)}>{count}</button> */}
            </nav>
            {commentEnabled ? <Comment/>:""}
            <ShowStatus status={activityStatus} message={message} />
            <Outlet />
            <footer className='w-full h-36 border-t-2 border-slate-300 py-10 flex flex-col justify-center items-center'>
                <p>Made By: Pratit Prakash Chataut</p>
                <p>pratitprakashchataut1@gmail.com</p>
                <p>copyright - 2024</p>
            </footer>
        </>
    )
}

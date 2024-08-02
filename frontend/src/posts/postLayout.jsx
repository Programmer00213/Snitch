import React, { memo, useRef, useState } from 'react'
import { MdThumbUp } from "react-icons/md";
import { MdOutlineThumbUpOffAlt } from "react-icons/md";
import { FaRegCommentAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { openComment, showComment } from '../feature/slice/commentSlice';
import { useShowHidden } from '../utilities/utilities';
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useDeletePostMutation } from '../feature/slice/postSlice'
import { Link } from 'react-router-dom'
import { selectUserName, setActivityStatus } from '../feature/slice/userAuthSlice';
import { useAddLikeMutation, useIsLikedQuery} from '../feature/slice/likeSlice';

export const Edit = ({ id }) => {
  const [showEdit, setShow] = useState(false)
  const [deletePost] = useDeletePostMutation()

  const dispatch = useDispatch()

  const Delete = async (id) => {
    //console.log("I am pressed", id)

    dispatch(setActivityStatus({ status: "pending", message: "Pending" }))

    await deletePost(id).unwrap().then(() => {
      console.log("working")
      dispatch(setActivityStatus({ status: "success", message: "Success" }))
    }).catch((err) => {
      dispatch(setActivityStatus({ status: "rejected", message: "Failed To Delete Post" }))
    })
    setShow(!showEdit)
  }

  return (
    <div className={`absolute ${showEdit ? 'w-full' : 'w-0'} transition-all duration-300 h-full bg-slate-300  inset-0 flex justify-center items-center gap-x-5`}>
      <input type="checkbox" checked={showEdit} onChange={() => setShow(!showEdit)} className="absolute left-0 -translate-x-1/2 w-5 h-5 accent-red-500" />
      <button type="button" onClick={() => Delete([id])} className={`text-3xl ${showEdit ? 'block' : 'hidden'} hover:scale-125 transition duration-200`}><FaTrashCan /></button>
      <Link to={`/posts/edit/${id}`} className={`text-3xl ${showEdit ? 'block' : 'hidden'} hover:scale-125 transition duration-200`}><FaEdit /></Link>
    </div>
  )
}

function PostLayout({ data: { _id, title, author, updatedAt, content, like, comment }, EditComponent }) {

  const userName = useSelector(selectUserName)
  
  const {data:isLiked, isSuccess} = useIsLikedQuery({targetId:_id, userName})
  const [addLike] = useAddLikeMutation()
  const dispatch = useDispatch()

  const postContent = useRef(null);

  const [overflow, isHidden, setHidden] = useShowHidden(postContent, true)

  const addLikeCallBack = async () => {
    await addLike({targetId:_id, type:"Post", postId:_id})
  }

  return (
    <>
      <article className="w-full gap-x-2.5 px-5 md:px-8 lg:px-64 grid grid-auto-rows grid-cols-12">

        <div className="border-2 relative w-full col-span-12 lg:col-span-11 p-5 shadow-lg">
          {EditComponent ? <EditComponent id={_id} /> : ''}

          <h1 className="inline-block text-lg font-bold mb-2 hover:scale-110 hover:-translate-y-1 hover:translate-x-[5%] transition duration-200">{title}</h1>

          <p ref={postContent} className={`mb text-md break-words ${isHidden ? 'overflow-hidden max-h-60' : ''} ${!overflow ? 'mb-2.5' : ''}`}>
            {content}
          </p>

          {overflow ? <button type="button" className="mb-2.5" onClick={() => setHidden(!isHidden)}>{isHidden ? '...more' : '...less'}</button> : ''}

          <p className="text-xs">Author: {author}</p>
          <p className="text-xs">Date: {updatedAt}</p>
        </div>
        <form className="flex col-span-12 lg:col-span-1 gap-x-7 pt-5 px-5 lg:flex-col lg:px-0 lg:pt-3 lg:gap-x-0 lg:gap-y-5">
          <div className='flex justify-center items-center'>
            <button type="button" onClick={()=>addLikeCallBack()} className="text-xl text-center mr-2 hover:scale-125 duration-200">{isLiked ? <MdThumbUp />:<MdOutlineThumbUpOffAlt/>}</button><label>{like}</label>
          </div>
          <div className='flex justify-center items-center'>
            <button type="button" onClick={() => {dispatch(openComment()); dispatch(showComment({id:_id}))}} className="text-md mr-2 hover:scale-125 duration-200"><FaRegCommentAlt /></button><label>{comment}</label>
          </div>
        </form>
      </article>
    </>
  )
}

export default React.memo(PostLayout)
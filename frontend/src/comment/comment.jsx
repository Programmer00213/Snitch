import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openComment, selectPostId, useAddCommentMutation, useDeleteCommentMutation, useGetCommentQuery, useReplyCommentMutation, useUpdateCommentMutation, useGetReplyQuery } from '../feature/slice/commentSlice';
import { ImCross } from "react-icons/im";
import { useSetForm } from '../utilities/utilities';
import { MdThumbUp } from "react-icons/md";
import { MdOutlineThumbUpOffAlt } from "react-icons/md";
import { selectUserName } from '../feature/slice/userAuthSlice';
import { MdOutlineEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { useAddLikeMutation, useIsLikedQuery } from '../feature/slice/likeSlice';

const initialReplyState = {
    reply: '',
}


// Comment Layout
const CommentLayout = React.memo(({ comment: { _id, postId, comment, replyTo, like, author, updatedAt, reply, parentId }, isNotReply }) => {

    // State
    const [canEdit, setCanEdit] = useState(false);
    const [canReply, setCanReply] = useState(false)
    const [showReply, setShowReply] = useState(false)
    const userName = useSelector(selectUserName)


    const { data } = isNotReply ? useGetReplyQuery({ postId, parentId: _id }) : '' // Donot make GetReply Query if isNOtReply is false

    const { data: isLiked } = useIsLikedQuery({ targetId: _id, userName })
    const [updateComment] = useUpdateCommentMutation()
    const [deleteComment] = useDeleteCommentMutation()
    const [replyComment] = useReplyCommentMutation()
    const [addLike] = useAddLikeMutation()

    // form data/function
    const [formUpdateData, handleUpdateSubmit, handleUpdateChange] = useSetForm({ comment: comment }); // form Data/fucntion for Comment Edit
    const [formReplyData, handleReplySubmit, handleReplyChange] = useSetForm(initialReplyState) // form Data/function for Comment Reply

    // callback for mutation
    const updateCommentCallback = async () => {
        await updateComment({ id: _id, postId: postId, comment: formUpdateData, isNotReply })
        setCanEdit(!canEdit)
    }
    const deleteCommentCallback = async () => {
        await deleteComment({ id: _id, postId, isNotReply, parentId })
    }
    const replyCommentCallBack = async () => {
        await replyComment({ id: _id, reply: formReplyData, parentId: parentId || _id })
        setCanReply(!canReply)
    }
    const addLikeCallBack = async () => {
        await addLike({ targetId: _id, postId, type: isNotReply ? "Comment" : "Reply" })
    }
    return (
        <>
            {/* Edit Box */}

            {/* the false argument to specify that the form is not to be reset to initial state*/}
            <form onSubmit={handleUpdateSubmit(updateCommentCallback, false)} className="border-2 border-slate-300 py-2 px-3 mt-5">
                <label className="text-xs underline underline-offset-2">@ {author}</label>
                <label className='text-xs ml-3'>{updatedAt}</label>
                <br />
                {canEdit ?
                    <div>
                        <textarea value={formUpdateData.comment} onChange={handleUpdateChange} className='w-full mt-3 p-2 h-48 resize-none border-2 border-slate-300' name="comment"></textarea>
                        <button className='border-2 border-slate-300 px-2 py-1 hover:bg-black hover:border-black hover:text-white duration-200'><FaCheck /></button>
                    </div> :
                    <p className={`w-full mt-3 leading-5 resize-none overflow-hidden bg-white break-words`}><label className='text-blue-700'>{replyTo}</label> {comment}</p>
                }
            </form>
            {/* Button For Comment Action {Like, Reply, Edit, Delete} */}
            <div className="flex justify-between mt-2 items-center px-3">
                <div className='flex gap-5'>
                    <section className='flex justify-center items-center gap-1'>

                        <button type="button" onClick={() => addLikeCallBack()} className='text-lg hover:scale-125 duration-200'>
                            {isLiked ? <MdThumbUp /> : <MdOutlineThumbUpOffAlt />}
                        </button>
                        <label>{like}</label>

                    </section>

                    <button type="button" onClick={() => setCanReply(!canReply)} className='hover:scale-125 text-sm duration-200'>reply</button>
                    {isNotReply ? <button type="button" onClick={() => setShowReply(!showReply)} className='hover:scale-125 text-sm duration-200'>more {reply}</button> : ''}
                </div>
                {author == userName ? <div className='flex gap-5'>
                    <button type="button" onClick={() => setCanEdit(!canEdit)} className='hover:scale-125 duration-200'><MdOutlineEdit /></button>
                    <button type="button" onClick={() => deleteCommentCallback()} className='hover:scale-125 duration-200'><FaTrashCan /></button>
                </div> : ''}
            </div>

            {/* Reply Box */}
            {canReply ?
                <form onSubmit={handleReplySubmit(replyCommentCallBack)}>
                    <textarea name="reply" value={formReplyData.reply} onChange={handleReplyChange} className='w-full mt-3 p-2 h-48 resize-none border-2 border-slate-300'>
                    </textarea>
                    <button type="submit" className='border-2 border-slate-300 px-2 py-1 hover:bg-black hover:border-black hover:text-white duration-200'><FaCheck /></button>
                </form> : ''
            }

            {/* Reply Container */}
            {isNotReply && showReply ?
                <div className='reply-container pl-5'>
                    {data ? data.map((reply) => <CommentLayout key={reply['_id']} comment={reply} isNotReply={false} />) : ''}
                </div> : ''
            }
        </>
    )
})

const initialCommentState = {
    comment: '',
}


// The Comment Box
export default function Comment() {
    const dispatch = useDispatch()
    const id = useSelector(selectPostId)
    const { data: comments, isLoading } = useGetCommentQuery(id)
    const [addComment] = useAddCommentMutation()
    const [formData, handleSubmit, handleChange] = useSetForm(initialCommentState)
    const callback = async () => {
        //console.log(formData)
        await addComment({ id: id, comment: formData })
    }

    return (
        <>
            <div onClick={() => dispatch(openComment())} className="fixed z-10 left-0 top-0 w-full h-full bg-slate-900 opacity-80">

            </div>
            <div className="flex z-10 flex-col fixed bg-white rounded-md w-full h-full left-0 top-0 md:w-11/12 md:h-[90%] md:left-1/2 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 lg:w-1/3">
                <div className="flex p-5 items-center relative border-b-2 border-slate-300">
                    <h1 className="text-center text-lg">Comments</h1>
                    <button className="absolute right-7 text-sm" onClick={() => dispatch(openComment())}><ImCross /></button>
                </div>
                <div className="flex-1 px-5 pb-24 overflow-auto">
                    {comments ? comments.map((comment) => <CommentLayout key={comment['_id']} comment={comment} isNotReply={true} />) : ''}
                </div>
                <form className="absolute bottom-0 py-5 px-5 bg-white border w-full flex gap-x-2" onSubmit={handleSubmit(callback)}>
                    <input type="text" onChange={handleChange} value={formData.comment} className="outline-none w-full border-2 border-slate-300 rounded-md p-1.5" placeholder="Enter Your Comment" name="comment" id="comment" />
                    <button type="submit" className="text-md border-slate-700 border rounded-md py-1 px-2 hover:bg-black hover:text-white duration-200">Reply</button>
                </form>
            </div>
        </>
    )
}

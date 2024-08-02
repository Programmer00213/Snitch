import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/API";

const initialState = {
    openComment:false,
    postId: null
}

const commentSlice = createSlice({
    name:"comment",
    initialState,
    reducers:{
        openComment:(state, action)=>{
            state.openComment=!state.openComment
        },
        showComment(state, action){
            state.postId = action.payload.id
        }
    }
})

const extendedCommentApi = authApi.injectEndpoints({
    endpoints:(builder)=>({
        getComment:builder.query({
            query:(postId)=>{
                return `/comment/${postId}`
            },
            providesTags:(result, error, args) => [
                {type:"Comment", id:"List"},
                ...result.map((comment)=>({
                    type:"Comment", id:comment['_id']
                }))
            ]
        }),
        getReply:builder.query({
            query:({postId, parentId})=>`/comment/${postId}?parentId=${parentId}`,
            providesTags:(result, error, args) => {
                console.log({type:"Reply", id:args.parentId})
                return [
                {type:"Reply", id:args.parentId},
                ...result.map((comment)=>({
                    type:"Reply", id:comment['_id']
                }))
            ]}
        }),
        addComment:builder.mutation({
            query:({id , comment})=>{
                return {
                    url: `comment/${id}`,
                    method: "POST",
                    body: comment,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            },
            invalidatesTags:(result, error, args)=>[{type:"Comment", id:"List"}, {type:"Post", id:args.id}]
        }),
        replyComment:builder.mutation({
            query:({id , reply, parentId})=>{
                console.log(parentId)
                return {
                    url: `comment/reply/${id}`,
                    method: "POST",
                    body: reply,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            },
            invalidatesTags:(result, error, args)=>[
                {type:"Reply", id:args.parentId}, 
                {type:"Reply", id:args.id},
                {type:"Comment", id:args.parentId} //invalidate getComment
            ]
        }),
        updateComment:builder.mutation({
            query:({id, postId, comment, isNotReply})=>{
                console.log(id, postId, isNotReply)
                return {
                    url: `comment/${postId}/${id}?isNotReply=${isNotReply}`,
                    method: "PATCH",
                    body: comment,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            },
            invalidatesTags:(result, error, args)=>{
                console.log(args)
                return [{type:"Comment", id:args.id},{type:"Reply", id:args.id}]
            }
        }),
        deleteComment:builder.mutation({
            query:({id, postId, isNotReply, parentId})=>{
                console.log(id, postId, isNotReply)
                return {
                    url: `comment/${postId}/${id}?isNotReply=${isNotReply}`,
                    body:{parentId:parentId},
                    method: "DELETE",
                }
            },
            invalidatesTags:(result, error, args)=>[
                {type:"Comment", id:args.id},
                {type:"Reply", id:args.id},
                {type:"Post", id:args.postId}, //Invalidate Post
                {type:"Comment", id:args.parentId} //invalidate getComment
            ]
        })
    })
})

export const selecEnableComment = (state)=>state.comment.openComment
export const selectPostId = (state)=>state.comment.postId
export const {openComment,showComment} = commentSlice.actions

export default commentSlice.reducer

export const {useGetCommentQuery, useAddCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation, useReplyCommentMutation, useGetReplyQuery} = extendedCommentApi
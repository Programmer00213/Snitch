import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { authApi } from "../api/API";

const postAdapter = createEntityAdapter({
    selectId: (post) => post['_id']
})

const initialState = postAdapter.getInitialState({})

const extendedPostApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: () => "/post",
            transformResponse: (response) => {
                return postAdapter.setAll(postAdapter.getInitialState(), response)
            },
            providesTags: (result, error, args) => [
                { type: "Post", id: "List" },
                ...result.ids.map((id) => ({ type: "Post", id: id }))
            ]
        }),
        getUserPost: builder.query({
            query: ({ userName, postId = "all" }) => `/post/user/${userName}?id=${postId}`,
            transformResponse: (response) => {
                return postAdapter.setAll(postAdapter.getInitialState(), response)
            },
            providesTags: (result) => [
                { type: "Post", id: "List" },
                ...result.ids.map((id) => ({ type: "Post", id: id }))
            ]
        }),
        addPost: builder.mutation({
            query: (newPost) => {
                return {
                    url: "/post/new",
                    method: "POST",
                    body: newPost,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            },
            invalidatesTags: [{ type: "Post", id: "List" }]
        }),
        patchPost: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/post/${id}`,
                    method: "PATCH",
                    body: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            },
            invalidatesTags: (result, error, args) => {
                return [{ type: "Post", id: args.id }]
            }
        }),
        deletePost: builder.mutation({
            query: (id) => {
                console.log(id)
                return {
                    url: `/post/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags:(result, error, args)=>[{ type: "Post", id:args.id }]
        })
    })
})

const selectPostResult = extendedPostApi.endpoints.getPosts.select()

const selectPostData = createSelector(
    selectPostResult, postResult => postResult.data
)

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postAdapter.getSelectors(state => selectPostData(state) ?? initialState)

export const {
    useGetPostsQuery,
    useGetUserPostQuery,
    useAddPostMutation,
    usePatchPostMutation,
    useDeletePostMutation
} = extendedPostApi

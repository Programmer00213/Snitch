import { authApi } from "../api/API";

const extendedLikeApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        isLiked: builder.query({
            query: ({targetId, userName}) => {
                return `/like/${targetId}`
            },
            providesTags: (result, error, args) =>{
                return [
                { type: "Like", id:args.targetId},
            ]}
        }),
        addLike: builder.mutation({
            query: ({ targetId, type, postId }) => {
                return {
                    url: `/like/${targetId}`,
                    method: "POST",
                    body: { type: type, postId: postId},
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            },
            invalidatesTags: (result, error, args) =>{
                
                return [{ type: "Like", id:args.targetId }, { type: args.type, id: args.targetId }]
            }
        })
    })
})

export const { useAddLikeMutation, useIsLikedQuery } = extendedLikeApi
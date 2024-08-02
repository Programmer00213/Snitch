import React, { useState } from 'react'
import PostLayout from './postLayout'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllPosts} from '../feature/slice/postSlice'
import { useGetPostsQuery } from '../feature/slice/postSlice'

function CustomDropDown({ listElement }) {
  const [current, setCurrent] = useState("Recent")
  return (
    <div id="dropdown" className="absolute right-5 border-2 border-slate-500 rounded-md text-center text-md p-1 w-32 md:right-8 lg:right-10">
      {current}
      <div className="hidden flex-col">
        {listElement.map((element, i)=>{
          return <button key={i} type="button" onClick={()=>setCurrent(element)} className="border-t hover:bg-black hover:text-white border-slate-500" name="filter" value={element}>{element}</button>
        })}
      </div>
    </div>
  )
}

export default function Post() {

  const {data:response, error, isLoading} = useGetPostsQuery();

  const post = useSelector(selectAllPosts)

  const typeFilter = [
    "Most Popular",
    "Recent",
    "Oldest",
    "Most Hated",
  ]

  return (
    <>
      <div className="flex relative justify-between px-5 py-2.5 md:px-8 lg:px-10 lg:py-5">
        <Link to="/posts/new"><button className="text-md p-1 w-32 border-2 border-slate-500 duration-200 rounded-md">Make New Post</button></Link>
        <CustomDropDown listElement={typeFilter} />
      </div>
      <main className="flex flex-1 flex-col items-center my-5 gap-y-7 lg:my-10">
        {
            post ? post.map((data,id) => {
              return <PostLayout data={data} key={id}/>
            }):""          
        }
      </main>
    </>
  )
}

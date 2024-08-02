import React from "react"
import Login from "./Authentication/login"
import Register from "./Authentication/register"
import Layout from "./layout/layout"
import NotFound from "./notfound/notfound"
import { Routes, Route } from "react-router-dom"
import Post from "./posts/post"
import NewPost from "./posts/newpost"
import Profile from "./profile/profile"
import EditPost from "./posts/editPost"
import RequireAuth from "./Authentication/authRequired"
import Home from "./Home/home"

function App() {

  return (
    <>
      <Routes>
        /* Public Route */
        <Route path="/" element={<Layout />}>
          <Route index element={<Home/>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        /* Protected Route */
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="posts/">
              <Route index element={<Post />} />
              <Route path="new" element={<NewPost />} />
              <Route path="edit/:id" element={<EditPost />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App

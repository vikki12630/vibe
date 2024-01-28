import { Navigate, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { currentUser } from "./storeAndSlices/authSlice"
import axios from "axios"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import Layout from "./components/Layout"
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import OtherUserProfile from "./pages/OtherUserProfile"
import Settings from "./pages/Settings"
import Messages from "./pages/Messages"
import { io } from "socket.io-client"
import NotFound from "./pages/NotFound"
import { Toaster } from 'sonner';
import conf from "./conf/conf"

function App() {
  const dispatch = useDispatch()
  const [socket, setSocket] = useState(null)
  const userDetail = useSelector((state) => state.auth)

  const getCurrentUser = async () => {
    try {
      const config = {
        withCredentials: true
      }
      const response = await axios.get(`${conf.backendUrl}/api/v1/users/getCurrentUser`, config)
      dispatch(currentUser(response?.data?.data))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    setSocket(io(import.meta.env.VITE_BACKEND_URL))
  }, [])


  useEffect(() => {
    userDetail.currentUser && socket.emit("addUser", userDetail.currentUser._id)

  }, [userDetail.currentUser])

  const ProtectedRoute = ({ element, ...props }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? (
      element
    ) : (
      <Navigate to="/" replace />
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

        <Route path="/home" element={<Layout />}>

          <Route path="" element={<ProtectedRoute element={<Home />} />} />

          <Route path="search" element={<ProtectedRoute element={<Search />} />} />

          <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />

          <Route path="profile/settings" element={<ProtectedRoute element={<Settings getCurrentUser={getCurrentUser} />} />} />

          <Route path="user/:id" element={<ProtectedRoute element={<OtherUserProfile />} />} />

          <Route path="search/user/:id" element={<ProtectedRoute element={<OtherUserProfile />} />} />

        </Route>

        <Route path="/messages" element={<ProtectedRoute element={<Messages socket={socket} />} />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="bottom-right" closeButton />
    </>

  )
}

export default App

import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../storeAndSlices/authSlice"
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import { TbLogout } from "react-icons/tb";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import AddPost from './AddPost'
import conf from "../conf/conf"

const LeftNavHome = ({ setCurrentChat, setNewUserFeed }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isPostMenu, setIsPostMenu] = useState(false);
  const { currentUser } = useSelector((state) => state.auth)
  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        withCredentials: true
      }
      await axios.get(`${conf.backendUrl}/api/v1/users/logout`, config)
      dispatch(logout())
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }


  const mobileMenuHandler = () => {
    setIsMobileMenu(current => !current)
  }
  const closeMenuHandler = () => {
    setIsMobileMenu(current => !current)
  }

  const homecloseonclick = (e) => {
    e.preventDefault()
    navigate("/home")
    setIsMobileMenu(current => !current)
  }
  const msgcloseonclick = (e) => {
    e.preventDefault()
    navigate("/messages")
    setCurrentChat(null)
    setIsMobileMenu(current => !current)
  }
  const searchcloseonclick = (e) => {
    e.preventDefault()
    navigate("/home/search")
    setIsMobileMenu(current => !current)
  }
  const profilecloseonclick = (e) => {
    e.preventDefault()
    navigate("/home/profile")
    setIsMobileMenu(current => !current)
  }

  const postHandlerSmMdDevices = () => {
    setIsPostMenu(current => !current)
  }

  const closePostMenuHandler = () => {
    setIsPostMenu(current => !current)
  }

  return (
    <>
      <section className='w-full h-20 flex justify-between items-center px-6 text-4xl  md:px-12 border-b-2 border-slate-900 xl:border-b-0 bg-slate-200 transition-all transition-0.5 xl:w-2/12 xl:flex-col xl:min-h-screen xl:justify-center xl:sticky absolute top-0 z-10'>
        <h1 className='xl:absolute xl:top-0 xl:py-8 font-logofont text-6xl bg-gradient-to-r from-cyan-400 via-violet-600 to-pink-300 bg-clip-text text-transparent'>vibe<span className='ml-1'>✓</span></h1>
        <div className='flex items-center xl:flex-col '>
          <button
            onClick={postHandlerSmMdDevices}
            className='lg:hidden mr-2'>
            <MdOutlineAddPhotoAlternate />
          </button>
          <button
            onClick={mobileMenuHandler}
            className='lg:hidden'>
            <IoMdMenu />
          </button>
          <nav className='hidden lg:flex md:text-2xl xl:flex xl:text-2xl xl:flex-col gap-8'>
            <Link
              className='flex items-center hover:scale-95 hover:text-slate-700 hover:underline'
              to={"/home"}>
              <FaHome />
              Home
            </Link>
            <Link
              className=' flex items-center hover:scale-95 hover:text-slate-700 hover:underline xl:hidden'
              to={"search"}>
              <IoSearchSharp className='mr-1' />
              Search
            </Link>
            <Link
              className='flex items-center hover:scale-95 hover:text-slate-700 hover:underline'
              to={"/messages"}>
              <BiMessageRoundedDetail />
              Message
            </Link>
            <Link
              className='flex items-center hover:scale-95 hover:text-slate-700 hover:underline xl:hidden'
              to={"/home/profile"}>
              <img src={currentUser?.avatar} className='rounded-full h-10' />
              Profile
            </Link>
            <Link
              className='hidden items-center hover:scale-95 hover:text-slate-700 hover:underline xl:flex '
              to={"/home/profile"}>
              <CgProfile />
              Profile
            </Link>
            <button
              onClick={postHandlerSmMdDevices}
              className=' flex items-center hover:scale-95 hover:text-slate-700 hover:underline'>
              <MdOutlineAddPhotoAlternate />
              Post
            </button>
            <button
              className='flex items-center hover:scale-95 hover:text-slate-700 hover:underline text-red-500'
              onClick={logoutHandler}
            >
              <TbLogout />
              Logout
            </button>
          </nav>
          <img src={currentUser?.avatar || "/user_keov54.png"} className='hidden xl:block rounded-full absolute bottom-0 h-24 my-10 border-2 border-slate-900' alt="" />
        </div>
      </section>

      <section
        id='mobile-menu'
        className={isMobileMenu ? 'absolute top-0 min-h-screen bg-slate-300 w-full text-5xl  flex-col items-center text-slate-700 flex z-20' : 'absolute top-0 min-h-screen bg-slate-300 w-full text-5xl  flex-col items-center text-slate-700 hidden z-20'}>
        <button onClick={closeMenuHandler} className='text-6xl text-red-500 self-end px-6 py-4 mb-20'>
          <IoClose />
        </button>
        <nav className='flex flex-col gap-8'>
          <div
            onClick={homecloseonclick}
            className='flex items-center hover:scale-95 hover:text-slate-700 hover:underline cursor-pointer'
          >
            <FaHome />
            Home
          </div>
          <div
            onClick={searchcloseonclick}
            className=' flex items-center hover:scale-95 hover:text-slate-700 hover:underline xl:hidden cursor-pointer'
          >
            <IoSearchSharp className='mr-1' />
            Search
          </div>
          <div
            onClick={msgcloseonclick}
            className='flex items-center hover:scale-95 hover:text-slate-700 hover:underline cursor-pointer'
          >
            <BiMessageRoundedDetail />
            Messages
          </div>
          <div
            onClick={profilecloseonclick}
            className='flex items-center hover:scale-95 hover:text-slate-700 hover:underline gap-1 cursor-pointer'
          >
            {currentUser?.avatar ? <img src={currentUser?.avatar} className='rounded-full h-12' /> : <CgProfile />}
            Profile
          </div>
          <button
            className='flex items-center hover:scale-95 hover:underline text-red-500'
            onClick={logoutHandler}
          >
            <TbLogout />
            Logout
          </button>
        </nav>
      </section>

      <section id='addPostSmMdDevices' className={isPostMenu ? 'absolute top-0 h-screen bg-transparent w-full text-5xl flex-col items-center justify-center transition-all flex' : 'absolute top-0 h-screen  w-full text-5xl flex-col items-center justify-center transition-all hidden'}>
        <div className='w-full xl:w-6/12 bg-slate-800  text-white h-screen xl:h-5/6 xl:rounded-2xl overflow-auto overflow-y-scroll no-scrollbar flex flex-col items-center mt-20 xl:mt-0 z-20'>
          <button
            onClick={closePostMenuHandler}
            className='text-6xl text-red-500 px-6 xl:py-1 self-end hover:scale-95'>
            <IoClose />
          </button>
          <p className='underline text-yellow-100 mb-2'>create post</p>
          <AddPost setNewUserFeed={setNewUserFeed} setIsPostMenu={setIsPostMenu} />

        </div>
      </section>
    </>
  )
}
export default LeftNavHome
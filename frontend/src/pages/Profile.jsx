import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import ProfilePagePostComponent from '../components/ProfilePagePostComponent'
import { getUserPosts } from '../storeAndSlices/userPostSlice'
import { PiSmileySadDuotone } from 'react-icons/pi'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const { currentUser } = useSelector((state) => state.auth)
  const { userPosts } = useSelector((state) => state.posts)

  useEffect(() => {
    setPosts(userPosts)
  }, [userPosts])


  useEffect(() => {
    dispatch(getUserPosts())
  }, [])

  const settingsBtnClicked = () => {
    navigate("settings")
  }

  return (
    <div className='pt-16 h-svh overflow-auto h-42 overflow-y-scroll no-scrollbar  bg-slate-100 w-full xl:pt-0 flex flex-col items-center xl:w-7/12 '>
      <div className='flex justify-center bg-gradient-to-b from-green-100 via-zinc-100 to-blue-100 items-center py-6 w-full gap-4 md:self-center md:gap-10 '>
        <div className='flex flex-col items-center'>
          <img
            src={currentUser?.avatar || "/user_keov54.png"}
            alt="profile pic"
            className='h-24 md:h-36 rounded-full border-2 border-slate-800'
          />
          <p className='text-xl md:text-3xl font-semibold'>{currentUser?.username}</p>
        </div>
        <div className=' flex flex-col gap-3 md:gap-6'>
          <div className=' flex gap-4 text-lg sm:text-xl font-semibold md:text-3xl'>
            <p>{currentUser?.followers.length} {currentUser?.followers.length <= 1 ? 'follower' : 'followers'}</p>
            <p>{currentUser?.following.length} following</p>
          </div>
          <button
            onClick={settingsBtnClicked}
            className='px-3 py-1 rounded-lg shadow-md bg-slate-300 w-28 md:w-36 md:h-12 hover:bg-slate-500 hover:text-white'
          >
            settings
          </button>
        </div>
      </div>
      {/* ++++++++++++++++++++++++++++++++++ */}
      <div className='w-full h-0.5 bg-black'>

      </div>
      {/* ++++++++++++++++++++++++++++++++++ */}


      <div className='w-full bg-gradient-to-b from-green-100 via-zinc-100 to-blue-100 flex flex-wrap p-2 '>
        {posts?.length === 0 ? <p className='self-center mx-auto text-3xl  sm:text-6xl flex gap-2  py-6'>
          <PiSmileySadDuotone />no posts available...!</p> : posts?.map((post) =>
            <ProfilePagePostComponent key={post._id} post={post} />
          )}
      </div>


    </div>
  )
}

export default Profile
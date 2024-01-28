import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useSelector } from "react-redux"
import ProfilePagePostComponent from '../components/ProfilePagePostComponent'
import { PiSmileySadDuotone } from "react-icons/pi";
import { toast } from 'sonner';
import conf from "../conf/conf"

const OtherUserProfile = () => {

  const { id } = useParams()
  const [user, setUser] = useState()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const { currentUser } = useSelector((state) => state.auth)
  const following = user?.followers.includes(currentUser._id)

  const [getUserFeed] = useOutletContext()

  const getUser = async () => {
    setLoading(true)
    try {
      const config = {
        withCredentials: true
      }
      const response = await axios.get(`${conf.backendUrl}/api/v1/users/getUserDetails/${id}`, config)
      setLoading(false)
      setUser(response.data?.data?.user)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const config = {
          withCredentials: true
        }
        const response = await axios.get(`${conf.backendUrl}/api/v1/posts/otherUserPosts/${id}`, config)
        setPosts(response?.data?.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
    getUserPosts()
  }, [id])

  const followUnfollowHandler = async (e) => {
    e.preventDefault()
    try {
      const config = {
        withCredentials: true
      }
      await axios.get(`${conf.backendUrl}/api/v1/users/follow/${id}`, config)
      getUser()
      getUserFeed()
    } catch (error) {
      toast.error("unable to follow try again")
    }
  }

  return (
    <div className='mt-20 xl:h-screen overflow-auto h-42 overflow-y-scroll no-scrollbar bg-slate-100 w-full xl:mt-0 flex flex-col items-center xl:w-7/12'>
      {loading ? <p>loading...</p> : <div className='flex self-center justify-center w-full  items-center  gap-4 md:self-center md:gap-10 py-6 bg-gradient-to-b from-green-100 via-zinc-100 to-blue-100'>
        <div className='flex flex-col  items-center'>
          <img
            src={user?.avatar || "/user_keov54.png"}
            alt="profile pic"
            className='h-24 md:h-36 rounded-full border-2 border-slate-800'
          />
          <p className='text-xl md:text-3xl font-semibold'>{user?.username}</p>
        </div>
        <div className=' flex flex-col gap-3 md:gap-6'>
          <div className=' flex gap-4 text-lg sm:text-xl font-semibold md:text-3xl'>
            <p>{user?.followers.length} {user?.followers.length <= 1 ? 'follower' : 'followers'}</p>
            <p>{user?.following.length} following</p>
          </div>
          <button
            onClick={followUnfollowHandler}
            className={`px-3 py-1 rounded-lg shadow-md  w-28 md:w-36 md:h-12 ${following ? "bg-slate-700 text-white" : "bg-slate-200"}`}>{following ? "unfollow" : "follow"}
          </button>
        </div>
      </div>}
      {/* ++++++++++++++++++++++++++++++++++ */}
      <div className='w-full h-0.5 bg-black'>

      </div>
      {/* ++++++++++++++++++++++++++++++++++ */}

      <div className='w-full min-h-screen bg-gradient-to-b from-green-100 via-zinc-100 to-blue-100 p-2 flex flex-wrap'>
        {posts.length === 0 ?
          <p className=' mt-32 mx-auto text-3xl  sm:text-6xl flex gap-2  py-6'>
            <PiSmileySadDuotone />no posts available...!</p> : posts?.map((post) =>
              <ProfilePagePostComponent key={post._id} post={post} />
            )}

      </div>

    </div>
  )
}

export default OtherUserProfile
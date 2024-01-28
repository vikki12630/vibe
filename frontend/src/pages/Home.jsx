import React from 'react'
import FeedPost from "../components/FeedPost"
import axios from 'axios'
import { currentUser } from '../storeAndSlices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid';
import conf from "../conf/conf"

const Home = () => {
  const dispatch = useDispatch()
  const  {userFeed}  = useSelector((state) => state.feed)

  const data = useSelector((state) => state.auth)

    const getCurrentUser = async () => {
      try {
       const config = {
          withCredentials: true
        }
        const response = await axios.get(`${conf.backendUrl}/api/v1/users/getCurrentUser`, config )
        dispatch(currentUser(response?.data?.data))
      } catch (error) {
        console.log(error)
      }
    }
    if (!data.currentUser) {
      getCurrentUser()
    }

  return (
    <div className="h-screen overflow-auto h-42 overflow-y-scroll no-scrollbar w-full min-h-screen pt-20 xl:pt-0 xl:w-7/12 xl:bg-[url('/feedpage.svg')] ">
      <div className='z-20'>
        {userFeed?.map((post) => (
          <FeedPost
            key={nanoid()}
            post={post}
          />
        ))}
      </div>
    </div>
  )

}

export default Home
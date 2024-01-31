import React from 'react'
import FeedPost from "../components/FeedPost"
import axios from 'axios'
import { currentUser } from '../storeAndSlices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid';
import conf from "../conf/conf"

const Home = () => {
  const dispatch = useDispatch()
  const { userFeed, isLoading } = useSelector((state) => state.feed)

  const data = useSelector((state) => state.auth)

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
  if (!data.currentUser) {
    getCurrentUser()
  }

  return (
    userFeed.length ? <div className="h-svh overflow-auto h-42 overflow-y-scroll no-scrollbar w-full min-h-svh pt-20 xl:pt-0 xl:w-7/12 xl:bg-[url('/feedpage.svg')] ">

    {userFeed?.map((post) => (
      <FeedPost
        key={nanoid()}
        post={post}
      />
    ))}
  </div> : <div className="h-svh w-full  pt-20 xl:pt-0 xl:w-7/12 flex items-center xl:bg-[url('/feedpage.svg')] relative">
    <img className='w-4/6 h-svh' src={"/noposts.svg"} alt="" />
    <div className=' w-full h-96 flex flex-col justify-center text-2xl pr-2 text-slate-400'>
      <h6 className=' underline text-4xl text-red-400 mb-5'>empty feed ?</h6>
      <p> add post or follow someone to see their post !</p>
      <p>search people in search bar...</p>

    </div>
    <a className='absolute bottom-0 text-slate-300' href="https://www.freepik.com/free-vector/empty-concept-illustration_18840616.htm#query=empty&position=42&from_view=search&track=sph&uuid=04c0b977-8a84-433d-996c-e1e6c3f16a95">Image by storyset on Freepik</a>

  </div>
  )
}

export default Home
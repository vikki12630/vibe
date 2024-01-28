import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LeftNavHome from './LeftNavHome';
import RightNavHomeBigScreen from './RightNavHomeBigScreen';
import { useDispatch } from 'react-redux';
// import { getUserFeed } from '../storeAndSlices/userFeedSlice';
import { userFeedPosts } from '../storeAndSlices/userFeedSlice';
import { useState } from 'react';
import axios from 'axios';
import conf from "../conf/conf"


const Layout = () => {
  const dispatch = useDispatch()
  const [newUserFeed, setNewUserFeed] = useState([])
  const getUserFeed = async () => {
    try {
      const config = {
        withCredentials: true
      }
      const response = await axios.get(`${conf.backendUrl}/api/v1/posts/feed`, config );
      setNewUserFeed(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserFeed()
  }, [])

  useEffect(() => {
    dispatch(userFeedPosts(newUserFeed))
  }, [newUserFeed])
  
  
  return (
    <div className='flex flex-col lg:flex-row'>
      <LeftNavHome setNewUserFeed={setNewUserFeed}/>
      <Outlet context={[getUserFeed]}/>
      <RightNavHomeBigScreen />
    </div>
  )
}

export default Layout
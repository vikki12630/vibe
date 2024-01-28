import React, { useEffect, useState } from 'react'
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { toast } from 'sonner';
import conf from "../conf/conf"

const FeedPost = ({ post }) => {

  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.auth)
  const currentUserId = currentUser?._id

  const [liked, setLiked] = useState(false)
  const [likeLenght, setLikeLenght] = useState([])

  useEffect(() => {
    setLiked(post?.likes.includes(currentUserId))
    setLikeLenght(post.likes)
  }, [])

  const likeBtnClicked = async (e) => {
    e.preventDefault()
    try {
      const config = {
        withCredentials:true
      }
      const response = await axios.get(`${conf.backendUrl}/api/v1/posts/like/${post?._id}`,config)
      setLiked(!liked)
      setLikeLenght(liked ? likeLenght.filter(user => user !== currentUserId) : (prev) => [...prev, currentUserId])
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.status === 400 ? "can't like your own post" : "unable to like this post try again")
    }
  }

  const date = new Date(post?.createdAt);
  const postUploadTime = Date.now() - date;
  const min = (postUploadTime / 1000) / 60;
  const hour = (postUploadTime / 1000) / 60 / 60;
  const day = (postUploadTime / 1000) / 60 / 60 / 24 / 365;
  let postTime;

  if (min < 60) {
    postTime = `${Math.floor(min)} min ago`
  } else if (min > 60 && min < 60 * 24) {
    postTime = `${Math.floor(hour)} hours ago`
  } else if (hour > 24 && hour < 24 * 30) {
    postTime = `${Math.floor(hour / 24)} days ago`
  } else if (day > 365) {
    postTime = `${Math.floor(day)} year ago`
  }

  const navigateToProfile = () => {
    if (post?.postedBy?._id === currentUserId) {
      navigate("profile")
    } else {
      navigate(`search/user/${post?.postedBy?._id}`)
    }
  }

  return (
    <>
      <div className='flex flex-col p-2 border-b-2 border-black sm:px-6 sm:mx-auto md:w-fit md:h-fit'>
        <div className='flex items-center justify-between mb-2'>
          <div
            onClick={navigateToProfile}
            className='flex items-center gap-2 cursor-pointer'>
            {/* user_keov54.png */}
            <img
              src={post?.postedBy?.avatar || 'user_keov54.png'}
              alt="profile img"
              className='h-16 rounded-full sm:h-20 border-2 border-slate-800'
            />
            <p className='text-2xl'>{post?.postedBy?.username}</p>
          </div>
          <p>{postTime}</p>
        </div>
        <h4 className='text-xl text-balance break-words mb-2'>{post?.text}</h4>
        <img
          loading='lazy'
          src={post?.postImage}
          alt=""
          className='md:h-[70svh] shadow-xl'
        />
        <div className='text-4xl flex sm:gap-2 md:gap-3 my-2'>
          <div className='cursor-pointer active:scale-105' onClick={likeBtnClicked}>
            {liked ? <IoHeartSharp className='text-red-600' /> : <IoHeartOutline />}
          </div>
          <AiFillMessage className='cursor-pointer' />
        </div>
        <div>
          {likeLenght.length > 0 && <p className='text-2xl ml-2.5'>{likeLenght.length} {likeLenght.length === 1 ? "like" : "likes"}</p>}

          {post?.comments.length > 0 &&
            <p className='text-2xl ml-2.5'>
              {post?.comments.length} {post?.comments.length === 1 ? "comment" : "comments"}
            </p>
          }
        </div>
      </div>
    </>

  )
}

export default FeedPost

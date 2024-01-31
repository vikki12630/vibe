import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"

const SearchedUserResults = ({ user }) => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.auth)
  const currentUserId = currentUser?._id
  const following = user?.followers.includes(currentUserId)

  const navigateToProfile = () => {
    if (user?._id === currentUserId) {
      navigate("profile")
    } else {
      navigate(`user/${user?._id}`)
    }
  }
  // console.log(user)
  return (
    <div className='w-3/4 mx-auto mt-2  rounded-full bg-slate-300  flex justify-between transition-all hover:scale-105 '>
      <div
        className='flex items-center  gap-2 cursor-pointer w-full'
        onClick={navigateToProfile}
      >
        <img
        loading='lazy'
          src={user?.avatar || "/user_keov54.png"}
          alt="userimg"
          className='h-14 rounded-full m-1'
        />
        <div>
          <p className='text-2xl font-semibold '>{user?.username}</p>
          <p>{user?.fullName}</p>
        </div>
      </div>
      <div
        className='mx-3 text-md xl:text-xs self-center'>
        {following ? "following" : ""}
      </div>
    </div>
  )
}

export default SearchedUserResults
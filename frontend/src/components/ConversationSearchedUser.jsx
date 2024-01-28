import axios from 'axios'
import React from 'react'
import conf from '../conf/conf'

const ConversationSearchedUser = ({ user, setCurrentChat, currentUser, setAddSectionOprnClose }) => {

  const newConversation = async () => {

    try {
      const config = {
        headers: {
          "content-type": "application/json"
        },
        withCredentials: true
      }
      const response = await axios.post(`${conf.backendUrl}/api/v1/conversations/createConversation`, { participants: [currentUser._id, user._id] }, config)
      setCurrentChat(response?.data?.data)
      setAddSectionOprnClose(section => !section)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div onClick={newConversation} className='w-3/4 text-slate-900 mx-auto mt-2 h-20 rounded-xl bg-slate-300  flex justify-between transition-all hover:scale-105 '>
      <div
        className='flex items-center  gap-4  cursor-pointer w-full'
      >
        <img
          src={user?.avatar || "/user_keov54.png"}
          alt="userimg"
          className='h-16 rounded-full ml-5'
        />
        <div>
          <p className='text-2xl font-semibold '>{user?.username}</p>
          <p className='text-lg'>{user?.fullName}</p>
        </div>
      </div>
    </div>

  )
}

export default ConversationSearchedUser
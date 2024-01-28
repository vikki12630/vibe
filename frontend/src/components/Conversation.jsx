import React from 'react'

const Conversation = ({ conversation, currentUser }) => {

  const otherUser = conversation.participants.find((user) => user._id !== currentUser._id)
  const lastMessage = conversation.messages[0]

  const date = new Date(lastMessage?.createdAt);
  const agotime = Date.now() - date;
  const min = (agotime / 1000) / 60;
  const hour = (agotime / 1000) / 60 / 60;
  const day = (agotime / 1000) / 60 / 60 / 24 / 365;
  let messageTime;

  if (min < 60) {
    messageTime = `${Math.floor(min)} min ago`
  } else if (min > 60 && min < 60 * 24) {
    messageTime = `${Math.floor(hour)} hours ago`
  } else if (hour > 24 && hour < 24 * 30) {
    messageTime = `${Math.floor(hour / 24)} days ago`
  } else if (day > 365) {
    messageTime = `${Math.floor(day)} year ago`
  }

  return (
    <div className='my-1 w-full xl:px-4 flex justify-center cursor-pointer hover:scale-105 transition-all'>
      <div className='flex gap-2 items-center border-2 border-slate-400 rounded-full p-1 w-10/12 md:mx-1 xl:mx-0 '>
        <img src={otherUser?.avatar || "/user_keov54.png"} className='rounded-full h-16' alt="" />
        <div className='mr-auto'>
          <p className='text-xl font-semibold'>{otherUser?.username}</p>
          {lastMessage?.sender === currentUser._id ? <p className='text-md'><span className='font-semibold'>you:</span>  {lastMessage?.text.slice(0, 15)}...</p> : <p className='text-md'>{lastMessage?.text.slice(0, 20)}...</p>}
        </div>
        <p className='text-xs'>{messageTime}</p>
      </div>
    </div>
  )
}

export default Conversation
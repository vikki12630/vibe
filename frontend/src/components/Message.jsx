import React from 'react'


const Message = ({ message, currentUser, scrollRef, otherUser }) => {
  // console.log(message)
  return (
    <>
      {message?.sender === currentUser._id ?
        <div ref={scrollRef} className='flex flex-col self-end w-3/4 mt-2'>
          <div className=' flex gap-2 self-end'>
            <p className=' border-2 rounded-lg px-2 py-1 my-auto bg-slate-100 shadow shadow-black break-all text-xl'>{message?.text}</p>
            <img
              src={currentUser.avatar || "/user_keov54.png"}
              alt=""
              className='rounded-full h-10 md:h-12 self-center'
            />
          </div>
          {/* <p className='text-right mr-8 md:mr-12'> msg time</p> */}
        </div>
        :
        <div ref={scrollRef} className=' self-start flex flex-col w-3/4 mt-2'>
          <div className='flex gap-2 w-fit h-fit'>
            <img
              src={otherUser?.avatar || "/user_keov54.png"}
              alt=""
              className='rounded-full h-10 md:h-12 self-center'
            />
            <p className=' border-2 rounded-lg px-2 py-1 my-auto bg-slate-200 shadow shadow-black break-all text-xl'>{message?.text}</p>
          </div>
          {/* <p className='text-left ml-8 md:ml-12'>msg time</p> */}
        </div>}
    </>
  )
}

export default Message
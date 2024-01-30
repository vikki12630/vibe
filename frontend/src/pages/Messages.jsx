import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { GrAdd } from "react-icons/gr";
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux'
import { LuSendHorizonal } from "react-icons/lu";
import LeftNavHome from '../components/LeftNavHome';
import Conversation from '../components/Conversation';
import Message from '../components/Message';
import ConversationSearchedUser from '../components/ConversationSearchedUser';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import conf from '../conf/conf';

const Messages = ({ socket }) => {


  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMsg, setArrivalMsg] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [addSectionOpenClose, setAddSectionOprnClose] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const scrollRef = useRef()
  const searchRef = useRef();

  useEffect(() => {
    setOtherUser(currentChat?.participants?.find((user) => user._id !== currentUser._id))
  }, [currentChat])


  useEffect(() => {
    const getUserConversation = async () => {
      try {
        const config = {
          withCredentials: true
        }
        const response = await axios.get(`${conf.backendUrl}/api/v1/conversations/${currentUser._id}`, config)
        setConversations(response?.data?.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserConversation()
  }, [currentUser])


  const addConversationOpenBtn = async (e) => {
    e.preventDefault()
    setAddSectionOprnClose(section => !section)
  }
  const closeConversationBtn = () => {
    setAddSectionOprnClose(section => !section)
    setSearch("")
    setSearchedUser([])
  }

  useEffect(() => {
    let cancel
    if (!search.trim()) {
      setSearchedUser([])
      return;
    }
    const searchInput = async () => {
      try {
        const config = {
          withCredentials: true,
          cancelToken: new axios.CancelToken((c) => cancel = c),
        }
        await new Promise(resolve => setTimeout(resolve, 100))

        const response = await axios.get(`${conf.backendUrl}/api/v1/users/searchUser?search=${search}`, config)

        setSearchedUser(response?.data?.data)
      } catch (error) {
        if (axios.isCancel(error)) {
          return
        } else if (error?.response?.status === 404) {
          toast.error("invalid username or email");
        }
      }
    }
    searchInput()
    return () => {
      cancel()
    }
  }, [search])


  const filteredSearchUser = searchedUser?.filter((user) => user._id !== currentUser._id)

  useEffect(() => {
    if (currentChat === null) {
      return;
    }
    const getMessages = async () => {
      try {
        const config = {
          withCredentials: true
        }
        const response = await axios.get(`${conf.backendUrl}/api/v1/messages/${currentChat?._id}`, config)
        setMessages(response?.data?.data)
      } catch (error) {
        console.log(error)
      }
    }
    getMessages()

  }, [currentChat])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" })
  }, [messages])

  const sendChat = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "content-type": "application/json"
        },
        withCredentials: true
      }
      const response = await axios.post(`${conf.backendUrl}/api/v1/messages/createMessage`, {
        text: newMessage,
        sender: currentUser._id,
        conversationId: currentChat._id,
      }, config)
      // console.log(response?.data?.data)
      socket.emit("sendMsg", {
        senderId: currentUser._id,
        receiverId: otherUser?._id,
        text: newMessage,
        conversationId: currentChat._id
      })
      setMessages([...messages, {
        text: newMessage,
        sender: currentUser._id,
        conversationId: currentChat._id,
      }])
      setNewMessage("")

    } catch (error) {
      // console.log(error)
      toast.error("unable to send try again")
    }
  }

  useEffect(() => {
    socket?.on("getMsg", (data) => {
      // console.log(data)
      setArrivalMsg({
        sender: data.senderId,
        text: data.text,
        conversationId: data.conversationId
      })
    })
  }, [])
  const participants = currentChat?.participants?.map(user => user._id)

  useEffect(() => {
    arrivalMsg && participants.includes(arrivalMsg.sender) &&
      setMessages([...messages, arrivalMsg])
  }, [arrivalMsg, currentChat])

  return (
    <div className='flex w-full flex-col md:flex-row h-svh'>
      <LeftNavHome setCurrentChat={setCurrentChat} />
      <div className='w-full xl:w-7/12 flex flex-col justify-center items-center relative'>
        {currentChat ? <>
          <div className="w-full bg-[url('/chat-page.svg')] h-svh flex flex-col pt-20 xl:pt-0 mx-auto relative items-center ">
            <p className='absolute bottom-0 left-0 pb-2 text-xs opacity-20'><a href="https://www.freepik.com/free-vector/simple-blue-gradient-background-vector-business_35481295.htm#fromView=search&term=background+svg&track=ais&regularType=vector&page=6&position=3&uuid=77368b92-2c5f-4236-ad74-8325427b1809">Image by rawpixel.com</a> on Freepik</p>
            <div className='flex py-1 xl:py-2 px-5 gap-4 shadow-md w-full items-center border-b-2 border-black'>
              <img
                src={otherUser?.avatar || "/user_keov54.png"}
                className='rounded-full h-16'
              />
              <p className='text-3xl font-semibold'>{otherUser?.username}</p>
            </div>
            <div id='messages' className="w-full  flex flex-col gap-1 h-svh overflow-auto overflow-y-scroll no-scrollbar pb-24 px-4 xl:px-10 ">


              {messages?.map((message) => (
                <Message
                  scrollRef={scrollRef}
                  key={nanoid()}
                  currentUser={currentUser}
                  message={message}
                  otherUser={otherUser}
                />
              ))}
            </div>
            <form onSubmit={sendChat} className='h-14 absolute bottom-4 left-0 right-0  mx-auto w-10/12 flex gap-2 '>
              <input
                type="text"
                name='newMessage'
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                className='border-2 border-slate-900 bg-slate-300 placeholder:text-black rounded-xl h-12 px-4 w-full'
                placeholder='Enter text..'
              />
              <button
                // disabled={loading}
                type='submit'
                className='h-12 bg-green-400 w-16 rounded-xl'>
                <LuSendHorizonal className='mx-auto text-3xl' />
              </button>
            </form>
          </div>
        </> :
          <div className='hidden md:block h-svh'>
            <img src="/openconversation.svg" className='h-4/6' alt="" />
            <p className='text-center text-4xl '>open a conversation</p>
            <p className='absolute bottom-2 left-0 hover:bg-green-200'>
              <a href="https://www.freepik.com/free-vector/happy-man-online-dating-via-laptop_9649925.htm#query=chat%20svg&position=11&from_view=keyword&track=ais&uuid=6ecd0f69-6103-4adb-9e84-376626ce7a24">Image by pch.vector on Freepik</a>
            </p>
          </div>
        }
      </div>
      <div className='w-full mt-20 xl:mt-0 md:border-l-4 xl:w-3/12 overflow-auto overflow-y-scroll no-scrollbar flex flex-col '>
        <button
          onClick={addConversationOpenBtn}
          className='sticky w-9/12 self-center  bg-green-500 rounded-lg top-0 right-6 p-3 hover:bg-green-600 hover:text-white hover:scale-105 flex items-center justify-center gap-3 my-2 text-xl font-semibold'>
          <GrAdd /><span>New conversation</span>
        </button>
        {conversations.map(chat => (
          <div key={chat._id} onClick={() => setCurrentChat(chat)}>
            <Conversation conversation={chat} currentUser={currentUser} />
          </div>
        ))}

      </div>

      <section className={`absolute top-0 h-svh bg-transparent w-full text-5xl flex-col items-center justify-center transition-all ${addSectionOpenClose ? 'flex' : 'hidden'}`}
      >
        <div className='w-full xl:w-5/12 bg-slate-200  h-svh xl:h-2/3 xl:rounded-2xl overflow-auto overflow-y-scroll no-scrollbar flex flex-col items-center mt-20 xl:mt-0'>
          <button
            onClick={closeConversationBtn}
            className='text-6xl text-red-500 px-6 self-end hover:scale-95'>
            <IoClose />
          </button>
          <form name='searchInput' className='w-full items-center flex flex-col'>
            <input
              type="text"
              ref={searchRef}
              value={search}
              name='searchInput'
              onChange={(e) => setSearch(e.target.value)
              }
              placeholder='Enter username or name'
              className='placeholder:text-slate-300 px-5 h-16 w-3/4 text-3xl text-center py-3 rounded-xl border-2 border-slate-500 text-slate-900 mb-2 '
            />
          </form>
          {filteredSearchUser?.map((user) => (
            <ConversationSearchedUser
              setAddSectionOprnClose={setAddSectionOprnClose}
              setCurrentChat={setCurrentChat}
              setOtherUser={setOtherUser}
              key={user._id}
              user={user}
              currentUser={currentUser} />
          ))}

        </div>
      </section>

    </div>
  )
}

export default Messages
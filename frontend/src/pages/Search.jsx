import React, { useRef, useState } from 'react'
import { MdDeleteForever } from "react-icons/md"
import axios from "axios"
import SearchedUserResults from '../components/SearchedUserResults'
import { useSelector } from 'react-redux'
import { IoIosSearch } from "react-icons/io";
import { toast } from 'sonner';
import conf from "../conf/conf"

const Search = () => {
  const searchRef = useRef();
  const [search, setSearch] = useState("")
  const [searchedUser, setSearchedUser] = useState([])
  const { currentUser } = useSelector((state) => state.auth)

  const inputForm = (e) => {
    e.preventDefault()
    const searchInput = async () => {
      try {
        const config = {
          withCredentials: true
        }
        const response = await axios.get(`${conf.backendUrl}/api/v1/users/searchUser?search=${search}`, config)
        setSearchedUser(response?.data?.data)
      } catch (error) {
        toast.error(error?.response?.status === 404 ? "Invalid username or email" : "user not found try again")
      }
    }
    searchInput()
  }

  const clearBtnOnSearch = (e) => {
    e.preventDefault()
    setSearch("")
    setSearchedUser([])
  }

  const filteredSearchUser = searchedUser.filter((user) => user._id !== currentUser._id)

  return (
    <div className='w-full mt-20 xl:mt-0 py-2'>
      <div className='w-3/4 mx-auto flex items-center '>
        <form name='searchInput' className='w-full flex items-center bg-slate-200 border-2 border-slate-800 shadow-xl  rounded-lg' onSubmit={inputForm}>
          < IoIosSearch className='text-4xl text-slate-300' />

          <input
            type="text"
            ref={searchRef}
            value={search}
            name='searchInput'
            onChange={(e) => setSearch(e.target.value)
            }
            placeholder="username or name"
            className='placeholder:text-slate-300 bg-slate-200  py-3  placeholder:text-xl  flex text-[20px] outline-none w-full rounded-xl '
          />
        </form>
        <button
          className='text-red-500 ml-3 text-4xl'
          onClick={clearBtnOnSearch}
        >
          <MdDeleteForever />
        </button>
      </div>
      { filteredSearchUser?.map((user) => (
        <SearchedUserResults key={user._id} user={user} />
      )) }
    </div>
  )
}

export default Search
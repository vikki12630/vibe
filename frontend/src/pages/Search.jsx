import React, { useEffect, useRef, useState } from 'react'
import { MdDeleteForever } from "react-icons/md"
import axios from "axios"
import SearchedUserResults from '../components/SearchedUserResults'
import { useSelector } from 'react-redux'
import { IoIosSearch } from "react-icons/io";
import { toast } from 'sonner';
import conf from "../conf/conf"

const Search = () => {
  const searchRef = useRef();
  const [search, setSearch] = useState('')
  const [searchedUser, setSearchedUser] = useState([])
  const { currentUser } = useSelector((state) => state.auth)

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
  }, [search]);

  const clearBtnOnSearch = (e) => {
    e.preventDefault()
    setSearch("")
    setSearchedUser([])
  }

  const filteredSearchUser = searchedUser.filter((user) => user._id !== currentUser._id)

  return (
    <div className='w-full mt-20 xl:mt-0 py-2'>
      <div className='w-3/4 mx-auto flex items-center '>
        <form name='searchInput' className='w-full flex items-center bg-slate-200 border-2 border-slate-800 shadow-xl  rounded-lg'>
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
      {filteredSearchUser?.map((user) => (
        <SearchedUserResults key={user._id} user={user} />
      ))}
    </div>
  )
}

export default Search
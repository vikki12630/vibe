import React from 'react'
import Search from "../pages/Search"

const RightNavHomeBigScreen = () => {
  return (
    <div className='hidden xl:block xl:w-3/12 h-svh overflow-auto h-42 overflow-y-scroll no-scrollbar  bg-slate-200'>
      <Search />
    </div>
  )
}

export default RightNavHomeBigScreen
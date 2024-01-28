import React from 'react'

const ProfilePagePostComponent = ({ post }) => {
  // console.log(post)
  return (
    <>
      <img
        src={post?.postImage}
        alt="postImage"
        className='w-1/3 h-fit p-0.5'
      />
    </>
  )
}

export default ProfilePagePostComponent
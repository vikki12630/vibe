import axios from 'axios';
import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { IoImages } from "react-icons/io5";
import { newPosts } from '../storeAndSlices/userPostSlice'
import { toast } from 'sonner';
import conf from "../conf/conf"

const AddPost = ({ setIsPostMenu, setNewUserFeed }) => {

  const dispatch = useDispatch()

  const [text, setText] = useState("")
  const [file, setFile] = useState(null)
  const [postBtnLoading, setPostBtnLoading] = useState(false)

  const { currentUser } = useSelector((state) => state.auth)
  const { userPosts } = useSelector((state) => state.posts)

  const postedBy = currentUser?._id
  const image = document.getElementById('preview');

  const postImages = (event) => {
    let input = event.target;

    setFile(input.files[0])
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        image.src = e.target.result
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  const postBtnHandler = async (e) => {
    e.preventDefault()
    setPostBtnLoading(true)
    const myForm = new FormData()
    myForm.set("postedBy", postedBy);
    myForm.set("text", text);
    myForm.set("postImage", file)
    try {
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        },
        withCredentials: true
      }
      const postImage = new FormData()
      postImage.append('file', file)
      const response = await axios.post(`${conf.backendUrl}/api/v1/posts/createPost`, myForm, config)
      image.src = "/gallery.svg"
      setFile(undefined)
      toast.success("post created successfully")

      setNewUserFeed((prev) => [{
        _id: response?.data?.data._id,
        text: response?.data?.data.text,
        postImage: response?.data?.data.postImage,
        likes: response?.data?.data.likes,
        comments: response?.data?.data.comments,
        createdAt: response?.data?.data.createdAt,
        postedBy: {
          avatar: currentUser?.avatar,
          username: currentUser?.username,
        }
      }, ...prev])
      const newPost = [response?.data?.data, ...userPosts]
      dispatch(newPosts(newPost))
      setText("")
      
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.status === 400 ? "image feild is empty" : "Unable to upload try again")
    } finally {
      setIsPostMenu(current => !current)
      setPostBtnLoading(false)
    }
  }

  return (
    <div className='w-full flex mt-20 items-center flex-col xl:flex-row gap-2 xl:justify-center xl:gap-4 xl:px-2 xl:mt-20'>
      <img loading='lazy' id="preview" src="/gallery.svg" alt='img' className='w-60 md:w-80 xl:h-80 my-2 xl:my-0' />
      <div className='flex flex-col items-center w-5/6 '>
        <div className=' flex flex-col items-center gap-3 ' >

          <label
            htmlFor="postImg"
            className='flex items-center gap-5 text-3xl hover:cursor-pointer xl:my-4'
          >
            <IoImages />
            <span className='text-xl text-blue-400'>
              add Image
            </span>
          </label>
          <input
            className='hidden'
            type="file"
            name="postImg"
            id="postImg"
            accept='image/*'
            onChange={postImages}
            disabled={postBtnLoading}
          />

        </div>
        <input
          disabled={postBtnLoading}
          placeholder='add caption'
          name='addTextInput'
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='placeholder:text-slate-300 px-5 h-16 w-full sm:w-3/4 xl:w-full text-3xl text-center py-3 rounded-xl border-2 border-slate-500 text-slate-900 mb-2 '
        />

        <button
          disabled={postBtnLoading}
          onClick={postBtnHandler}
          className='bg-blue-400 w-full sm:w-3/4 xl:w-full h-16 px-5 py-1.5 rounded-lg text-3xl'
        >{postBtnLoading ? <img className=' h-12 my-auto mx-auto' src="/btnLoading.svg" alt="Loading.." /> : "Post"}</button>
      </div>

    </div>
  )
}

export default AddPost
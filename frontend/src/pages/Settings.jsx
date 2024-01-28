import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LiaUserEditSolid } from "react-icons/lia";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoClose, IoImages } from 'react-icons/io5';
import axios from "axios";
import { useOutletContext } from 'react-router-dom';

const Settings = ({ getCurrentUser }) => {

  const { currentUser } = useSelector((state) => state.auth);

  //***************toggle states **************/
  const [isAvatar, setIsAvatar] = useState(false);
  const [isUserName, setIsUserName] = useState(false);
  const [isName, setIsName] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  //****************new data state***************//
  const [file, setFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [getUserFeed] = useOutletContext()

  // ******************* loading state *************//
  const [btnLoading, setBtnLoading] = useState(false)

  const config = {
    headers: {
      "content-type": "application/json"
    }
  }

  // ****************change avatar/profile pic****************//

  const image = document.getElementById('avatarPreview');

  const changeAvatarHandler = () => {
    setIsAvatar(current => !current)
  }
  const closeChangeAvatar = () => {
    setIsAvatar(current => !current)
  }
  const avatarImage = (event) => {
    let input = event.target;

    setFile(input.files[0])
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        image.src = e.target.result;
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  const changeAvatarBtn = async(e) => {
    e.preventDefault()
    setBtnLoading(true)
    const myForm = new FormData()
    myForm.set("avatar", file)
    try {
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      }
      
      await axios.put("/api/v1/users/updateAvatar", myForm, config)
      getCurrentUser()
      getUserFeed()
      image.src = ""
      setIsAvatar(current => !current)
      setBtnLoading(false)
      setFile(undefined)
    } catch (error) {
      console.log(error)
      setBtnLoading(false)
    }
  }

  // ****************change username****************//
  const changeUserNameHandler = () => {
    setIsUserName(current => !current)
  }
  const closeChangeUserName = () => {
    setIsUserName(current => !current)
  }
  const changeUsernameBtn = async(e) => {
    e.preventDefault()
    setBtnLoading(true)
    try {
      await axios.put('/api/v1/users/updateUsername', { newUsername }, config)
      console.log("username updated")
      getCurrentUser()
      getUserFeed()
      setIsUserName(current => !current)
      setBtnLoading(false)
    } catch (error) {
      console.log(error)
      setBtnLoading(false)
    }
  }

  // ****************change fullname****************//

  const changeFullNameHandler = () => {
    setIsName(current => !current)
  }
  const closeChangeFullName = () => {
    setIsName(current => !current)
  }
  const changeFullNameBtn = async(e) => {
    e.preventDefault()
    setBtnLoading(true)
    try {
      await axios.put('/api/v1/users/updateFullName', { newFullName }, config)
      console.log("fullName updated")
      getCurrentUser()
      setIsName(current => !current)
      setBtnLoading(false)
    } catch (error) {
      console.log(error)
      setBtnLoading(false)
    }
  }

  // ****************change email****************//

  const changeEmailHandler = () => {
    setIsEmail(current => !current)
  }
  const closeChangeEmail = () => {
    setIsEmail(current => !current)
  }
  const changeEmailBtn = async(e) => {
    e.preventDefault()
    setBtnLoading(true)
    try {
      await axios.put('/api/v1/users/updateEmail', { newEmail }, config)
      console.log("email updated")
      getCurrentUser()
      setIsEmail(current => !current)
      setBtnLoading(false)
    } catch (error) {
      console.log(error)
      setBtnLoading(false)
    }
  }

  // ****************change password****************//

  const changePasswordHandler = () => {
    setIsPassword(current => !current)
  }
  const closeChangePassword = () => {
    setIsPassword(current => !current)
  }
  const changePasswordBtn = async(e) => {
    e.preventDefault()
    setBtnLoading(true)
    try {
      await axios.put('/api/v1/users/updatePassword', { oldPassword, newPassword }, config)
      console.log("password updated")
      getCurrentUser()
      setIsPassword(current => !current)
      setBtnLoading(false)
    } catch (error) {
      console.log(error)
      setBtnLoading(false)
    }
  }

  return (

    <>
      <div className='w-full h-screen transition-all xl:w-6/12'>
        <div className='mt-20 flex flex-col items-center xl:mt-0 '>
          <div className='flex items-center underline gap-4 text-6xl font-semibold mb-6'>Settings <LiaUserEditSolid />
          </div>
          <div className='w-3/4 mx-auto gap-2 flex flex-col'>
            <div onClick={changeAvatarHandler} className='self-center flex flex-col text-3xl cursor-pointer'>
              <img
                src={currentUser?.avatar || "/user_keov54.png"}
                alt="profile img"
                className='h-40 rounded-full'
              />
              <HiMiniPencilSquare className='self-end' />
            </div>
            <div>
              <p className='ml-2 text-xl opacity-50'>username</p>
              <div
                onClick={changeUserNameHandler} className='flex w-full h-14 px-5 items-center justify-between text-2xl bg-slate-200 rounded-xl cursor-pointer hover:scale-105'
              >
                <p className='font-semibold '> {currentUser?.username}</p>
                <HiMiniPencilSquare />
              </div>
            </div>
            <div>
              <p className='ml-2 text-xl opacity-50'>full name</p>
              <div
                onClick={changeFullNameHandler} className='flex w-full h-14 px-5 items-center justify-between text-2xl bg-slate-200 rounded-xl cursor-pointer hover:scale-105'
              >
                <p className='font-semibold '> {currentUser?.fullName}</p>
                <HiMiniPencilSquare />
              </div>
            </div>
            <div>
              <p className='ml-2 text-xl opacity-50'>email</p>
              <div
                onClick={changeEmailHandler} className='flex w-full h-14 px-5 items-center justify-between text-2xl bg-slate-200 rounded-xl cursor-pointer hover:scale-105'
              >
                <p className='font-semibold '> {currentUser?.email}</p>
                <HiMiniPencilSquare />
              </div>
            </div>
            <div>
              <p className='ml-2 text-xl opacity-50'>password</p>
              <div
                onClick={changePasswordHandler}
                className='flex w-full h-14 px-5 items-center justify-between text-2xl bg-slate-200 rounded-xl cursor-pointer hover:scale-105'
              >
                <p className='font-semibold '>change password</p>
                <HiMiniPencilSquare />
              </div>
            </div>

          </div>
        </div>
      </div>
      <section className={isAvatar ? 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all flex' : 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all hidden'}>
        <div className=' flex flex-col w-full xl:w-6/12  mt-28'>
          <button
            onClick={closeChangeAvatar}
            className='text-6xl text-red-500 self-end px-6 py-4 hover:scale-95'>
            <IoClose />
          </button>
          <img id='avatarPreview' src={currentUser?.avatar || "/user_keov54.png"} alt='img preview' className='w-40 text-lg rounded-full self-center mb-3'></img>
          
          <label
            htmlFor="newAvatar"
            className='flex items-center gap-5 text-5xl hover:cursor-pointer justify-center mb-5'
          >
            <IoImages />
            <span className='text-xl '>
             choose img
            </span>
          </label>
          <input
            type="file"
            accept='image/*'
            name='newAvatar'
            id='newAvatar'
            onChange={avatarImage}
            className='hidden'
          />
          
          <button
            onClick={changeAvatarBtn}
            disabled={btnLoading || !file}
            className='text-4xl w-full flex bg-slate-500 mx-4 h-16 rounded-xl hover:bg-slate-700 py-2 hover:text-white justify-center'>{btnLoading ? <img className=' h-12 my-auto' src="/btnLoading.svg" alt="Loading..." /> : "submit"}</button>

        </div>
      </section>
      <section className={isUserName ? 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all flex' : 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all hidden'}>
        <div className=' flex flex-col w-full xl:w-6/12 h-1/3 mt-28'>
          <button
            onClick={closeChangeUserName}
            className='text-6xl text-red-500 self-end px-6 py-4 hover:scale-95'>
            <IoClose />
          </button>
          <p className='mx-5 text-3xl'>username</p>
          <input
            type="text"
            placeholder='change username'
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className='placeholder:text-slate-500 placeholder:opacity-40 px-5 text-4xl text-center pb-2 h-16 mx-4 rounded-xl border-2 border-slate-500 mb-7'
          />
          <button
            onClick={changeUsernameBtn}
            className='text-4xl w-full flex bg-slate-500 mx-4 h-16 rounded-xl hover:bg-slate-700 py-2 hover:text-white justify-center'>{btnLoading ? <img className=' h-12 my-auto' src="/btnLoading.svg" alt="Loading..." /> : "submit"}</button>

        </div>
      </section>

      <section className={isName ? 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all flex' : 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all hidden'}>
        <div className=' flex flex-col w-full xl:w-6/12 h-1/3 mt-28'>
          <button
            onClick={closeChangeFullName}
            className='text-6xl text-red-500 self-end px-6 py-4 hover:scale-95'>
            <IoClose />
          </button>
          <p className='mx-5 text-3xl'>full name</p>
          <input
            type="text"
            placeholder='change full name'
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            className='placeholder:text-slate-500 placeholder:opacity-40 px-5 text-4xl text-center pb-2 h-16 mx-4 rounded-xl border-2 border-slate-500 mb-7'
          />
          <button
            onClick={changeFullNameBtn}
            className='text-4xl w-full flex justify-center bg-slate-500 mx-4 h-16 rounded-xl hover:bg-slate-700 py-2 hover:text-white'>{btnLoading ? <img className=' h-12 my-auto' src="/btnLoading.svg" alt="Loading..." /> : "submit"}</button>

        </div>
      </section>

      <section className={isEmail ? 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all flex' : 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all hidden'}>
        <div className=' flex flex-col w-full xl:w-6/12 h-1/3 mt-28'>
          <button
            onClick={closeChangeEmail}
            className='text-6xl text-red-500 self-end px-6 py-4 hover:scale-95'>
            <IoClose />
          </button>
          <p className='mx-5 text-3xl'>email</p>
          <input
            type="text"
            placeholder='change email'
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className='placeholder:text-slate-500 placeholder:opacity-40 px-5 text-4xl text-center pb-2 h-16 mx-4 rounded-xl border-2 border-slate-500 mb-7'
          />
          <button
            onClick={changeEmailBtn}
            className='text-4xl w-full flex justify-center bg-slate-500 mx-4 h-16 rounded-xl hover:bg-slate-700 py-2 hover:text-white'>{btnLoading ? <img className=' h-12 my-auto' src="/btnLoading.svg" alt="Loading..." /> : "submit"}</button>

        </div>
      </section>

      <section className={isPassword ? 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all flex' : 'absolute top-0 h-screen bg-slate-200 w-full text-5xl flex-col items-center transition-all hidden'}>
        <div className=' flex flex-col w-full xl:w-6/12 h-1/3 mt-28'>
          <button
            onClick={closeChangePassword}
            className='text-6xl text-red-500 self-end px-6 py-4 hover:scale-95'>
            <IoClose />
          </button>
          <p className='mx-5 text-3xl'>old password</p>
          <input
            type="text"
            placeholder='old password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className='placeholder:text-slate-500 placeholder:opacity-40 px-5 text-4xl text-center pb-2 h-16 mx-4 rounded-xl border-2 border-slate-500 mb-7'
          />
          <p className='mx-5 text-3xl'>new password</p>
          <input
            type="text"
            placeholder='new password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='placeholder:text-slate-500 placeholder:opacity-40 px-5 text-4xl text-center pb-2 h-16 mx-4 rounded-xl border-2 border-slate-500 mb-7'
          />
          <button
            onClick={changePasswordBtn}
            className='text-4xl w-full flex justify-center bg-slate-500 mx-4 h-16 rounded-xl hover:bg-slate-700 py-2 hover:text-white'>{btnLoading ? <img className=' h-12 my-auto' src="/btnLoading.svg" alt="Loading..." /> : "submit"}</button>

        </div>
      </section>
    </>
  )
}

export default Settings
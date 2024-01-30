import React, { useRef, useState, useEffect } from 'react'
import axios from "axios"
import { login } from '../storeAndSlices/authSlice';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'sonner';
import conf from '../conf/conf';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,24}$/;
const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

const SignUp = () => {
  const userRef = useRef();
  const errRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState('');
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [fullName, setFullName] = useState('');
  const [fullNameFocus, setFullNameFocus] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home')
    }
  }, [])

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUserName(result);
  }, [username])

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
  }, [password])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email])

  useEffect(() => {
    setErrMsg('');
  }, [username, password, email])

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "content-type": "application/json"
        },
        withCredentials: true
      }
      await axios.post(`${conf.backendUrl}/api/v1/users/signUp`, { fullName, email, password, username }, config)
      toast.success("Sign-Up success")
      navigate("/home")
      dispatch(login())
    } catch (error) {
      console.log(error)
      toast.error(error.response.status === 401 ? "Username or Email already exists" : "Sign Up failed try again")
      errRef.current.focus();
    }
  }


  return (
    <div className='flex flex-col xl:flex-row h-svh w-full items-center'>
      <img src="/loginpage.svg" className='w-10/12 xl:h-svh' alt="" />
      <div className=' text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-400 to-cyan-500 flex flex-col w-full items-center justify-center  gap-2'>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Sign Up</h1>
        <form className='flex text-black font-medium text-2xl flex-col w-10/12 gap-4 p-4 rounded-xl  ' name='signUpForm' onSubmit={handleSignupSubmit}>
          <label className='hidden' htmlFor="username">Username:</label>
          <input
            placeholder='Username'
            name='username'
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUserName(e.target.value)}
            required
            aria-invalid={validUserName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserNameFocus(true)}
            onBlur={() => setUserNameFocus(false)}
            className='border-black border-b-2 py-2 px-2 placeholder:text-center placeholder:font-extrabold text-center outline-none'
          />
          <p id="uidnote" className={userNameFocus && username && !validUserName ? "instructions" : "offscreen"}>
            4 to 24 characters. <br />
            Must begin with a letter. <br />
            Letters, numbers, underScores, hyphens allowed.
          </p>

          <label className='hidden' htmlFor="email">Email:</label>
          <input
            placeholder='Email'
            name='email'
            type="text"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="emailNote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            className='border-black border-b-2 py-2 px-2 placeholder:text-center placeholder:font-extrabold text-center outline-none'
          />
          <p id="emailNote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
            Enter a valid email address. <br />
            ex:- example@example.com <br />
            ex:- sample@123.com
          </p>

          <label className='hidden' htmlFor="fullName">Fullname:</label>
          <input
            name='fullName'
            placeholder='Name'
            type="text"
            id="fullName"
            onChange={(e) => setFullName(e.target.value)}
            required
            onFocus={() => setFullNameFocus(true)}
            onBlur={() => setFullNameFocus(false)}
            className='border-black border-b-2 py-2 px-2 placeholder:text-center placeholder:font-extrabold text-center outline-none'
          />

          <label className='hidden' htmlFor="password">Password:</label>
          <input
            name='password'
            placeholder='Password'
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-invalid={validPassword ? "false" : "true"}
            aria-describedby="passwordNote"
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            className='border-black border-b-2 py-2 px-2 placeholder:text-center placeholder:font-extrabold text-center outline-none'
          />
          <p id="passwordNote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
            8 to 24 characters. <br />
            Must include lowercase letters and numbers.
          </p>

          <button

            className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  font-medium rounded-lg text-2xl  text-center me-2 mb-2 mt-4 h-16'
          >{loading ? <img className=' h-12 my-auto mx-auto' src="/btnLoading.svg" alt="Loading..." /> : "Sign Up"}</button>
        </form>
        <Link className='text-lg' to={"/"}>Already have an account? Login</Link>
      </div>
    </div>
  )
}

export default SignUp
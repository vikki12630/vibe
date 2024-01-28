import React, { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../storeAndSlices/authSlice';
import { toast } from 'sonner';



const Login = () => {
  const emailRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
   if (isAuthenticated) {
    navigate('/home')
   }
  }, [isAuthenticated])
  
  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, password])

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const config = {
        headers: {
          "content-type": "application/json"
        }
      }
      await axios.post("/api/v1/users/signIn", { email, password }, config)
      dispatch(login())
      toast.success("login success")
      navigate("/home")
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.status === 403 ||404 ?"Invalid email or password": "login failed try again")
      errRef.current.focus();
      setLoading(false)
    }
  }


  return (
    <div className='flex flex-col xl:flex-row h-screen w-full'>
        <img src="/loginpage.svg" className='' alt="" />
      
      <div className=' text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-400 to-cyan-500 flex flex-col w-full items-center justify-center  gap-2'>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1 >Sign In</h1>
        <form className='flex text-black font-medium text-2xl flex-col w-10/12 gap-4 p-4 rounded-xl  '
        name='loginForm' onSubmit={handleLoginSubmit}>
          <label className='hidden' htmlFor="email">Email:</label>
          <input
          placeholder='email'
            type="text"
            id="email"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className='border-black border-b-2 py-4 px-2 placeholder:text-center placeholder:font-extrabold text-center outline-none'
          />

          <label className='hidden' htmlFor="password">Password:</label>
          <input
          placeholder='password'
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className='border-black border-b-2 py-4 px-2 placeholder:text-center placeholder:font-extrabold text-center  outline-none'
          />
          <button
            disabled={!email || !password}
            className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  font-medium rounded-lg text-2xl  text-center me-2 mb-2 mt-4 h-16 cursor-pointer'
          >{loading ? <img className=' h-12 my-auto mx-auto' src="/btnLoading.svg" alt="Loading..." /> : "Sign in"}</button>
        </form>
        <Link className='text-lg' to={"/signUp"}>Don't have an account? Sign Up</Link>
      </div>
    </div>
  )
}

export default Login
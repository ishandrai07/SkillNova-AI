import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'


const Login = () => {
  
  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate()

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const result = await handleLogin({email, password})
    if(result?.success) {
      navigate("/")
    } else {
      setError(result?.error || "Login failed. Please try again.")
    }
  }

  if(loading){
    return (<main><h1>Loading.....</h1></main>)
  }
    
  return (
    <main>
      <div className='form-container'>
        <div className='auth-brand'>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          <span>SkillNova</span>
        </div>
        <div className='auth-header'>
          <h1>Sign In</h1>
          <p>Access your technical interview workspace</p>
        </div>

        {error && <p className='error-message'>{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className='input-group'>
            <label htmlFor='email'>Email Address</label>
            <input onChange={(e)=>{setemail(e.target.value)}} type='email' id='email' name='email' placeholder='name@company.com' required />
          </div>
          <div className='input-group'>
            <label htmlFor='password'>Password</label>
            <input onChange={(e)=>{setpassword(e.target.value)}} type='password' id='password' name='password' placeholder='••••••••' required />
          </div>

          <button className='button primary-button'>Sign In</button>

        </form>
        <div className='auth-footer'>
          <p>Don't have an account? <Link to={"/register"}>Create Account</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Login
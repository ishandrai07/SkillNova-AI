import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';
import "../auth.form.scss"

const Register = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const result = await handleRegister({username, email, password})
    if(result?.success) {
      navigate("/login")
    } else {
      setError(result?.error || "Registration failed. Please try again.")
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
          <h1>Create Account</h1>
          <p>Get personalized technical interview strategy</p>
        </div>

        {error && <p className='error-message'>{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className='input-group'>
            <label htmlFor='username'>Username</label>
            <input onChange={(e)=>{setUsername(e.target.value)}} type='text' id='username' name='username' placeholder='johndoe' required />
          </div>
          <div className='input-group'>
            <label htmlFor='email'>Email Address</label>
            <input onChange={(e)=>{setEmail(e.target.value)}} type='email' id='email' name='email' placeholder='name@company.com' required />
          </div>
          <div className='input-group'>
            <label htmlFor='password'>Password</label>
            <input onChange={(e)=>{setPassword(e.target.value)}} type='password' id='password' name='password' placeholder='••••••••' required />
          </div>

          <button className='button primary-button'>Register Account</button>

        </form>

        <div className='auth-footer'>
          <p>Already have an account? <Link to={"/login"}>Sign In</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Register
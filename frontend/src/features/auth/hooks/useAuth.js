import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {login, register, logout, getMe} from "../services/auth.api"


export const useAuth = ()=> {
    const context = useContext(AuthContext)
    const {user, setuser, loading, setloading} = context


    const handleLogin = async ({email, password}) => {
        setloading(true)

        try{
            const data = await login({email, password})
            if(data?.user) {
                setuser(data.user)
                return { success: true }
            }
            return { success: false, error: "Login failed. Please try again." }
        }
        catch(err){
            const message = err?.response?.data?.message || "Invalid email or password"
            console.error("Login error:", err)
            return { success: false, error: message }
        }
        finally{
            setloading(false)
        }
    }

    const handleRegister = async ({username, email, password}) => {
        setloading(true)
        try{
            const data = await register({username, email, password})
            if(data?.user) {
                setuser(data.user)
                return { success: true }
            }
            return { success: false, error: "Registration failed. Please try again." }
        }
        catch(err){
            const message = err?.response?.data?.message || "Registration failed. Please try again."
            console.error("Register error:", err)
            return { success: false, error: message }
        }
        finally{
            setloading(false)
        }
    }
     
    const handleLogout = async () => {
        setloading(true)
        try{
            await logout()
            setuser(null)
        }
        catch(err){
            console.error("Logout error:", err)
        }
        finally{
            setloading(false)
        }
    }

    useEffect(() => {
      const getAndSetUser = async ()=> {
        try{
            const data = await getMe()
            if(data?.user) {
                setuser(data.user)
            }
        }
        catch(err){
            // No token / unauthorized — normal on fresh start
        }
        finally{
            setloading(false)
        }
      }

      getAndSetUser()

    }, [])

    return {user, loading, handleRegister, handleLogin, handleLogout}
}

import {React, useState} from 'react';
import {Link, useNavigate} from "react-router-dom"
import { setCookie } from '../utils/cookieUtils';
import api from '../utils/axiosConfig';
import useAuth from '../utils/useAuth';

const Login = () => {

    const navigate = useNavigate()
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState("")
    const [formData, setFormData] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        setErrorMessage("")
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setErrorMessage("Email dan password harus diisi!")
        }

        try {
            const response = await api.post('/login', {
                email: formData.email,
                password: formData.password
            })
            
            localStorage.setItem('accessToken', response.data.accessToken)
            setCookie('refreshToken', response.data.refreshToken, 7)

            login()
            navigate("/");
            alert("Sign in successfull!")

        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Terjadi kesalahan saat Sign in");
            }
        }

    }

    return (
        <div className="flex flex-col items-center bg-[#e1e1e1] justify-center h-screen">
            <div className="bg-[#f2f1f1] border-2 border-gray-300 rounded-lg p-6 shadow-md w-96 h-2/3">
                <div className="text-center mb-4">
                    <p className='font-bold text-2xl'>Sign in to Afterwork</p>
                    <p className=''>New here?<Link to="/register" className="text-blue-800">Create an account</Link></p>
                </div>
                <form onSubmit={handleLogin} className="flex flex-col">
                    <div className=" flex flex-col gap-1 mb-4">
                        <label htmlFor="email">Email</label>
                        <input className='w-full border-b border-[#3d3d3d] px-2 py-2  mt-1' type="text" name="email" placeholder="email" onChange={handleChange} required/>
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                        <label htmlFor="password">Password</label>
                        <input type={showPassword ? "text" : "password"} className='w-full border-b border-[#3d3d3d] px-2 py-2  mt-1' name="password" placeholder="password" onChange={handleChange} required autoComplete="current-password"/>
                    </div>
                    <label className="block mb-6">
                        <input type="checkbox" className="mr-2" onChange={() => setShowPassword((prev) => !prev)}/>
                        Show Password
                    </label>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-3 text-center">
                            {errorMessage}
                        </div>
                    )}
                    <div className="">
                        <button className='w-full border py-2 rounded-lg bg-[#173b71] text-white hover:bg-[#244678]' type="submit">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
export default Login;
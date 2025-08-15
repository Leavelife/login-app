import {React, useState} from 'react';
import {Link, useNavigate} from "react-router-dom"
import api from '../utils/axiosConfig';
import useAuth from '../utils/useAuth';
import { setCookie } from '../utils/cookieUtils';

const Register = () => {

    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Password tidak cocok");
            return;
        }
    
        try {
            const res = await api.post(`/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
        
            localStorage.setItem('accessToken', res.data.accessToken)
            setCookie('refreshToken', res.data.refreshToken, 7)

            login()
            navigate("/");
            alert("Reagister successfull!")

        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Terjadi kesalahan saat register");
            }
        }
      };

    return (
        <div className="flex flex-col items-center bg-[#e1e1e1] justify-center h-screen">
            <div className="bg-[#f2f1f1] border-2 border-gray-300 rounded-lg p-6 shadow-md w-96 h-4/5">
                <div className="text-center mb-4">
                    <p className='font-bold text-2xl'>Register to Afterwork</p>
                    <p className=''>Have an account? <Link to="/login" className="text-blue-800">Sign in here</Link></p>
                </div>
                <form onSubmit={handleRegister} className="flex flex-col">
                    <div className=" flex flex-col mb-2">
                        <label htmlFor="email">Username</label>
                        <input className='w-full border-b border-[#3d3d3d] px-2 py-2  mt-1' type="text" name="name" placeholder="username" onChange={handleChange} required/>
                    </div>
                    <div className=" flex flex-col mb-2">
                        <label htmlFor="email">Email</label>
                        <input className='w-full border-b border-[#3d3d3d] px-2 py-2  mt-1' type="text" name="email" placeholder="email" onChange={handleChange} required/>
                    </div>
                    <div className="flex flex-col mb-2">
                        <label htmlFor="password">Password</label>
                        <input type={showPassword ? "text" : "password"} className='w-full border-b border-[#3d3d3d] px-2 py-2  mt-1' name="password" placeholder="password" onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col mb-2">
                        <label htmlFor="password">Confirm Password</label>
                        <input type={showPassword ? "text" : "password"} className='w-full border-b border-[#3d3d3d] px-2 py-2  mt-1' name="confirmPassword" placeholder="confirm password" onChange={handleChange} required />
                    </div>
                    <label className="block">
                        <input type="checkbox" className="mr-2" onChange={() => setShowPassword((prev) => !prev)}/>
                        Show Password
                    </label>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-3 text-center">
                            {errorMessage}
                        </div>
                    )}
                    <div className="mt-3">
                        <button className='w-full border py-2 rounded-lg bg-[#173b71] text-white hover:bg-[#244678]' type="submit">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
export default Register;
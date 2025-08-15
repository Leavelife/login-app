import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import useAuth from "../utils/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate()
    
    const handleLogout = () => {
        logout();
        navigate("/")
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                // backend returns: { message, data: user }
                setUser(res.data?.data ?? null);
            } catch (err) {
                setError(err?.response?.data?.error || 'Gagal memuat profil');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <p className="font-bold text-lg">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <p className="text-gray-700">Data profil tidak ditemukan.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center w-screen h-screen">
            <div className="bg-[#f6f6f6] shadow rounded p-6 min-w-[320px]">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Nama</span>
                        <span>{user.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Dibuat</span>
                        <span>{new Date(user.created_at).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex">
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Profile;
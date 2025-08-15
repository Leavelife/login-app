import {Link} from 'react-router-dom';
import useAuth from '../utils/useAuth';

const Navbar = () => {
    const { isLoggedIn } = useAuth();

    return (
        <div className="fixed w-screen flex justify-between items-center px-14 py-3 bg-gray-800 text-white">
            <div>
                <p className="font-bold">
                    <Link to="/">Afterwork</Link>
                </p>
            </div>
            <div>
                <ul className='flex gap-4 items-center'>
                    {isLoggedIn ? (
                        <li>
                            <Link 
                                to="/profile" 
                                className="flex items-center hover:text-blue-300 cursor-pointer"
                            >
                            <div className='bg-[#c9c9c9] p-1 px-3 mx-2 rounded-full'>o</div>
                                Profile
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="hover:text-blue-300" >Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
export default Navbar;
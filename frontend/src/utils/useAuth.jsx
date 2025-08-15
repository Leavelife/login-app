import { useContext } from 'react';
import AuthContext from './AuthContextObject';

const useAuth = () => useContext(AuthContext);

export default useAuth;

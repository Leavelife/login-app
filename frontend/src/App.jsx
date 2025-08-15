import { Outlet } from "react-router-dom";
import AuthProvider from "./utils/AuthContext";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <AuthProvider>
    <Navbar/>
      <main className="p-0 m-0">
        <Outlet />
      </main>
    </AuthProvider>
  );
};

export default App;

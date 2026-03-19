import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Registation";
import UpdateUser from "./pages/Updateuser";
import Profile from "./pages/Profile";
import Footer from "./Footer";
import ListUser from "./pages/LIstUser";

export default function App() {


  

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Default route to HomePage */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updateuser/:id" element={<UpdateUser />} />
        <Route path="/listuser" element={<ListUser/>}/>
        <Route path="/profile" element={<Profile />} />
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}
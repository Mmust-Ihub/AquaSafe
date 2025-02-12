import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu icons
import { useAuth } from "../../context/AuthContext";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 md:px-12 lg:px-24">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-white text-xl font-bold">MyApp</h1>

        {/* Hamburger Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl md:hidden">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Menu Items */}
        <ul className={`absolute top-16 left-0 w-full bg-blue-600 md:static md:flex md:space-x-6 md:w-auto transition-all ${isOpen ? "block" : "hidden"} md:flex`}>
          <li className="text-white p-4 hover:bg-blue-700"><a href="#">Home</a></li>
          <li className="text-white p-4 hover:bg-blue-700"><a href="#">Dashboard</a></li>
          <li className="text-white p-4 hover:bg-blue-700"><a href="#">Profile</a></li>
          {user && (
            <button
              onClick={logout}
              className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 hover:cursor-pointer"
            >
              Logout
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
}

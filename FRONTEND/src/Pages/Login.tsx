// import { useState, type ChangeEvent, type FormEvent } from "react";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router-dom";
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

// const AuthPage = () => {
    
export default function Login() {
    const handleClick = () => {
        alert('Form submitted!');
    };
    const location = useLocation();
    const isLogin = location.pathname === '/login';
//   const navigate = useNavigate();

//   interface LoginData {
//     username: string;
//     password: string;
//   }

//   const { login } = useAuth();

//   const [formData, setFormData] = useState<LoginData>({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setFormData({
//       username: "",
//       password: "",
//     });
//     const success = await login(formData.username, formData.password);
//     if (success) navigate("/dashboard");
//   };

  return (
    <>
      {/* <form onSubmit={handleSubmit}>
                <label> Enter your username
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>
                <label> Enter your password
                    <input 
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit"> Submit</button>
            </form> */}
      <div
        className="min-h-screen w-full flex items-center justify-center 
    bg-[url('/images/bbg.jpeg')] bg-center bg-fixed bg-no-repeat
    bg-cover object-cover"
      >
        <div className="bg-black/50 dark:bg-zinc-900 p-8 rounded-2xl shadow-xl w-96 ">
          <h2 className="text-2xl font-bold text-center text-amber-50 mb-6">
            {isLogin ? "Sign in" : "Create Account"}
          </h2>
          <form className="text-gray-300 dark:text-gray-200">
            <input
              type="text"
              placeholder="login"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            {!isLogin && (
              <input
                type="Email"
                placeholder="Email"
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            )}
            <input
              type="password"
              placeholder="password"
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="confirms password"
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            )}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-sky-300 to-indigo-600 text-white py-2 rounded shadow hover:bg-blue-700 transition"
              onClick={handleClick}
            >
              {isLogin ? "Sign in" : "Register"}
            </button>
          </form>
          {isLogin && (
            <>
              <div className="mt-6 text-gray-200 flex items-center justify-center">
                <p>or</p>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
                  <FaGoogle size={20} />
                </button>
                <button className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900 transition">
                  <FaGithub size={20} />
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                  <FaFacebook size={20} />
                </button>
              </div>
              <div className="mt-6 text-center text-gray-300">
                <p>
                  <Link
                    to="/forgot-password"
                    className="text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </p>
                <p className="mt-4">
                  Don't have an account?{" "}
                  <Link
                    to="/new-account"
                    className="text-blue-400 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

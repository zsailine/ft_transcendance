import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

import { FaGoogle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { ImSpinner9 } from "react-icons/im";
import { toast } from "react-toastify";

export default function Login() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const navigate = useNavigate();

  interface LoginData {
    username: string;
    email?: string;
    password: string;
    confirmPassword?: string;
  }

  const { login, register } = useAuth();

  const [formData, setFormData] = useState<LoginData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormData({
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    });
    try
    {
      if (!isLogin) {
        console.log("Registering user:", formData);
        const success = await register(formData.username, formData.password, formData.email!);
        setTimeout(() => {
        }, 2000);
        if (success) 
        {
          navigate("/login");
        }
      }
      const success = await login(formData.username, formData.password);
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Done");
      if (success) 
      {
        navigate("/dashboard");
        toast.success("Successfully logged in !");
      }
    }
    catch (error)
    {
      console.error("Authentication error:", error);
    }
    finally
    {
      setIsLoading(false);
    }
  };

  const disablesStyle = isLoading ? "opacity-50 cursor-not-allowed" : "";

  const hoverEffect = "hover:z-10 hover:scale-105 ring-2 ring-transparent hover:ring-cyan-500/50 transition-transform transition-colors duration-300 ease-in-out transform-gpu origin-center"

  return (
    <>
      <div
        className="min-h-screen w-full flex items-center justify-center 
    bg-[url('/images/bg.jpg')] bg-center bg-fixed bg-no-repeat
    bg-cover object-cover"
      >

        <div className=" dark:bg-zinc-900/70 p-8 rounded-2xl shadow-xl w-96 ">
          <h2 className="text-2xl font-bold text-center text-amber-50 mb-6">
            {isLogin ? "Sign in" : "Create Account"}
          </h2>
          <form onSubmit={handleSubmit} className="text-gray-300 dark:text-gray-200">
            <input
              placeholder="login"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {!isLogin && (
              <input
                type="Email"
                name="email"
                placeholder="Email"
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                value={formData.email}
              />
            )}
            <input
              placeholder="password"
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="confirms password"
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                value={formData.confirmPassword}
              />
            )}
            <button
              type="submit"
              className={`"cursor-pointer w-full bg-linear-to-r from-sky-300 to-cyan-400 text-white py-2 rounded shadow hover:bg-blue-700 transition ${disablesStyle} ${hoverEffect} "`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLogin ? "Sign in" : "Register"}
              {isLoading && <ImSpinner9 className="animate-spin inline ml-2" />}
            </button>
          </form>
          {isLogin && (
            <>
              <div className="mt-6 text-gray-200 flex items-center justify-center">
                <p>or</p>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="cursor-pointer w-full flex justify-center bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
                  <FaGoogle size={20} />
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
                    to="/register"
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

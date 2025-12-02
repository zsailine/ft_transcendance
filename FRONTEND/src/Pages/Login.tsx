import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

import { FaGoogle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { ImSpinner9 } from "react-icons/im";
import { toast } from "react-toastify";
import OauthLoading from "../Components/Utils/OauthLoading";

export default function Login() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const aouthParam = new URLSearchParams(location.search).get('oauth');



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
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(true);
  const [isSamePassword, setIsSamePassword] = useState<boolean>(true);

  useEffect(() => {
    if (isLogin) {
      if (formData.username !== "" || formData.password !== "") {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
    } else {
      if (

        formData.username !== "" ||
        formData.password !== "" ||
        formData.email !== "" ||
        formData.confirmPassword !== ""
      ) {
        if (isSamePassword && formData.confirmPassword !== "") {
          setCanSubmit(true);
        }
        else {
          setCanSubmit(false);
        }
      } else {
        setCanSubmit(false);
      }
    }
  }, [formData, isLogin, isSamePassword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (e.target.name === "confirmPassword") {
      setIsSamePassword(value === formData.password);
    }
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
    try {
      if (!isLogin) {
        const { success } = await register(formData.username, formData.password, formData.email!);
        setTimeout(() => {
        }, 2000);
        if (success) {
          navigate("/login");
          toast.success("User created !");
        }
        return;
      }
      const { success } = await login(formData.username, formData.password);
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (success) {
        navigate("/dashboard");
        toast.success("Successfully logged in !");
      }
      else
        toast.error("Username or Password incorect. Please try again.");
    }
    catch (error) {
      console.error("Authentication error:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const disablesStyle = !canSubmit ? "opacity-70 cursor-not-allowed" : "";
  if (aouthParam === "start" || aouthParam === "success" || aouthParam === "error") {
    return <OauthLoading />;
  }

  if (isLoading) {
    return <OauthLoading />;
  }


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
              <>
                {!isSamePassword && <small className="text-red-700" >Password not identical</small>}
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirm password"
                  className="w-full mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-400"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              </>
            )}
            <button
              type="submit"
              className={`"cursor-pointer w-full bg-linear-to-r from-sky-300 to-cyan-400 text-white py-2 rounded shadow hover:bg-blue-700 transition ${disablesStyle} "`}
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
                <button className="cursor-pointer w-full flex justify-center bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
                  onClick= {() => { window.location.href = `/auth/google`; }}
                >
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

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useAuth } from "../Providers/AuthProvider";

export default function Login()
{
    interface LoginData {
        username: string;
        password: string;
    }

    const {login} = useAuth()

    const [formData , setFormData] = useState<LoginData>({
        username : "",
        password : ""
    });

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const { name , value} = e.target
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
    }

    const handleSubmit = (e : FormEvent) =>
    {
        e.preventDefault();
        login(formData.username, formData.password)
        setFormData(
            {
                username : "",
                password : ""
            }
        )
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
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
            </form>
        </>
    )
}
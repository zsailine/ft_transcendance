// import { useState } from "react"

const Profil = () => {
//     const [user, setUser] = useState(null)
    
    
    return (
        <>
            <div className= "rounded-lg text-white text-center ml-4 mr-2 my-8">
                <div className="rounded-lg  h-50 bg-[url(/public/images/cover.jpg)] bg-cover">
                    <div className="p-3 rounded-lg h-full bg-linear-65 from-cyan-200/15 to-cyan-800/30">
                        <h1 className="text-3xl font-bold">test0</h1>
                        <p>More information</p>
                    </div>
                </div>
                <div className="size-32 rounded-full border-4 border-cyan-500 ml-6 mt-[-100px] mb-4 bg-[url(/public/images/avatar.jpg)] bg-cover">
                </div>
            </div>
        </>
    )
}

export default Profil
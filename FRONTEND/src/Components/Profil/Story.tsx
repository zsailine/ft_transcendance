import { MdDateRange } from "react-icons/md";


const Story = () => {
    return (
        <div className="flex items-center justify-between bg-cyan-800/20 rounded-lg p-4 m-2">
            <div className="flex items-center gap-4">
                <img className="rounded-[50%]" width={50} height={50} src="/images/avatar.jpg" alt="avatar" />
                <h1>Tournament name</h1>
            </div>
            <p> "You win ! 🏆"</p>
            <div className="flex items-center">
                <MdDateRange />
                <p> Date</p>
            </div>
        </div>
    )
}

export default Story
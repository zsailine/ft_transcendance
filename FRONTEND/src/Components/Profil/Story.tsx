import { MdDateRange } from "react-icons/md";


const Story = () => {
    return (
        <div className="flex items-center justify-between rounded-lg p-4 mb-4 border border-cyan-300">
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
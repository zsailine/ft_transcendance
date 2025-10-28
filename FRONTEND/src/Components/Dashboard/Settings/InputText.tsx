import { useDashboard } from "../../../Providers/DashboardProvider"

const InputText = () => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {setNickname} = useDashboard();
        setNickname(e.target.value);
    }

    return (
        <>
            <label htmlFor="username" className="block text-sm/6 font-medium text-white">
                Nickname
            </label>
            <div className="mt-2">
                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                    <div className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">Tournament name/</div>
                    <input
                        onChange={handleChange}
                        value={useDashboard().nickname || ""}
                        id="username"
                        name="username"
                        type="text"
                        placeholder="janesmith"
                        className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                    />
                </div>
            </div>
        </>
    );
}

export default InputText;

const Avatar = () => {
    return (
        <>
            <label htmlFor="photo" className="block text-sm/6 font-medium text-white">
                Avatar photo
            </label>
            <input
                type="file" />
            <div className="mt-2 flex items-center gap-x-6">
                <div>
                </div>
                <button
                    type="button"
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20"
                >
                    Change
                </button>
            </div>
        </>
    )
}

export default Avatar;
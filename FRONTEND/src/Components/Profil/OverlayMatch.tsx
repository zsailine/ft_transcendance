import { motion } from "framer-motion";

export default function OverlayMatches()
{
    return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute z-10 top-0 h-full w-full flex flex-col items-center justify-center 
               mx-auto max-w-xl px-4 sm:px-6 lg:px-8 border border-amber-100/10 
            rounded-lg shadow-md shadow-amber-100/20 py-6 bg-cyan-800/20"
            >

            </motion.div>
        );
}
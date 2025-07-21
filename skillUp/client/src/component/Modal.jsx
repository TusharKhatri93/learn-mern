import {AnimatePresence, motion} from "framer-motion";

export default function Modal({isOpen, onClose, children}){
    return(
        <AnimatePresence>
            {isOpen&&
            (<>
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    onClick={onClose}
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                <motion.div
                    className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg"
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.9}}
                >
                    {children}
                </motion.div>
                </div>
            </>
            )}
        </AnimatePresence>
    )
}
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Fab({ onClick, className }) {
    return (
        <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={cn(
                "bg-gradient-to-tr from-deep-violet-600 to-electric-blue-500 text-white p-4 rounded-full shadow-lg shadow-deep-violet-500/40 fixed bottom-24 right-6 z-50 md:right-10 flex items-center justify-center backdrop-blur-sm border-2 border-white/20",
                className
            )}
        >
            <Plus size={28} strokeWidth={3} />
        </motion.button>
    );
}

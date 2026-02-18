import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function CategoryChips({ activeCategory, onSelectCategory }) {
    const categories = ['All', 'Jobs', 'Education', 'Songs', 'Politics', 'Ideas', 'Cost'];

    return (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 pb-4 px-6 snap-x mask-fade-right">
            {categories.map((cat) => (
                <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectCategory(cat)}
                    className={cn(
                        "flex-none px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 snap-center border border-transparent whitespace-nowrap backdrop-blur-sm",
                        activeCategory === cat
                            ? "bg-gradient-to-r from-deep-violet-600 to-electric-blue-600 text-white shadow-lg shadow-electric-blue-500/25"
                            : "bg-slate-800/40 text-slate-400 hover:bg-slate-700/50 hover:text-white border-white/5"
                    )}
                >
                    {cat}
                </motion.button>
            ))}
        </div>
    );
}

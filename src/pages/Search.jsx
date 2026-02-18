import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Search() {
    return (
        <div className="pt-20 px-6 text-white min-h-screen pb-24 bg-slate-950">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-deep-violet-400 to-electric-blue-400 bg-clip-text text-transparent mb-8">Search</h1>

            <div className="relative mb-8 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-deep-violet-600 to-electric-blue-600 rounded-2xl opacity-20 group-focus-within:opacity-50 transition duration-500 blur-lg" />
                <div className="relative bg-slate-900 rounded-2xl flex items-center p-1 border border-white/10 group-focus-within:border-white/30 transition-colors">
                    <SearchIcon className="ml-4 text-slate-400 group-focus-within:text-electric-blue-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Find resources..."
                        className="w-full bg-transparent px-4 py-3 outline-none text-white placeholder-slate-500"
                    />
                    <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest pl-2">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                    {['React Patterns', 'Lo-Fi Music', 'Job Applications', 'Design Systems'].map((item) => (
                        <button key={item} className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm border border-white/5 transition-colors">
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

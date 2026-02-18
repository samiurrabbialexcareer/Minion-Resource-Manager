import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle, Cat } from 'lucide-react';
import CategoryChips from '../components/CategoryChips';
import ResourceGrid from '../components/ResourceGrid';
import Fab from '../components/Fab';

export default function Home({ onAdd }) {
    const [category, setCategory] = useState('All');

    const { data: resources = [], isLoading, error } = useQuery({
        queryKey: ['resources'],
        queryFn: async () => {
            if (!supabase) return [];
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!supabase, // Only fetch if supabase is initialized
    });

    const filtered = category === 'All'
        ? resources
        : resources.filter(r => r.category === category);

    return (
        <div className="pt-24 pb-24 min-h-screen bg-slate-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-deep-violet-600 to-electric-blue-600 p-2 rounded-xl shadow-lg shadow-electric-blue-500/20">
                        <Cat size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Minion</h1>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Resource Manager</p>
                    </div>
                </div>
                {/* Profile Avatar removed/simplified */}
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400">
                    A
                </div>
            </header>

            {/* Categories */}
            <div className="fixed top-[72px] left-0 right-0 z-20 bg-slate-950/95 backdrop-blur-xl pb-2 border-b border-white/5 shadow-2xl shadow-slate-950/50">
                <CategoryChips activeCategory={category} onSelectCategory={setCategory} />
            </div>

            {/* Spacer for fixed headers */}
            <div className="h-12" />

            {/* Content Area */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <p>Loading resources...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-400 px-6 text-center">
                    <AlertCircle className="mb-2" size={32} />
                    <p>Error loading resources</p>
                    <p className="text-xs text-red-500/70 mt-1">{error.message}</p>
                </div>
            ) : !supabase ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 px-6 text-center">
                    <p>Supabase not configured.</p>
                    <p className="text-xs mt-2">Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env</p>
                </div>
            ) : (
                <ResourceGrid resources={filtered} />
            )}

            {/* FAB - Only show on Home for now */}
            <Fab onClick={onAdd} />
        </div>
    );
}

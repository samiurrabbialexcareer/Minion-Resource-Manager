import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Link2, StickyNote, ArrowLeft, Loader2, UploadCloud, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function AddResourceModal({ isOpen, onClose }) {
    const queryClient = useQueryClient();
    const [step, setStep] = useState('select'); // 'select' | 'form'
    const [type, setType] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', category: 'Jobs' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('select');
                setType(null);
                setFormData({ title: '', content: '', category: 'Jobs' });
                setError(null);
            }, 300);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => (e.key === 'Escape' ? onClose() : null);
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) {
            setError("Supabase client not initialized. Check .env variables.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('resources')
                .insert([
                    {
                        title: formData.title,
                        content: formData.content,
                        category: formData.category,
                        type: type,
                        last_apply_date: formData.last_apply_date // Include this field (make sure to run SQL migration!)
                    }
                ]);

            if (insertError) throw insertError;

            await queryClient.invalidateQueries({ queryKey: ['resources'] });
            onClose();
        } catch (err) {
            console.error('Error adding resource:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const options = [
        { id: 'image', icon: ImageIcon, label: 'Upload Image', color: 'from-purple-500 to-indigo-500' },
        { id: 'link', icon: Link2, label: 'Paste Link', color: 'from-blue-500 to-cyan-500' },
        { id: 'note', icon: StickyNote, label: 'Write Note', color: 'from-yellow-500 to-orange-500' },
    ];

    const categories = ['Jobs', 'Education', 'Songs', 'Politics', 'Ideas', 'Cost'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-slate-900 border-t border-white/10 rounded-t-3xl sm:rounded-2xl p-6 pb-safe pt-2 pointer-events-auto shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Drag Handle */}
                        <div className="mx-auto w-12 h-1.5 bg-slate-700 rounded-full mb-6 mt-2 sm:hidden" />

                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                {step === 'form' && (
                                    <button
                                        onClick={() => setStep('select')}
                                        className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                    {step === 'select' ? 'Add New Resource' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {step === 'select' ? (
                            <div className="grid grid-cols-1 gap-4 mb-2">
                                {options.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setType(opt.id); setStep('form'); }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-electric-blue-500/30 transition-all group"
                                    >
                                        <div className={cn(
                                            "p-3 rounded-lg bg-gradient-to-br shadow-lg text-white group-hover:scale-110 transition-transform",
                                            opt.color
                                        )}>
                                            <opt.icon size={24} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-medium text-lg text-slate-200 group-hover:text-white transition-colors">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                        {formData.category === 'Jobs' ? 'Heading / Role' : 'Title'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={formData.category === 'Jobs' ? "e.g. Senior React Developer" : "e.g. Project Ideas"}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue-500 focus:ring-1 focus:ring-electric-blue-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-electric-blue-500 focus:ring-1 focus:ring-electric-blue-500 transition-all cursor-pointer"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat} className="bg-slate-900 text-white">
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                {formData.category === 'Jobs' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <label className="block text-sm font-semibold text-electric-blue-400 uppercase tracking-wider mb-1">Last Apply Date</label>
                                        <input
                                            type="date"
                                            value={formData.last_apply_date || ''}
                                            onChange={(e) => setFormData({ ...formData, last_apply_date: e.target.value })}
                                            className="w-full bg-slate-800 border border-electric-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue-500 focus:ring-1 focus:ring-electric-blue-500 transition-all placeholder:text-slate-600"
                                        />
                                    </motion.div>
                                )}

                                {type === 'note' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Content</label>
                                        <textarea
                                            required={formData.category !== 'Jobs'} // Content optional for Jobs if just tracking application
                                            rows={4}
                                            placeholder="Type your note here..."
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue-500 focus:ring-1 focus:ring-electric-blue-500 transition-all placeholder:text-slate-600 resize-none"
                                        />
                                    </div>
                                )}

                                {type === 'link' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">URL</label>
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://example.com"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue-500 focus:ring-1 focus:ring-electric-blue-500 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                )}

                                {type === 'image' && (
                                    <div className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-slate-800/20">
                                        <UploadCloud className="text-slate-500 mb-2" size={32} />
                                        <p className="text-sm text-slate-400 font-medium">Click to upload image</p>
                                        <p className="text-xs text-slate-600 mt-1">(Image upload not fully implemented without Storage bucket)</p>
                                        {/* Hidden file input would go here */}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-deep-violet-600 to-electric-blue-600 hover:from-deep-violet-500 hover:to-electric-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-electric-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Resource'}
                                </button>
                            </form>
                        )}

                        <p className="text-center text-xs text-slate-500 mt-6">
                            Files will be saved to your private dashboard.
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

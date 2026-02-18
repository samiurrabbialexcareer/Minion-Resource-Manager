import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, StickyNote, MoreVertical, ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function ResourceCard({ resource, index }) {
    const { id, type, content, title, image, created_at, category, last_apply_date } = resource;
    const [isExpanded, setIsExpanded] = useState(false);
    const queryClient = useQueryClient();

    const date = created_at ? new Date(created_at).toLocaleDateString() : '';
    const applyDate = last_apply_date ? new Date(last_apply_date).toLocaleDateString() : null;

    // Eye-catchy styles / Compact Logic
    const isNote = type === 'note';

    const handleCardClick = () => {
        if (isNote) setIsExpanded(!isExpanded);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this resource?')) {
            const { error } = await supabase.from('resources').delete().eq('id', id);
            if (error) {
                console.error('Error deleting resource:', error);
                alert('Failed to delete resource');
            } else {
                queryClient.invalidateQueries({ queryKey: ['resources'] });
            }
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, layout: { duration: 0.3 } }}
            onClick={handleCardClick}
            className={cn(
                "break-inside-avoid mb-3 group relative overflow-hidden rounded-xl border backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300",
                isNote
                    ? "bg-gradient-to-br from-indigo-600 to-violet-700 border-white/10 hover:shadow-violet-500/20 cursor-pointer"
                    : "bg-slate-900/60 border-white/5 hover:border-electric-blue-500/30"
            )}
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    {/* Category & Type Icon */}
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            isNote ? "bg-white/20 text-white" :
                                category === 'Jobs' ? "bg-blue-500/20 text-electric-blue-300" :
                                    "bg-purple-500/20 text-purple-300"
                        )}>
                            {category}
                        </span>
                        {/* Small Type Icon */}
                        {type === 'link' && <ExternalLink size={14} className="text-slate-500" />}
                        {type === 'image' && <ImageIcon size={14} className="text-slate-500" />}
                        {isNote && <StickyNote size={14} className="text-white/70" />}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleDelete}
                            className={cn(
                                "p-1.5 rounded-full transition-colors hover:bg-black/20",
                                isNote ? "text-white/70 hover:text-red-200" : "text-slate-500 hover:text-red-400"
                            )}
                        >
                            <Trash2 size={14} />
                        </button>
                        {isNote && (
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                className="text-white/70 ml-1"
                            >
                                <ChevronDown size={14} />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className={cn(
                    "font-semibold leading-tight",
                    isNote ? "text-lg text-white font-bold" : "text-white/90 text-base"
                )}>
                    {title}
                </h3>

                {/* Job Apply Date */}
                {category === 'Jobs' && applyDate && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-xs uppercase font-bold text-white/70">Last Applied:</span>
                        <span className={cn("font-mono", isNote ? "text-white/90" : "text-electric-blue-400")}>{applyDate}</span>
                    </div>
                )}

                {/* Main Content / Resource */}
                <div className="mt-2">
                    {/* NOTE Content (Expandable) */}
                    <AnimatePresence>
                        {isExpanded && isNote && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="text-white/80 text-sm leading-relaxed mt-2 pb-1">
                                    {content}
                                </p>
                                {(content?.startsWith('http') || content?.startsWith('www')) && (
                                    <a
                                        href={content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white transition-colors"
                                    >
                                        <ExternalLink size={12} /> Open Link
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* LINK Content */}
                    {type === 'link' && (
                        <a
                            href={content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-electric-blue-400 hover:text-electric-blue-300 hover:underline truncate"
                        >
                            <span className="truncate opacity-80">{content?.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink size={10} strokeWidth={3} />
                        </a>
                    )}

                    {/* IMAGE Content (Just a label for now since we don't have previews really) */}
                    {type === 'image' && (
                        <a href={content} target="_blank" rel="noopener noreferrer" className="text-sm text-electric-blue-400 hover:underline flex items-center gap-1 mt-2 font-medium">
                            <ImageIcon size={12} /> Image resource
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

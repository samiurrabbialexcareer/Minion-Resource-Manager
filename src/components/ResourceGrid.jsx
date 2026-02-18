import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import ResourceCard from './ResourceCard';

export default function ResourceGrid({ resources }) {
    if (!resources || resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
                <p>No resources found.</p>
            </div>
        );
    }

    return (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 px-4 pb-32 space-y-4">
            {resources.map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} />
            ))}
        </div>
    );
}

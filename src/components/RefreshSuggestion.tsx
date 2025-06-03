import { useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface RefreshSuggestionProps {
    suggestion: string | null;
    onClose: () => void;
}

export default function RefreshSuggestion({ suggestion, onClose }: RefreshSuggestionProps){
    // 5秒後に自動で閉じる
    useEffect(() =>{
        if (suggestion){
            const timer = setTimeout(() => {
                onClose();
            }, 5000)
            return () => clearTimeout(timer);
        }
    }, [suggestion, onClose]);

    return (
        <AnimatePresence>
            {suggestion && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-8 left-1/2 transform -translate-x-1/2
                    bg-indigo-100 p-6 rounded-lg shadow-lg border border-indigo-200 w-full max-w-md"
                >
                    <button onClick={onClose} className="absolute top-3 right-3 text-indigo-400 hover:text-indigo-600 cursor-pointer">
                        <X size={16} />
                    </button>
                    <p className="text-lg font-medium text-gray-700 pr-6">
                        {suggestion}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const DrawerPanel: React.FC<DrawerPanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 z-50 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

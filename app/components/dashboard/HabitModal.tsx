'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { HABIT_CATEGORIES } from '@/lib/constants';

interface HabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
    mode: 'create' | 'edit';
    isLoading?: boolean;
}

const FREQUENCIES = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Specific Days' },
];

const DAYS = [
    { id: 'Mon', label: 'M' },
    { id: 'Tue', label: 'T' },
    { id: 'Wed', label: 'W' },
    { id: 'Thu', label: 'T' },
    { id: 'Fri', label: 'F' },
    { id: 'Sat', label: 'S' },
    { id: 'Sun', label: 'S' },
];

export default function HabitModal({ isOpen, onClose, onSubmit, initialData, mode, isLoading }: HabitModalProps) {
    const [text, setText] = useState('');
    const [category, setCategory] = useState(HABIT_CATEGORIES[0].name);
    const [icon, setIcon] = useState('📌');
    const [frequency, setFrequency] = useState('daily');
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setText(initialData.text || '');
            setCategory(initialData.category || HABIT_CATEGORIES[0].name);
            setIcon(initialData.icon || '📌');
            setFrequency(initialData.frequency || 'daily');
            setDaysOfWeek(initialData.daysOfWeek || []);
        } else {
            // Reset defaults for create mode
            setText('');
            setCategory(HABIT_CATEGORIES[0].name);
            setIcon('📌');
            setFrequency('daily');
            setDaysOfWeek([]);
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            text,
            category,
            icon,
            frequency,
            daysOfWeek: frequency === 'weekly' ? daysOfWeek : [],
        });
    };

    const toggleDay = (dayId: string) => {
        setDaysOfWeek(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {mode === 'create' ? 'Create New Habit' : 'Edit Habit'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Habit Name</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="e.g., Read for 30 mins"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-4">
                            {/* Category */}
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all appearance-none cursor-pointer"
                                    >
                                        {HABIT_CATEGORIES.map((cat) => (
                                            <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Icon */}
                            <div className="w-24">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Icon</label>
                                <input
                                    type="text"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-xl"
                                    maxLength={2}
                                />
                            </div>
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Frequency</label>
                            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-700 mb-4">
                                {FREQUENCIES.map((freq) => (
                                    <button
                                        key={freq.id}
                                        type="button"
                                        onClick={() => setFrequency(freq.id)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${frequency === freq.id
                                                ? 'bg-slate-800 text-white shadow-sm'
                                                : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {freq.label}
                                    </button>
                                ))}
                            </div>

                            {/* Days Selection (Only if Specific Days) */}
                            {frequency === 'weekly' && (
                                <div className="flex justify-between gap-2 animate-in slide-in-from-top-2 duration-200">
                                    {DAYS.map((day) => (
                                        <button
                                            key={day.id}
                                            type="button"
                                            onClick={() => toggleDay(day.id)}
                                            className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                        ${daysOfWeek.includes(day.id)
                                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                                                    : 'bg-slate-950 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                                                }
                      `}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-all"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !text.trim()}
                                className="flex-1 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {mode === 'create' ? <Plus size={20} /> : <Save size={18} />}
                                        {mode === 'create' ? 'Create Habit' : 'Save Changes'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

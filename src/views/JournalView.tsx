import React, { useState } from 'react';
import {
  BookOpenText,
  Save,
  Smile,
  Meh,
  Frown,
  Sparkles,
  CheckCircle2,
  Trash2,
  Calendar,
  Star,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MoodType, JournalEntry } from '../types';
import { getTodayString } from '../data/initialData';

export const JournalView: React.FC = () => {
  const { journal, saveJournalEntry, deleteJournalEntry } = useApp();

  const todayStr = getTodayString(0);
  const existingToday = journal.find((j) => j.date === todayStr);

  const [date, setDate] = useState(todayStr);

  // Form states
  const [accomplishments, setAccomplishments] = useState<string[]>(
    existingToday?.accomplishments || ['']
  );
  const [wentWell, setWentWell] = useState<string[]>(
    existingToday?.wentWell || ['']
  );
  const [needsImprovement, setNeedsImprovement] = useState<string[]>(
    existingToday?.needsImprovement || ['']
  );
  const [learned, setLearned] = useState<string[]>(
    existingToday?.learned || ['']
  );
  const [mood, setMood] = useState<MoodType>(existingToday?.mood || 'good');
  const [productivityRating, setProductivityRating] = useState<number>(
    existingToday?.productivityRating || 4
  );
  const [notes, setNotes] = useState(existingToday?.notes || '');

  // Helper to add list item
  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const updateListItem = (
    index: number,
    val: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const removeListItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    saveJournalEntry({
      date,
      accomplishments: accomplishments.filter((s) => s.trim() !== ''),
      wentWell: wentWell.filter((s) => s.trim() !== ''),
      needsImprovement: needsImprovement.filter((s) => s.trim() !== ''),
      learned: learned.filter((s) => s.trim() !== ''),
      mood,
      productivityRating,
      notes: notes.trim() || undefined,
    });
  };

  const moodEmojis: Record<MoodType, { label: string; icon: string }> = {
    ecstatic: { label: 'Energized & Ecstatic', icon: '⚡' },
    good: { label: 'Good & Productive', icon: '✨' },
    neutral: { label: 'Steady & Neutral', icon: '🌱' },
    tired: { label: 'Fatigued / Needs Rest', icon: '💤' },
    stressed: { label: 'High Stress / Overwhelmed', icon: '🌪️' },
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-subtle">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
            <BookOpenText className="w-3.5 h-3.5" />
            <span>Evening Reflection Ritual</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Daily Journal & Retrospective
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            "We do not learn from experience... we learn from reflecting on experience."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Reflection Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-subtle space-y-6">
        {/* Mood & Productivity Star Rating Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60">
          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              How did you feel today?
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(moodEmojis) as MoodType[]).map((m) => {
                const isSelected = mood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-brand-500'
                    }`}
                  >
                    <span>{moodEmojis[m].icon}</span>
                    <span>{m.charAt(0).toUpperCase() + m.slice(1)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Productivity Rating */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Productivity & Focus Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setProductivityRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= productivityRating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold font-mono text-zinc-500 dark:text-zinc-400 ml-2">
                {productivityRating} / 5
              </span>
            </div>
          </div>
        </div>

        {/* 1. What I accomplished */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px]">1</span>
              <span>What I Accomplished Today</span>
            </label>
            <button
              type="button"
              onClick={() => addListItem(setAccomplishments)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add item</span>
            </button>
          </div>

          <div className="space-y-2">
            {accomplishments.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Mastered binary search variations on rotated sorted arrays..."
                  value={item}
                  onChange={(e) => updateListItem(idx, e.target.value, setAccomplishments)}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {accomplishments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(idx, setAccomplishments)}
                    className="p-2 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. What went well */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px]">2</span>
              <span>What Went Well</span>
            </label>
            <button
              type="button"
              onClick={() => addListItem(setWentWell)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add item</span>
            </button>
          </div>

          <div className="space-y-2">
            {wentWell.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Started deep work without opening social media or email..."
                  value={item}
                  onChange={(e) => updateListItem(idx, e.target.value, setWentWell)}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {wentWell.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(idx, setWentWell)}
                    className="p-2 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. What needs improvement */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px]">3</span>
              <span>What I Need to Improve</span>
            </label>
            <button
              type="button"
              onClick={() => addListItem(setNeedsImprovement)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add item</span>
            </button>
          </div>

          <div className="space-y-2">
            {needsImprovement.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Afternoon energy dip; drink more electrolytes after 2 PM..."
                  value={item}
                  onChange={(e) => updateListItem(idx, e.target.value, setNeedsImprovement)}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {needsImprovement.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(idx, setNeedsImprovement)}
                    className="p-2 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. What I learned */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px]">4</span>
              <span>Key Learnings & Mental Models</span>
            </label>
            <button
              type="button"
              onClick={() => addListItem(setLearned)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add item</span>
            </button>
          </div>

          <div className="space-y-2">
            {learned.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. In binary search on answer spaces, monotonic check function is the pivot..."
                  value={item}
                  onChange={(e) => updateListItem(idx, e.target.value, setLearned)}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {learned.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(idx, setLearned)}
                    className="p-2 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Freeform Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
            Closing Thoughts & Mental Clarity
          </label>
          <textarea
            rows={3}
            placeholder="Any other thoughts, gratitude, or strategic adjustments for tomorrow..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Daily Reflection</span>
          </button>
        </div>
      </form>

      {/* Past Entries Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Past Reflections & History
        </h3>

        <div className="space-y-4">
          {journal.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-subtle space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">
                    {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium">
                    {moodEmojis[entry.mood]?.icon} {entry.mood}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: entry.productivityRating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <button
                    onClick={() => deleteJournalEntry(entry.id)}
                    className="text-zinc-300 dark:text-zinc-600 hover:text-rose-500 p-1"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {entry.accomplishments.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">
                      Accomplished
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-700 dark:text-zinc-300">
                      {entry.accomplishments.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {entry.learned.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-purple-600 dark:text-purple-400 uppercase text-[10px]">
                      Learned
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-700 dark:text-zinc-300">
                      {entry.learned.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {entry.notes && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800 italic">
                  "{entry.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

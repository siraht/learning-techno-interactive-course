"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface PracticeEntry {
  id: string;
  date: string;
  minutes: number;
  module: string;
  variable: string;
  changed: string;
  heard: string;
  next: string;
  skills:string[];
}

export interface ProgressState {
  completed: string[];
  bookmarked: string[];
  visited: string[];
  lastVisited: string | null;
  notes: Record<string, string>;
  exercises: Record<string, string[]>;
  practiceEntries: PracticeEntry[];
  activeDays: string[];
  skillEvidence: Record<string,{rating:number;note:string;updatedAt:string}>;
}

const defaultState: ProgressState = {
  completed: [],
  bookmarked: [],
  visited: [],
  lastVisited: null,
  notes: {},
  exercises: {},
  practiceEntries: [],
  activeDays: [],
  skillEvidence: {},
};

interface ProgressContextValue {
  state: ProgressState;
  hydrated: boolean;
  toggleComplete: (id: string) => void;
  toggleBookmark: (id: string) => void;
  visitLesson: (id: string) => void;
  saveNote: (id: string, note: string) => void;
  toggleExercise: (lessonId: string, exercise: string) => void;
  setSkillEvidence: (skillId:string,rating:number,note:string) => void;
  addPracticeEntry: (entry: Omit<PracticeEntry, "id">) => void;
  deletePracticeEntry: (id: string) => void;
  importState: (state: ProgressState) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "living-techno-progress-v1";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function normalize(value: Partial<ProgressState>): ProgressState {
  return {
    completed: Array.isArray(value.completed) ? value.completed : [],
    bookmarked: Array.isArray(value.bookmarked) ? value.bookmarked : [],
    visited: Array.isArray(value.visited) ? value.visited : [],
    lastVisited: typeof value.lastVisited === "string" ? value.lastVisited : null,
    notes: value.notes && typeof value.notes === "object" ? value.notes : {},
    exercises: value.exercises && typeof value.exercises === "object" ? value.exercises : {},
    practiceEntries: Array.isArray(value.practiceEntries) ? value.practiceEntries.map(entry=>({...entry,skills:Array.isArray(entry.skills)?entry.skills:[]})) : [],
    activeDays: Array.isArray(value.activeDays) ? value.activeDays : [],
    skillEvidence: value.skillEvidence && typeof value.skillEvidence === "object" ? value.skillEvidence : {},
  };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let initial: ProgressState | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) initial = normalize(JSON.parse(stored));
    } catch {
      // A corrupt local record should not block the course.
    }
    queueMicrotask(() => {
      if (initial) setState(initial);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const updateActivity = useCallback((current: ProgressState) => {
    const date = today();
    return current.activeDays.includes(date)
      ? current.activeDays
      : [...current.activeDays, date].slice(-120);
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      completed: current.completed.includes(id)
        ? current.completed.filter((item) => item !== id)
        : [...current.completed, id],
      activeDays: updateActivity(current),
    }));
  }, [updateActivity]);

  const toggleBookmark = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      bookmarked: current.bookmarked.includes(id)
        ? current.bookmarked.filter((item) => item !== id)
        : [...current.bookmarked, id],
    }));
  }, []);

  const visitLesson = useCallback((id: string) => {
    setState((current) => ({ ...current, lastVisited: id, visited:current.visited.includes(id)?current.visited:[...current.visited,id], activeDays: updateActivity(current) }));
  }, [updateActivity]);

  const saveNote = useCallback((id: string, note: string) => {
    setState((current) => ({ ...current, notes: { ...current.notes, [id]: note } }));
  }, []);

  const toggleExercise = useCallback((lessonId: string, exercise: string) => {
    setState((current) => {
      const existing = current.exercises[lessonId] || [];
      const next = existing.includes(exercise)
        ? existing.filter((item) => item !== exercise)
        : [...existing, exercise];
      return {
        ...current,
        exercises: { ...current.exercises, [lessonId]: next },
        activeDays: updateActivity(current),
      };
    });
  }, [updateActivity]);

  const addPracticeEntry = useCallback((entry: Omit<PracticeEntry, "id">) => {
    setState((current) => ({
      ...current,
      practiceEntries: [{ ...entry, id: `${Date.now()}` }, ...current.practiceEntries],
      activeDays: updateActivity(current),
    }));
  }, [updateActivity]);

  const setSkillEvidence=useCallback((skillId:string,rating:number,note:string)=>{
    setState(current=>({...current,skillEvidence:{...current.skillEvidence,[skillId]:{rating:Math.max(0,Math.min(4,rating)),note,updatedAt:new Date().toISOString()}}}));
  },[]);

  const deletePracticeEntry = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      practiceEntries: current.practiceEntries.filter((entry) => entry.id !== id),
    }));
  }, []);

  const importState = useCallback((incoming: ProgressState) => setState(normalize(incoming)), []);
  const reset = useCallback(() => setState(defaultState), []);

  const value = useMemo(() => ({
    state,
    hydrated,
    toggleComplete,
    toggleBookmark,
    visitLesson,
    saveNote,
    toggleExercise,
    setSkillEvidence,
    addPracticeEntry,
    deletePracticeEntry,
    importState,
    reset,
  }), [state, hydrated, toggleComplete, toggleBookmark, visitLesson, saveNote, toggleExercise, setSkillEvidence, addPracticeEntry, deletePracticeEntry, importState, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used within ProgressProvider");
  return context;
}

export function calculateStreak(days: string[]) {
  const unique = new Set(days);
  const cursor = new Date();
  if (!unique.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (unique.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

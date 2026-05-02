import React, { useState, useEffect, useCallback } from 'react';
import { useStack } from '../contexts/StackContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx';
import { FolderOpen, ChevronDown, X } from 'lucide-react';
import { supplements as allSupplements } from '../data/supplements.js';

const STORAGE_KEY = 'ns_saved_stacks';

function getSupplementName(id) {
  const supp = allSupplements.find(s => s.id === id);
  return supp ? supp.name : id;
}

// Saved stacks live in localStorage until a real persistence backend
// lands. Component reads on open and on storage events so multiple tabs
// stay in sync.
export function SavedStacksList() {
  const { loadStack, setUserGoals } = useStack();
  const [stacks, setStacks] = useState([]);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setStacks(Array.isArray(raw) ? raw : []);
    } catch {
      setStacks([]);
    }
  }, []);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === STORAGE_KEY) refresh(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  // Refresh once on mount so the chip shows correct count without opening.
  useEffect(() => { refresh(); }, [refresh]);

  const handleLoad = (stack) => {
    loadStack(stack.supplements);
    if (stack.userGoals && stack.userGoals.length > 0) {
      setUserGoals(stack.userGoals);
    }
  };

  const handleDelete = (id) => {
    try {
      const next = stacks.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStacks(next);
    } catch { /* ignore */ }
  };

  if (stacks.length === 0 && !open) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            My Saved Stacks
            {stacks.length > 0 && (
              <Badge variant="secondary" className="text-xs">{stacks.length}</Badge>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2 space-y-2">
        {stacks.length === 0 ? (
          <p className="text-sm text-ink-500 text-center py-3">No saved stacks yet.</p>
        ) : (
          stacks.map(stack => (
            <div key={stack.id} className="rounded-md bg-surface-card border border-ink-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{stack.name}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {stack.supplements.length} supplement{stack.supplements.length !== 1 ? 's' : ''}
                    {' '}&middot;{' '}
                    {new Date(stack.savedAt || stack.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {stack.supplements.slice(0, 4).map(s => (
                      <Badge key={s.supplementId} variant="outline" className="text-[10px]">
                        {getSupplementName(s.supplementId)}
                      </Badge>
                    ))}
                    {stack.supplements.length > 4 && (
                      <Badge variant="outline" className="text-[10px]">+{stack.supplements.length - 4} more</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLoad(stack)}
                    title="Load this stack"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-ink-500 hover:text-primary-700 hover:bg-primary-050"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(stack.id)}
                    title="Delete this stack"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-ink-500 hover:text-danger-500 hover:bg-danger-050"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

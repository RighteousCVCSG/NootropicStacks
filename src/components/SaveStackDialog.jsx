import React, { useState } from 'react';
import { useStack } from '../contexts/StackContext.jsx';
import { track } from '../lib/analytics.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Save } from 'lucide-react';

const STORAGE_KEY = 'ns_saved_stacks';

export function SaveStackDialog({ open, onOpenChange, onSaved }) {
  const { stack, userGoals } = useStack();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Saves go to localStorage until a real persistence backend is wired.
  // Stacks are keyed by uuid and timestamped so the saved-stacks list
  // can sort newest-first and dedupe by name.
  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Give your stack a name'); return; }
    if (stack.length === 0) { setError('Your stack is empty'); return; }
    setError('');
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const record = { id, name: trimmed, supplements: stack, userGoals, savedAt: new Date().toISOString() };
      existing.unshift(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      track('stack_save', { stack_size: stack.length, stack_name: trimmed });
      setName('');
      onOpenChange(false);
      if (onSaved) onSaved(record);
    } catch (err) {
      setError(err.message || 'Could not save (storage may be full).');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Save Your Stack</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stack-name">Stack Name</Label>
            <Input
              id="stack-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Morning Focus Stack"
              autoFocus
            />
          </div>
          <p className="text-xs text-ink-500">
            {stack.length} supplement{stack.length !== 1 ? 's' : ''} &middot; {userGoals.length} goal{userGoals.length !== 1 ? 's' : ''}
          </p>
          <Button type="submit" className="w-full" disabled={stack.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Save Stack
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

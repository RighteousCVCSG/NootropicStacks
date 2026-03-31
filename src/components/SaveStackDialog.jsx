import React, { useState } from 'react';
import { useStack } from '../contexts/StackContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Save, Loader2 } from 'lucide-react';

export function SaveStackDialog({ open, onOpenChange, onSaved }) {
  const { stack, userGoals } = useStack();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Give your stack a name'); return; }
    if (stack.length === 0) { setError('Your stack is empty'); return; }

    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/stacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), supplements: stack, userGoals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setName('');
      onOpenChange(false);
      if (onSaved) onSaved(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

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
          <p className="text-xs text-gray-500">
            {stack.length} supplement{stack.length !== 1 ? 's' : ''} &middot; {userGoals.length} goal{userGoals.length !== 1 ? 's' : ''}
          </p>
          <Button type="submit" className="w-full" disabled={saving || stack.length === 0}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Stack
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

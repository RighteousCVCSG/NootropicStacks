import React, { useState, useEffect, useCallback } from 'react';
import { useStack } from '../contexts/StackContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx';
import { FolderOpen, Trash2, Download, ChevronDown, Loader2 } from 'lucide-react';
import { supplements as allSupplements } from '../data/supplements.js';

function getSupplementName(id) {
  const supp = allSupplements.find(s => s.id === id);
  return supp ? supp.name : id;
}

export function SavedStacksList() {
  const { user } = useAuth();
  const { loadStack, setUserGoals } = useStack();
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchStacks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stacks');
      if (!res.ok) return;
      const data = await res.json();
      setStacks(data.stacks || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (open && user) fetchStacks();
  }, [open, user, fetchStacks]);

  const handleLoad = (stack) => {
    loadStack(stack.supplements);
    if (stack.userGoals && stack.userGoals.length > 0) {
      setUserGoals(stack.userGoals);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/stacks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStacks(prev => prev.filter(s => s.id !== id));
      }
    } catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  if (!user) return null;

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
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        ) : stacks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-3">No saved stacks yet.</p>
        ) : (
          stacks.map(stack => (
            <Card key={stack.id} className="bg-gray-50">
              <CardContent className="py-3 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{stack.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {stack.supplements.length} supplement{stack.supplements.length !== 1 ? 's' : ''}
                      {' '}&middot;{' '}
                      {new Date(stack.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stack.supplements.slice(0, 4).map(s => (
                        <Badge key={s.supplementId} variant="outline" className="text-xs">
                          {getSupplementName(s.supplementId)}
                        </Badge>
                      ))}
                      {stack.supplements.length > 4 && (
                        <Badge variant="outline" className="text-xs">+{stack.supplements.length - 4} more</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleLoad(stack)} title="Load this stack">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(stack.id)}
                      disabled={deleting === stack.id}
                      title="Delete this stack"
                      className="text-red-500 hover:text-red-700"
                    >
                      {deleting === stack.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { supplements } from '../data/supplements.js';

export function StackPanel() {
  const { stack, safetyAnalysis, removeSupplement, updateDosage } = useStack();

  if (stack.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            My Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No supplements in your stack yet. Add some from the library below!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getEffectColor = (value) => {
    if (value >= 9.5) return 'bg-red-500';
    if (value >= 8) return 'bg-orange-500';
    if (value >= 6) return 'bg-yellow-500';
    if (value >= 3) return 'bg-green-500';
    return 'bg-gray-300';
  };

  const getEffectTextColor = (value) => {
    if (value >= 9.5) return 'text-red-700';
    if (value >= 8) return 'text-orange-700';
    if (value >= 6) return 'text-yellow-700';
    if (value >= 3) return 'text-green-700';
    return 'text-gray-600';
  };

  const getSafetyIcon = () => {
    if (!safetyAnalysis) return <CheckCircle className="w-5 h-5 text-green-500" />;
    
    const hasHighSeverity = safetyAnalysis.warnings.some(w => w.severity === 'high');
    const hasMediumSeverity = safetyAnalysis.warnings.some(w => w.severity === 'medium');
    
    if (hasHighSeverity) return <XCircle className="w-5 h-5 text-red-500" />;
    if (hasMediumSeverity) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getSafetyColor = () => {
    if (!safetyAnalysis) return 'text-green-600';
    
    const hasHighSeverity = safetyAnalysis.warnings.some(w => w.severity === 'high');
    const hasMediumSeverity = safetyAnalysis.warnings.some(w => w.severity === 'medium');
    
    if (hasHighSeverity) return 'text-red-600';
    if (hasMediumSeverity) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              My Stack ({stack.length} supplements)
            </div>
            <div className="flex items-center gap-2">
              {getSafetyIcon()}
              <span className={`text-sm font-medium ${getSafetyColor()}`}>
                Safety: {safetyAnalysis?.safetyScore || 100}/100
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Effect Meters */}
          {safetyAnalysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(safetyAnalysis.totalEffects).map(([effect, value]) => (
                <div key={effect} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{effect}</span>
                    <span className={`text-sm font-bold ${getEffectTextColor(value)}`}>
                      {value.toFixed(1)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(value * 10, 100)} 
                    className="h-2"
                    style={{
                      '--progress-background': getEffectColor(value)
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {safetyAnalysis?.warnings && safetyAnalysis.warnings.length > 0 && (
            <div className="space-y-2">
              {safetyAnalysis.warnings.map((warning, index) => (
                <Alert 
                  key={index} 
                  className={`${
                    warning.severity === 'high' ? 'border-red-200 bg-red-50' :
                    warning.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <AlertTriangle className={`h-4 w-4 ${
                    warning.severity === 'high' ? 'text-red-600' :
                    warning.severity === 'medium' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                  <AlertDescription className={`${
                    warning.severity === 'high' ? 'text-red-800' :
                    warning.severity === 'medium' ? 'text-orange-800' :
                    'text-yellow-800'
                  }`}>
                    {warning.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Stack Items */}
          <div className="space-y-3">
            {stack.map((stackItem) => {
              const supplement = supplements.find(s => s.id === stackItem.supplementId);
              if (!supplement) return null;

              return (
                <div key={stackItem.supplementId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{supplement.name}</div>
                    <div className="text-sm text-gray-600">
                      {stackItem.dosage} {supplement.dosage.unit} • {stackItem.timing}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={stackItem.dosage}
                      onChange={(e) => updateDosage(stackItem.supplementId, parseFloat(e.target.value))}
                      min={supplement.dosage.min}
                      max={supplement.dosage.max}
                      step={supplement.dosage.unit === 'mcg' ? 10 : supplement.dosage.unit === 'mg' ? 50 : 1}
                      className="w-20 px-2 py-1 text-sm border rounded"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSupplement(stackItem.supplementId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


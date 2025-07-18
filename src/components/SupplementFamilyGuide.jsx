import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Brain, 
  Zap, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  BookOpen,
  Target,
  Activity
} from 'lucide-react';
import { supplementFamilies, getFamilyRecommendations } from '../data/supplementFamilies.js';
import { supplements } from '../data/supplements.js';

export function SupplementFamilyGuide() {
  const [selectedFamily, setSelectedFamily] = useState('racetams');

  const family = supplementFamilies[selectedFamily];
  const recommendations = getFamilyRecommendations(selectedFamily);
  const familySupplements = supplements.filter(s => family.supplements.includes(s.id));

  const getSafetyColor = (profile) => {
    if (profile.includes('Very safe')) return 'text-green-600';
    if (profile.includes('Generally safe')) return 'text-blue-600';
    if (profile.includes('Moderate risk')) return 'text-orange-600';
    return 'text-red-600';
  };

  const getResearchColor = (level) => {
    if (level.includes('Very High')) return 'text-green-600';
    if (level.includes('High')) return 'text-blue-600';
    if (level.includes('Moderate')) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Supplement Family Guide</h2>
        <p className="text-gray-600">Comprehensive guides to supplement families, mechanisms, and usage</p>
      </div>

      {/* Family Selection */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(supplementFamilies).map(([id, fam]) => (
          <Button
            key={id}
            variant={selectedFamily === id ? "default" : "outline"}
            onClick={() => setSelectedFamily(id)}
            className="mb-2"
          >
            {fam.name}
          </Button>
        ))}
      </div>

      {/* Family Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            {family.name}
          </CardTitle>
          <p className="text-gray-600">{family.description}</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mechanism">Mechanism</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="supplements">Supplements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{family.summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5" />
                      Typical Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{family.typicalUsage}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Safety Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`font-semibold ${getSafetyColor(family.safetyProfile)}`}>
                      {family.safetyProfile}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Research Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`font-semibold ${getResearchColor(family.researchLevel)}`}>
                      {family.researchLevel}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Legal Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{family.legalStatus}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mechanism" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Method of Action
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{family.methodOfAction}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Neurological Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{family.neurologicalImpact}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Direct Mechanism</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{family.directMechanism}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Indirect Mechanism</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{family.indirectMechanism}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> This information is for educational purposes only. 
                  Always consult with a healthcare professional before starting any supplement regimen.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Cautions & Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{family.cautions}</p>
                </CardContent>
              </Card>

              {recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Combinations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-semibold">{rec.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {rec.supplements.map((suppId) => {
                            const supp = supplements.find(s => s.id === suppId);
                            return supp ? (
                              <Badge key={suppId} variant="outline" className="text-xs">
                                {supp.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      Positive Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {family.interactions.positive.map((interaction, index) => (
                        <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                          {interaction}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      Negative Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {family.interactions.negative.map((interaction, index) => (
                        <Badge key={index} variant="outline" className="text-red-700 border-red-300">
                          {interaction}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-600">
                      <Info className="w-5 h-5" />
                      Neutral Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {family.interactions.neutral.map((interaction, index) => (
                        <Badge key={index} variant="outline" className="text-gray-700 border-gray-300">
                          {interaction}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Safety Reminder:</strong> Individual responses to supplements can vary significantly. 
                  Start with lower doses, monitor your response, and consult healthcare professionals, 
                  especially if you have medical conditions or take medications.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="supplements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {familySupplements.map((supplement) => (
                  <Card key={supplement.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{supplement.name}</CardTitle>
                      <Badge className="w-fit">
                        {supplement.category.replace('-', ' ')}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{supplement.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Dosage:</span>
                          <span className="font-medium">
                            {supplement.dosage.min}-{supplement.dosage.max} {supplement.dosage.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Timing:</span>
                          <span className="font-medium">{supplement.dosage.timing}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


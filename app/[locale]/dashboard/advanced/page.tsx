"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsNavigation } from '@/components/ui/tabs-navigation';
import { ConflictManager } from '@/components/planning/ConflictManager';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { TestRunner } from '@/components/testing/TestRunner';
import { useLocale } from '@/lib/i18n';
import { 
  AlertTriangle, 
  Bell, 
  FileText, 
  TestTube,
  Zap,
  Settings,
  BarChart3,
  Shield
} from 'lucide-react';

export default function AdvancedPage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('conflicts');
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    {
      id: 'conflicts',
      label: 'Gestion des Conflits',
      icon: AlertTriangle,
      description: 'Détection et résolution des conflits de planning'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Système de notifications en temps réel'
    },
    {
      id: 'documents',
      label: 'Gestion Documents',
      icon: FileText,
      description: 'Upload et gestion des documents'
    },
    {
      id: 'testing',
      label: 'Tests & Validation',
      icon: TestTube,
      description: 'Suite de tests automatisés'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Zap,
      description: 'Optimisations et monitoring'
    },
    {
      id: 'security',
      label: 'Sécurité',
      icon: Shield,
      description: 'Audit de sécurité et permissions'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'conflicts':
        return <ConflictManager />;
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Centre de Notifications
                </h3>
                <p className="text-gray-600">
                  Gérez toutes vos notifications en un seul endroit
                </p>
              </div>
              <Button
                onClick={() => setShowNotifications(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                Ouvrir le Centre
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-gray-600">Notifications non lues</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-gray-600">Alertes importantes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-gray-600">Paramètres actifs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestion des Documents
              </h3>
              <p className="text-gray-600">
                Upload, organisez et gérez tous vos documents liés aux spectacles
              </p>
            </div>
            <DocumentUpload />
          </div>
        );
      case 'testing':
        return <TestRunner />;
      case 'performance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Monitoring des Performances
              </h3>
              <p className="text-gray-600">
                Surveillez les performances de l'application en temps réel
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">1.2s</div>
                      <div className="text-sm text-gray-600">Temps de chargement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">98%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold text-purple-600">45ms</div>
                      <div className="text-sm text-gray-600">Latence API</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold text-orange-600">A+</div>
                      <div className="text-sm text-gray-600">Score sécurité</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>Optimisations Actives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Cache Redis activé</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Compression Gzip</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Lazy loading images</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">CDN global</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Audit de Sécurité
              </h3>
              <p className="text-gray-600">
                Vérifiez la sécurité de votre application et de vos données
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white text-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Authentification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>NextAuth.js configuré</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hachage des mots de passe</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sessions sécurisées</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Protection CSRF</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-500" />
                    Base de Données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Connexions chiffrées</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Requêtes paramétrées</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Validation des données</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sauvegarde automatique</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('advanced.title')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('advanced.description')}
        </p>
      </div>

      {/* Tabs Navigation */}
      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>

      {/* Notification Center Modal */}
      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

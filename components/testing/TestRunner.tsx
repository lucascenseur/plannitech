"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocale } from '@/lib/i18n';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Zap,
  Settings,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  category: 'api' | 'ui' | 'integration' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed';
  duration?: number;
}

export function TestRunner() {
  const { t } = useLocale();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    initializeTestSuites();
  }, []);

  const initializeTestSuites = () => {
    const suites: TestSuite[] = [
      {
        name: 'API Routes',
        status: 'pending',
        tests: [
          { id: 'api-1', name: 'GET /api/shows', status: 'pending', category: 'api', priority: 'high' },
          { id: 'api-2', name: 'POST /api/shows', status: 'pending', category: 'api', priority: 'high' },
          { id: 'api-3', name: 'PUT /api/shows/[id]', status: 'pending', category: 'api', priority: 'high' },
          { id: 'api-4', name: 'DELETE /api/shows/[id]', status: 'pending', category: 'api', priority: 'high' },
          { id: 'api-5', name: 'GET /api/venues', status: 'pending', category: 'api', priority: 'medium' },
          { id: 'api-6', name: 'GET /api/planning', status: 'pending', category: 'api', priority: 'medium' },
          { id: 'api-7', name: 'GET /api/team/members', status: 'pending', category: 'api', priority: 'medium' },
          { id: 'api-8', name: 'GET /api/equipment', status: 'pending', category: 'api', priority: 'low' }
        ]
      },
      {
        name: 'UI Components',
        status: 'pending',
        tests: [
          { id: 'ui-1', name: 'Dashboard renders correctly', status: 'pending', category: 'ui', priority: 'critical' },
          { id: 'ui-2', name: 'Sidebar navigation works', status: 'pending', category: 'ui', priority: 'critical' },
          { id: 'ui-3', name: 'Forms validation works', status: 'pending', category: 'ui', priority: 'high' },
          { id: 'ui-4', name: 'Modals open/close correctly', status: 'pending', category: 'ui', priority: 'high' },
          { id: 'ui-5', name: 'Tables display data', status: 'pending', category: 'ui', priority: 'medium' },
          { id: 'ui-6', name: 'Pagination works', status: 'pending', category: 'ui', priority: 'medium' },
          { id: 'ui-7', name: 'Search functionality', status: 'pending', category: 'ui', priority: 'medium' },
          { id: 'ui-8', name: 'Responsive design', status: 'pending', category: 'ui', priority: 'high' }
        ]
      },
      {
        name: 'Integration Tests',
        status: 'pending',
        tests: [
          { id: 'int-1', name: 'User authentication flow', status: 'pending', category: 'integration', priority: 'critical' },
          { id: 'int-2', name: 'Create show workflow', status: 'pending', category: 'integration', priority: 'critical' },
          { id: 'int-3', name: 'Planning creation workflow', status: 'pending', category: 'integration', priority: 'high' },
          { id: 'int-4', name: 'Team assignment workflow', status: 'pending', category: 'integration', priority: 'high' },
          { id: 'int-5', name: 'Equipment management workflow', status: 'pending', category: 'integration', priority: 'medium' },
          { id: 'int-6', name: 'Document upload workflow', status: 'pending', category: 'integration', priority: 'medium' }
        ]
      },
      {
        name: 'Performance Tests',
        status: 'pending',
        tests: [
          { id: 'perf-1', name: 'Page load time < 2s', status: 'pending', category: 'performance', priority: 'high' },
          { id: 'perf-2', name: 'API response time < 500ms', status: 'pending', category: 'performance', priority: 'high' },
          { id: 'perf-3', name: 'Large dataset handling', status: 'pending', category: 'performance', priority: 'medium' },
          { id: 'perf-4', name: 'Memory usage optimization', status: 'pending', category: 'performance', priority: 'medium' },
          { id: 'perf-5', name: 'Cache effectiveness', status: 'pending', category: 'performance', priority: 'low' }
        ]
      },
      {
        name: 'Accessibility Tests',
        status: 'pending',
        tests: [
          { id: 'a11y-1', name: 'Keyboard navigation', status: 'pending', category: 'accessibility', priority: 'high' },
          { id: 'a11y-2', name: 'Screen reader compatibility', status: 'pending', category: 'accessibility', priority: 'high' },
          { id: 'a11y-3', name: 'Color contrast ratios', status: 'pending', category: 'accessibility', priority: 'medium' },
          { id: 'a11y-4', name: 'Focus indicators', status: 'pending', category: 'accessibility', priority: 'medium' },
          { id: 'a11y-5', name: 'ARIA labels', status: 'pending', category: 'accessibility', priority: 'low' }
        ]
      }
    ];

    setTestSuites(suites);
  };

  const runAllTests = async () => {
    setRunning(true);
    setProgress(0);

    const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
    let completedTests = 0;

    for (const suite of testSuites) {
      setTestSuites(prev => 
        prev.map(s => s.name === suite.name ? { ...s, status: 'running' } : s)
      );

      for (const test of suite.tests) {
        // Simuler l'exécution du test
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

        const success = Math.random() > 0.1; // 90% de succès simulé
        const duration = Math.random() * 2000 + 100;

        setTestSuites(prev => 
          prev.map(s => 
            s.name === suite.name 
              ? {
                  ...s,
                  tests: s.tests.map(t => 
                    t.id === test.id 
                      ? {
                          ...t,
                          status: success ? 'passed' : 'failed',
                          duration,
                          error: success ? undefined : 'Test failed due to simulated error'
                        }
                      : t
                  )
                }
              : s
          )
        );

        completedTests++;
        setProgress((completedTests / totalTests) * 100);
      }

      setTestSuites(prev => 
        prev.map(s => s.name === suite.name ? { ...s, status: 'completed' } : s)
      );
    }

    setRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api':
        return <Database className="h-4 w-4" />;
      case 'ui':
        return <Settings className="h-4 w-4" />;
      case 'integration':
        return <Zap className="h-4 w-4" />;
      case 'performance':
        return <Clock className="h-4 w-4" />;
      case 'accessibility':
        return <Globe className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getTestStats = () => {
    const allTests = testSuites.flatMap(suite => suite.tests);
    const passed = allTests.filter(test => test.status === 'passed').length;
    const failed = allTests.filter(test => test.status === 'failed').length;
    const pending = allTests.filter(test => test.status === 'pending').length;
    const running = allTests.filter(test => test.status === 'running').length;

    return { passed, failed, pending, running, total: allTests.length };
  };

  const stats = getTestStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('test_runner.title')}
          </h2>
          <p className="text-gray-600">
            {t('test_runner.description')}
          </p>
        </div>
        <Button
          onClick={runAllTests}
          disabled={running}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {running ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              {t('test_runner.running')}
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              {t('test_runner.run_all')}
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {running && (
        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression des tests</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-gray-600">Réussis</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600">Échoués</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map((suite) => (
          <Card key={suite.name} className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(suite.status)}
                  {suite.name}
                </div>
                <Badge variant="outline">
                  {suite.tests.filter(t => t.status === 'passed').length} / {suite.tests.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suite.tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getCategoryIcon(test.category)}
                          <span>{test.category}</span>
                          <Badge className={getPriorityColor(test.priority)}>
                            {test.priority}
                          </Badge>
                          {test.duration && (
                            <span>{test.duration.toFixed(0)}ms</span>
                          )}
                        </div>
                        {test.error && (
                          <div className="text-sm text-red-600 mt-1">
                            {test.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

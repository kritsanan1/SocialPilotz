
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

export default function ConfigStatus() {
  const { data: configData, isLoading } = useQuery({
    queryKey: ['config', 'check'],
    queryFn: async () => {
      const response = await fetch('/api/config/check');
      if (!response.ok) throw new Error('Failed to check configuration');
      return response.json();
    },
    refetchInterval: 30000 // Check every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { config, ready } = configData || {};

  return (
    <Card className={`border-2 ${ready ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          {ready ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          )}
          Configuration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Ayrshare API</span>
            <Badge variant={config?.ayrshareApiKey ? "default" : "secondary"}>
              {config?.ayrshareApiKey ? "Connected" : "Missing"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Database</span>
            <Badge variant={config?.databaseUrl ? "default" : "secondary"}>
              {config?.databaseUrl ? "Connected" : "Missing"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Session Secret</span>
            <Badge variant={config?.sessionSecret ? "default" : "secondary"}>
              {config?.sessionSecret ? "Set" : "Missing"}
            </Badge>
          </div>
        </div>

        {!ready && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Some configuration is missing. Check your environment variables.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

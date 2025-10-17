'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import X from 'lucide-react/dist/esm/icons/x';
import Download from 'lucide-react/dist/esm/icons/download';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function PWADownloadPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };
    const onInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 border-futuristic bg-card/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">Install App</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowPrompt(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">Install this app for offline access and a faster experience.</p>
          <div className="flex gap-2">
            <Button size="sm" variant="futuristic" className="flex-1" onClick={async () => {
              await deferredPrompt.prompt();
              await deferredPrompt.userChoice;
              setDeferredPrompt(null);
              setShowPrompt(false);
            }}>
              <Download className="h-4 w-4 mr-2" /> Install
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowPrompt(false)}>Later</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

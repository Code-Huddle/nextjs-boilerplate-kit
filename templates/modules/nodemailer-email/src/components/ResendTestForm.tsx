'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSendEmail } from '@/hooks/useResend';

export function ResendTestForm() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Welcome to Your App');
  const [html, setHtml] = useState('<p>You can switch to the sample template toggle to use a styled email.</p>');
  const [useSample, setUseSample] = useState(true);
  const [sampleTitle, setSampleTitle] = useState('Welcome to Your App');
  const [sampleMessage, setSampleMessage] = useState('This is a sample transactional email sent via Resend.');
  const [message, setMessage] = useState<string | null>(null);

  const sendEmail = useSendEmail({
    onSuccess: (data) => {
      setMessage(`Email queued. ID: ${data.id || 'N/A'} → ${data.to.join(', ')}`);
    },
  });

  const handleSend = async () => {
    setMessage(null);
    try {
      const recipients = to
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
      if (recipients.length === 0) {
        setMessage('Please enter at least one recipient email');
        return;
      }
      await sendEmail.mutateAsync({ to: recipients, subject, html: useSample ? '<p>Sample email</p>' : html, useSample, title: sampleTitle, message: sampleMessage });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to send');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test Resend Emails</CardTitle>
        <CardDescription>
          Enter one or multiple comma-separated emails to send a test message.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="to">To (comma-separated)</Label>
          <Input id="to" placeholder="a@x.com, b@x.com" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-sample">Use sample template</Label>
            <input id="use-sample" type="checkbox" checked={useSample} onChange={(e) => setUseSample(e.target.checked)} />
          </div>
          {useSample ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sample-title">Template Title</Label>
                <Input id="sample-title" value={sampleTitle} onChange={(e) => setSampleTitle(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sample-message">Template Message</Label>
                <Textarea id="sample-message" rows={5} value={sampleMessage} onChange={(e) => setSampleMessage(e.target.value)} />
              </div>
            </div>
          ) : (
            <>
              <Label htmlFor="html">HTML</Label>
              <Textarea id="html" value={html} onChange={(e) => setHtml(e.target.value)} rows={6} />
            </>
          )}
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <Button onClick={handleSend} disabled={sendEmail.isPending} variant="futuristic" className="w-full">
          {sendEmail.isPending ? 'Sending…' : 'Send Emails'}
        </Button>
      </CardContent>
    </Card>
  );
}

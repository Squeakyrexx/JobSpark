'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileUp, FileText } from 'lucide-react';

export default function ResumePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto py-12 flex justify-center fade-in">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Resume Management</CardTitle>
          <CardDescription>Manage your saved resume to get personalized job matches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeFile ? (
            <div className="flex items-center justify-between p-4 rounded-lg border bg-primary/20">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary-foreground" />
                <div>
                    <p className="font-medium text-primary-foreground">{resumeFile.name}</p>
                    <p className="text-sm text-primary-foreground/70">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Active</span>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No resume uploaded.</p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <Button onClick={handleUploadClick} className="w-full" variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            {resumeFile ? 'Upload New Resume' : 'Upload Resume'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

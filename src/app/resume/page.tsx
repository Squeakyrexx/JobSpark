'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileUp, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoredResume {
  name: string;
  size: number;
  type: string;
  data: string;
}

export default function ResumePage() {
  const [resume, setResume] = useState<StoredResume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedResume = localStorage.getItem('userResume');
      if (savedResume) {
        setResume(JSON.parse(savedResume));
      }
    } catch (error) {
      console.error('Failed to load resume from local storage', error);
      toast({
        title: 'Error',
        description: 'Could not load your saved resume.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newResume: StoredResume = {
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target?.result as string,
        };
        try {
          localStorage.setItem('userResume', JSON.stringify(newResume));
          setResume(newResume);
          toast({
            title: 'Success!',
            description: 'Your resume has been saved.',
          });
        } catch (error) {
            console.error('Failed to save resume to local storage', error);
            toast({
                title: 'Error',
                description: 'Could not save your resume. The file might be too large.',
                variant: 'destructive',
            });
        }
      };
      reader.onerror = (error) => {
        console.error("FileReader error: ", error);
        toast({
            title: 'Error Reading File',
            description: 'There was an issue reading your file.',
            variant: 'destructive',
        });
      };
      reader.readAsDataURL(file);
    }
     // Reset file input value to allow re-uploading the same file
     if (event.target) {
        event.target.value = '';
      }
  };

  const handleDeleteResume = () => {
    localStorage.removeItem('userResume');
    setResume(null);
    toast({
        title: 'Resume Removed',
        description: 'Your resume has been removed from local storage.',
    });
  }

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
          {resume ? (
            <div className="flex items-center justify-between p-4 rounded-lg border bg-primary/20">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary-foreground" />
                <div>
                    <p className="font-medium text-primary-foreground truncate max-w-[200px]">{resume.name}</p>
                    <p className="text-sm text-primary-foreground/70">{(resume.size / 1024).toFixed(2)} KB</p>
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
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleUploadClick} className="w-full" variant="outline">
              <FileUp className="mr-2 h-4 w-4" />
              {resume ? 'Upload New Resume' : 'Upload Resume'}
            </Button>
            {resume && (
                 <Button onClick={handleDeleteResume} className="w-full" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Resume
                 </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

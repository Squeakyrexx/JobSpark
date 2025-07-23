
'use client';

import { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendToZapier } from '@/services/zapier';

const formSchema = z.object({
  jobTitle: z.string().optional(),
  address: z.string().min(1, 'Location is required.'),
  radius: z.string().default('25'),
});

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function SearchForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [useResume, setUseResume] = useState(true);
  const [salary, setSalary] = useState([70000]);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      address: '',
      radius: '25',
    },
  });

  const loadGoogleMapsScript = useCallback(() => {
    if (window.google) return;
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Google Maps API key is missing. Autocomplete will be disabled.");
        return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);

  const setupAutocomplete = useCallback(() => {
    if (window.google && addressInputRef.current && !autocompleteRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
            addressInputRef.current,
            { types: ['(cities)'] }
        );
        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.formatted_address) {
                form.setValue('address', place.formatted_address, { shouldValidate: true });
            }
        });
    }
  }, [form]);

   useEffect(() => {
    const interval = setInterval(() => {
        if(window.google && addressInputRef.current) {
            setupAutocomplete();
            clearInterval(interval);
        }
    }, 100);
    return () => clearInterval(interval);
  }, [setupAutocomplete]);

  useEffect(() => {
    try {
      const savedResume = localStorage.getItem('userResume');
      setUseResume(!!savedResume);
    } catch (e) {
      // If local storage is disabled or fails, default to false
      setUseResume(false);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (useResume && !localStorage.getItem('userResume')) {
        toast({
            title: 'No Resume Found',
            description: 'Please upload a resume first or disable the "Use my saved resume" option.',
            variant: 'destructive',
        });
        return;
    }

    const searchData = {
      title: values.jobTitle,
      location: values.address,
      radius: values.radius,
      salary: salary[0],
      useResume: useResume,
    };

    startTransition(async () => {
        try {
          const results = await sendToZapier(searchData);

          console.log('Zapier response:', results);
          
          if (!results || typeof results !== 'object' || !Array.isArray(results.jobs)) {
             toast({
                title: 'Agent Response Error',
                description: 'The agent returned data in an unexpected format. Please ensure your agent is instructed to reply with a JSON object containing a "jobs" array.',
                variant: 'destructive',
             });
             console.error('Expected response to have a "jobs" array, but received:', results);
             return; 
          }

          toast({
            title: 'Search complete!',
            description: `Found ${results.jobs.length} jobs.`,
          });
          
          sessionStorage.setItem('jobResults', JSON.stringify(results.jobs));
          
          const params = new URLSearchParams();
          if (values.jobTitle) params.append('title', values.jobTitle);
          params.append('location', values.address);
          params.append('radius', values.radius);
          params.append('salary', salary[0].toString());
          params.append('useResume', String(useResume));
      
          router.push(`/results?${params.toString()}`);

        } catch (error) {
          toast({
            title: 'Zapier Error',
            description: 'Could not get results from the webhook. Check the console for details.',
            variant: 'destructive',
          });
          console.error('Error fetching from Zapier:', error);
        }
    });
  }

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Find Your Next Job</CardTitle>
        <CardDescription>Enter your preferences to find jobs tailored for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between rounded-lg border p-4 bg-primary/20">
              <Label htmlFor="resume-toggle" className="text-base text-primary-foreground font-medium">
                Use my saved resume to improve results
              </Label>
              <Switch id="resume-toggle" checked={useResume} onCheckedChange={setUseResume} />
            </div>

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address or Nearest City</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="e.g., San Francisco, CA" 
                        className="pl-10" 
                        {...field}
                        ref={(e) => {
                            field.ref(e);
                            addressInputRef.current = e;
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance Radius</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select distance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">5 km</SelectItem>
                          <SelectItem value="10">10 km</SelectItem>
                          <SelectItem value="25">25 km</SelectItem>
                          <SelectItem value="50">50 km</SelectItem>
                          <SelectItem value="100">100 km</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormItem>
                    <FormLabel>Desired Salary</FormLabel>
                    <div className="flex items-center gap-4 pt-2">
                        <Slider
                            value={salary}
                            onValueChange={setSalary}
                            max={250000}
                            step={1000}
                        />
                         <span className="text-sm font-medium w-28 text-right">${salary[0].toLocaleString()}+</span>
                    </div>
                 </FormItem>
            </div>
            
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isPending ? 'Searching...' : 'Search Jobs'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

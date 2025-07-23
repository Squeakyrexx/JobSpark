'use client';

import { useState } from 'react';
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
import { MapPin, Search } from 'lucide-react';

const formSchema = z.object({
  jobTitle: z.string().optional(),
  address: z.string().min(1, 'Location is required.'),
  radius: z.string().default('25'),
});

export function SearchForm() {
  const router = useRouter();
  const [useResume, setUseResume] = useState(true);
  const [salary, setSalary] = useState([70000]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      address: '',
      radius: '25',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams();
    if (values.jobTitle) params.append('title', values.jobTitle);
    params.append('location', values.address);
    params.append('radius', values.radius);
    params.append('salary', salary[0].toString());
    params.append('useResume', String(useResume));

    router.push(`/results?${params.toString()}`);
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
                      <Input placeholder="e.g., San Francisco, CA" className="pl-10" {...field} />
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
            
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <Search className="mr-2 h-4 w-4" />
              Search Jobs
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

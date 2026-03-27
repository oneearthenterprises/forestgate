'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { API } from '@/lib/api/api';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination-nav';
import { Download } from 'lucide-react';

export default function SubscribersPage() {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('Hello [Name],\n\nWelcome to our latest newsletter! We have some exciting updates to share with you.');
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const getSubscribers = async (page = 1) => {
    try {
      setLoading(true);

      const response = await fetch(`${API.getnewsletter}?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setNews(data.users || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.page || page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscribers(currentPage);
  }, [currentPage]);

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Subject and message are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      if (image) {
        formData.append('images', image);
      }

      const res = await fetch(API.sendnewsletter, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Newsletter sent successfully.",
        });
        setOpen(false);
        setSubject('');
        setMessage('');
        setImage(null);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send newsletter.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${API.getnewsletter}?page=1&limit=1000`);
      const data = await response.json();
      const allSubscribers = data.users || [];

      if (allSubscribers.length === 0) {
        toast({ title: "No data to export", description: "There are no subscribers to download." });
        return;
      }

      const headers = ["Email", "Subscription Date"];
      const rows = allSubscribers.map(s => [
        s.email,
        s.createdAt ? format(parseISO(s.createdAt), 'yyyy-MM-dd') : 'N/A'
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `forest_gate_subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Export Successful", description: `Exported ${allSubscribers.length} subscribers to CSV.` });
    } catch (error) {
      console.error("Export failed:", error);
      toast({ variant: "destructive", title: "Export Failed", description: "An error occurred while generating the CSV." });
    } finally {
      setIsExporting(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex border-b pb-4">
                <Skeleton className="h-4 w-24 mr-auto" />
                <Skeleton className="h-4 w-32" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Subscribers</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportCSV} 
            disabled={isExporting || news.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Send Newsletter</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Newsletter</DialogTitle>
                <DialogDescription>
                  Compose and send an email to all your active subscribers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendNewsletter} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input
                    id="subject"
                    placeholder="Newsletter Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Type your newsletter message here..."
                    className="min-h-[150px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">Header Image (Optional)</label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSending || news.length === 0}>
                    {isSending ? "Sending..." : "Send to All"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscribers</CardTitle>
          <CardDescription>
            A list of all users subscribed to the newsletter.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Subscription Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : news.length > 0 ? (
                  news.map((subscriber) => (
                    <TableRow key={subscriber._id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {subscriber.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{subscriber.email}</div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        {format(parseISO(subscriber.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}
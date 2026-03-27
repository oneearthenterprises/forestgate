'use client';

import { useEffect, useState } from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { API } from '@/lib/api/api';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Pagination } from '@/components/ui/pagination-nav';
import { Download } from 'lucide-react';

export default function ContactsPage() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const getContactMessages = async (page = 1) => {
    try {
        setLoading(true)
      const response = await fetch(`${API.ContactUsGet}?page=${page}&limit=10`);
      const data = await response.json();

      setMessages(data.contact || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.page || page);
      console.log(data);
    } catch (error) {
      console.log(error);
      setMessages([]);
      } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    getContactMessages(currentPage);
  }, [currentPage]);
  
  const handleReplyMessage = async (e) => {
    e.preventDefault();
    if (!replySubject || !replyMessage) {
      toast({
        title: "Error",
        description: "Subject and message are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsReplying(true);
      const res = await fetch(API.replyToContact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: selectedMessage._id,
          subject: replySubject,
          replyMessage: replyMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: "Reply sent successfully.",
        });
        setShowReplyForm(false);
        setReplySubject('');
        setReplyMessage('');
        setSelectedMessage(null);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send reply.",
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
      setIsReplying(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${API.ContactUsGet}?page=1&limit=1000`);
      const data = await response.json();
      const allMessages = data.contact || [];

      if (allMessages.length === 0) {
        toast({ title: "No data to export", description: "There are no messages to download." });
        return;
      }

      const headers = ["Full Name", "Email", "Message", "Received At"];
      const rows = allMessages.map(m => [
        `"${m.fullName || 'N/A'}"`,
        m.email || 'N/A',
        `"${(m.message || '').replace(/"/g, '""')}"`, // Handle quotes in messages
        m.createdAt ? format(parseISO(m.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A'
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `forest_gate_contacts_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Export Successful", description: `Exported ${allMessages.length} messages to CSV.` });
    } catch (error) {
      console.error("Export failed:", error);
      toast({ variant: "destructive", title: "Export Failed", description: "An error occurred while generating the CSV." });
    } finally {
      setIsExporting(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Contact Messages</h1>
        <Button 
          variant="outline" 
          onClick={handleExportCSV} 
          disabled={isExporting || (messages && messages.length === 0)}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            Messages received from the contact form.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                </TableRow>
              </TableHeader>

             <TableBody>
  {loading ? (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </TableCell>

        <TableCell>
          <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        </TableCell>

        <TableCell className="text-right">
          <div className="ml-auto h-4 w-20 rounded bg-muted animate-pulse" />
        </TableCell>
      </TableRow>
    ))
  ) : messages.length > 0 ? (
    messages.map((msg, index) => (
      <TableRow
        key={index}
        className="cursor-pointer"
        onClick={() => setSelectedMessage(msg)}
      >
        <TableCell>
          <div className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {msg.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="font-medium">{msg.fullName}</div>
              <div className="text-sm text-muted-foreground">
                {msg.email}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="max-w-[400px]">
          <p className="truncate">{msg.message}</p>
        </TableCell>

        <TableCell className="text-right">
          {msg.createdAt
            ? format(parseISO(msg.createdAt), 'MMM dd, yyyy')
            : '-'}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} className="text-center py-6">
        No messages found
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

      <Dialog
        open={!!selectedMessage}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedMessage(null);
            setShowReplyForm(false);
            setReplySubject('');
            setReplyMessage('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[625px]">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Message from {selectedMessage.fullName}
                </DialogTitle>

                <DialogDescription>
                  Email: {selectedMessage.email} | Received:{' '}
                  {selectedMessage.createdAt
                    ? format(
                        parseISO(selectedMessage.createdAt),
                        'MMM dd, yyyy, p'
                      )
                    : '-'}
                </DialogDescription>
              </DialogHeader>

                {showReplyForm ? (
                  <form onSubmit={handleReplyMessage} className="space-y-4 py-4">
                    <Separator />
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Subject</label>
                       <Input 
                        placeholder="Reply Subject"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        required
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Message</label>
                       <Textarea 
                        placeholder="Type your reply here..."
                        className="min-h-[150px]"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        required
                       />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReplyForm(false)}
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={isReplying}>
                        {isReplying ? "Sending..." : "Send Reply"}
                      </Button>
                    </DialogFooter>
                  </form>
                ) : (
                  <>
                    <Separator />
                    <div className="py-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedMessage(null)}
                      >
                        Close
                      </Button>

                      <Button 
                        type="button" 
                        onClick={() => {
                          setShowReplyForm(true);
                          setReplySubject(`Forest Gate Inquiry - ${selectedMessage.fullName}`);
                        }}
                      >
                        Reply
                      </Button>
                    </DialogFooter>
                  </>
                )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
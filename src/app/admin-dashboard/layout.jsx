'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BedDouble,
  LogOut,
  MountainSnow,
  Search,
  Bell,
  Mail,
  Contact,
  ClipboardList,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminDashboardLayout({
  children,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/admin-login');
  };

  const isLinkActive = (href) => {
    if (href === '/admin-dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-muted/30">
        <Sidebar variant="default" className="shrink-0">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <MountainSnow className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold font-headline truncate group-data-[state=collapsed]:hidden">
                Himachal Haven
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard')}
                  tooltip="Dashboard"
                >
                  <Link href="/admin-dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className='group-data-[state=collapsed]:hidden'>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard/rooms')}
                  tooltip="Rooms"
                >
                  <Link href="/admin-dashboard/rooms">
                    <BedDouble className="h-5 w-5" />
                     <span className='group-data-[state=collapsed]:hidden'>Rooms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard/orders')}
                  tooltip="Orders"
                >
                  <Link href="/admin-dashboard/orders">
                    <ClipboardList className="h-5 w-5" />
                    <span className='group-data-[state=collapsed]:hidden'>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard/subscribers')}
                  tooltip="Subscribers"
                >
                  <Link href="/admin-dashboard/subscribers">
                    <Mail className="h-5 w-5" />
                    <span className='group-data-[state=collapsed]:hidden'>Subscribers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard/contacts')}
                  tooltip="Contacts"
                >
                  <Link href="/admin-dashboard/contacts">
                    <Contact className="h-5 w-5" />
                    <span className='group-data-[state=collapsed]:hidden'>Contacts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut className="h-5 w-5" />
                        <span className='group-data-[state=collapsed]:hidden'>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className='flex flex-col flex-1 min-w-0'>
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
               <div className="relative flex-1 max-w-md hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 h-9" />
              </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Admin User</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    admin@himachalhaven.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem>Profile</DropdownMenuItem>
                         <DropdownMenuItem>Settings</DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={handleLogout} className="text-destructive">Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

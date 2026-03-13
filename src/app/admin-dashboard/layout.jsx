'use client';

import { useState } from 'react';
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
import { useAuthContext } from '@/context/AuthContext';
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
  Newspaper,
  Users,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminDashboardLayout({
  children,
}) {
const { logout ,adminEmail  } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
   await logout(  )
    
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
      <div className="flex h-screen overflow-hidden bg-muted/30 w-full">
        {/* Fixed Sidebar */}
        <Sidebar variant="default" className="shrink-0 border-r bg-card h-full">
          <SidebarHeader className="border-b px-6 py-4 group-data-[state=collapsed]:px-2">
            <div className="flex items-center gap-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:gap-0">
              <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
                <MountainSnow className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold font-headline truncate group-data-[state=collapsed]:hidden ml-3">
                The Forest Gate
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard')}
                  tooltip="Dashboard"
                >
                  <Link href="/admin-dashboard">
                    <LayoutDashboard className="h-5 w-5 shrink-0" />
                    <span className='group-data-[state=collapsed]:hidden font-medium'>Dashboard</span>
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
                    <BedDouble className="h-5 w-5 shrink-0" />
                     <span className='group-data-[state=collapsed]:hidden font-medium'>Rooms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard/blog')}
                  tooltip="Blog Posts"
                >
                  <Link href="/admin-dashboard/blog">
                    <Newspaper className="h-5 w-5 shrink-0" />
                     <span className='group-data-[state=collapsed]:hidden font-medium'>Blog</span>
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
                    <ClipboardList className="h-5 w-5 shrink-0" />
                    <span className='group-data-[state=collapsed]:hidden font-medium'>Orders</span>
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
                    <Mail className="h-5 w-5 shrink-0" />
                    <span className='group-data-[state=collapsed]:hidden font-medium'>Subscribers</span>
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
                    <Contact className="h-5 w-5 shrink-0" />
                    <span className='group-data-[state=collapsed]:hidden font-medium'>Contacts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/admin-dashboard/users')}
                  tooltip="Users"
                >
                  <Link href="/admin-dashboard/users">
                    <Users className="h-5 w-5 shrink-0" />
                    <span className='group-data-[state=collapsed]:hidden font-medium'>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-3 group-data-[state=collapsed]:p-2">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setIsLogoutDialogOpen(true)} 
                      tooltip="Logout"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span className='group-data-[state=collapsed]:hidden font-medium'>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content Area */}
        <div className='flex flex-col flex-1 min-w-0 h-full overflow-hidden'>
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
               <div className="relative flex-1 max-w-md hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search records..." className="pl-9 h-9 w-64 bg-muted/50" />
              </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
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
                                  {adminEmail || "admin@theforestgate.com"} 
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                         <DropdownMenuItem>Settings</DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)} className="text-destructive">
                           <LogOut className="mr-2 h-4 w-4" />
                           Logout
                         </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/10">
            {children}
          </main>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of the The Forest Gate admin panel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
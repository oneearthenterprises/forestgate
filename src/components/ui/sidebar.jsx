'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// --- Context ---
const SidebarContext = React.createContext(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({
  children,
  initialCollapsed = false,
}) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(
    isMobile ? true : initialCollapsed
  );

  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const value = {
    isCollapsed,
    toggleSidebar,
    isMobile,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

// --- Sidebar Root ---
const sidebarVariants = cva(
  'bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col h-full',
  {
    variants: {
      variant: {
        default: 'relative',
        floating: 'm-4 rounded-xl border shadow-sm',
      },
      collapsed: {
        true: 'w-[70px]',
        false: 'w-64',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Sidebar = React.forwardRef(
  ({ className, variant, collapsible, ...props }, ref) => {
    const { isCollapsed } = useSidebar();
    return (
      <aside
        ref={ref}
        className={cn(
          sidebarVariants({ variant, collapsed: isCollapsed }),
          className
        )}
        data-state={isCollapsed ? 'collapsed' : 'open'}
        {...props}
      />
    );
  }
);
Sidebar.displayName = 'Sidebar';

// --- Sidebar Trigger ---
export const SidebarTrigger = ({ className, ...props }) => {
  const { toggleSidebar, isMobile } = useSidebar();
  if (isMobile) return null;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn('h-8 w-8', className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <line x1="3" x2="21" y1="6" y2="6" />
        <line x1="3" x2="15" y1="12" y2="12" />
        <line x1="3" x2="9" y1="18" y2="18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

// --- Layout Components ---
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex h-16 shrink-0 items-center border-b border-sidebar-border px-6', className)}
    {...props}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-y-auto overflow-x-hidden p-3', className)}
    {...props}
  />
));
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-auto shrink-0 border-t border-sidebar-border p-3', className)}
    {...props}
  />
));
SidebarFooter.displayName = 'SidebarFooter';

// --- Menu Components ---
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn('flex flex-col gap-1', className)}
    {...props}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarMenuButton = React.forwardRef(
  ({ className, isActive, tooltip, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    const buttonContent = (
      <Button
        ref={ref}
        variant="ghost"
        className={cn(
          'w-full gap-3 justify-start px-3 py-2 h-10 transition-all font-medium',
          isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-muted-foreground hover:text-foreground',
          isCollapsed && 'justify-center px-0',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );

    if (isCollapsed && tooltip) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent;
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};

import { Home, Fingerprint, BookOpen, FileText, Brain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type WorkspaceTab = "Dashboard" | "My Learning DNA" | "History" | "Research & Impact";

const navItems: { label: WorkspaceTab; icon: typeof Home }[] = [
  { label: "Dashboard", icon: Home },
  { label: "My Learning DNA", icon: Fingerprint },
  { label: "History", icon: BookOpen },
  { label: "Research & Impact", icon: FileText },
];

export function AppSidebar({
  activeTab,
  onSelectTab,
}: {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
}) {
  return (
    <Sidebar className="no-print no-profile-print">
      <SidebarHeader>
        <div className="flex items-center gap-4 px-4 py-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Brain className="size-6" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground lg:text-2xl">
            Hyper-Mapper
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold uppercase tracking-wide lg:text-xl">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={activeTab === item.label}
                      onClick={() => onSelectTab(item.label)}
                      aria-current={activeTab === item.label ? "page" : undefined}
                      className="min-h-14 gap-4 py-3 text-xl font-semibold lg:text-2xl"
                    >
                      <Icon className="size-6 shrink-0 lg:size-7" aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

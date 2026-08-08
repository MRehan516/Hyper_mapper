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
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Brain className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            Hyper-Mapper
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={activeTab === item.label}
                      onClick={() => onSelectTab(item.label)}
                      aria-current={activeTab === item.label ? "page" : undefined}
                      className="min-h-11 gap-3 text-sm font-semibold"
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
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

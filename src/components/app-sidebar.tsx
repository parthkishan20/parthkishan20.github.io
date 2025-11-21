import * as React from "react"
import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  ScrollText,
  Users,
  FileText,
  Mail,
  Quote,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Import your site data
import siteData from "@/data/siteData.json"

// Navigation items with section IDs
const navigationItems = [
  { title: "Home", id: "home", icon: Home },
  { title: "About", id: "about", icon: User },
  { title: "Experience", id: "experience", icon: Briefcase },
  { title: "Education", id: "education", icon: GraduationCap },
  { title: "Skills", id: "skills", icon: Award },
  { title: "Projects", id: "projects", icon: Code },
  { title: "Certifications", id: "certifications", icon: ScrollText },
  { title: "Extracurricular", id: "extracurricular", icon: Users },
  { title: "Testimonials", id: "testimonials", icon: Quote },
  { title: "Resume", id: "resume", icon: FileText },
  { title: "Contact", id: "contact", icon: Mail },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection?: string;
}

export function AppSidebar({ activeSection, ...props }: AppSidebarProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/profile/avatar.png" alt={siteData.profile.name} />
            <AvatarFallback>{siteData.profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{siteData.profile.name}</p>
            <p className="text-xs text-muted-foreground">{siteData.profile.email}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={() => scrollToSection(item.id)}
                  isActive={isActive}
                  className="cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

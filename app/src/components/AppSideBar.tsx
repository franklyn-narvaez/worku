import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSidebarRoutes } from "@/hooks/sideBarRoutes";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
    const { logout } = useAuth();
    const sidebarRoutes = useSidebarRoutes();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>WorkU</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarRoutes.map((route) => {
                                const Icon = route.icon; // 👈 Componente del icono pasado en routeConfig
                                return (
                                    <SidebarMenuItem key={route.path}>
                                        <SidebarMenuButton asChild>
                                            <NavLink
                                                to={route.path || "#"}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${isActive
                                                        ? "bg-slate-200 text-slate-900"
                                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`
                                                }
                                            >
                                                {Icon && <Icon />}
                                                <span>{route.title}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className="p-4 border-t border-slate-200">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <NavLink
                                to="/auth/login"
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                                onClick={logout}
                            >
                                <LogOut size={20} />
                                <span>Cerrar sesión</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>
        </Sidebar>
    );
}

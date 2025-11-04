import { NavLink } from 'react-router-dom';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useSidebarRoutes } from '@/hooks/sideBarRoutes';
import LogOutButton from './LogOutButton';
import LogInUnivalle from '../public/LogInUnivalle.png';

export function AppSidebar() {
	const sidebarRoutes = useSidebarRoutes();

	return (
		<Sidebar className="bg-sidebar">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<div className="mt-10 flex justify-center">
							<img
								src={LogInUnivalle}
								alt="Worku Logo"
								className="h-12 w-auto object-contain"
							/>
						</div>
					</SidebarGroupLabel>
					<SidebarGroupContent className='mt-15'>
						<SidebarMenu>
							{sidebarRoutes.map(route => {
								const Icon = route.icon; // 👈 Componente del icono pasado en routeConfig
								return (
									<SidebarMenuItem key={route.path}>
										<SidebarMenuButton asChild>
											<NavLink
												to={route.path || '#'}
												className={({ isActive }) =>
													`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${isActive
														? 'bg-slate-200 text-slate-900'
														: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
			<LogOutButton />
		</Sidebar>
	);
}

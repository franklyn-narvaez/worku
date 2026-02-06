import { NavLink } from 'react-router-dom';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useSidebarRoutes } from '@/hooks/sideBarRoutes';
import LogInUnivalle from '../public/LogInUnivalle.png';
import LogOutButton from './LogOutButton';

export function AppSidebar() {
	const sidebarRoutes = useSidebarRoutes();

	return (
		<Sidebar className="bg-sidebar">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<div className="mt-10 flex justify-center">
							<img src={LogInUnivalle} alt="Worku Logo" className="h-12 w-auto object-contain" />
						</div>
					</SidebarGroupLabel>

					<SidebarGroupContent className="mt-15">
						<SidebarMenu>
							{sidebarRoutes.map(route => {
								const Icon = route.icon;
								return (
									<SidebarMenuItem key={route.path}>
										<NavLink
											end
											to={route.path || '#'}
											className={({ isActive }) =>
												`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                         ${
														isActive
															? 'bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]'
															: 'text-slate-600 hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]'
													}`
											}
										>
											{Icon && <Icon />}
											<span>{route.title}</span>
										</NavLink>
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

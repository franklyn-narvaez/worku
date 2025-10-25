import { Suspense } from 'react';
import { AppSidebar } from './AppSideBar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Outlet } from 'react-router-dom';

export default function NavWrapper() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarTrigger />
			<Suspense fallback={<div>Loading sidebar...</div>}>
				<div className="flex-1 flex flex-col">
					<Outlet />
				</div>
			</Suspense>
		</SidebarProvider>
	);
}

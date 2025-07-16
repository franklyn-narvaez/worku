"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`h-screen bg-slate-900 text-white flex flex-col justify-between transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <Menu />
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-8">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 hover:text-slate-300"
            >
              <Home />
              {isExpanded && <span>Inicio</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 hover:text-slate-300"
            >
              <LayoutDashboard />
              {isExpanded && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/offers"
              className="flex items-center gap-3 hover:text-slate-300"
            >
              <LogIn />
              {isExpanded && <span>Ofertas</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 hover:text-slate-300"
            >
              <UserPlus />
              {isExpanded && <span>Usuarios</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 hover:text-red-400"
        >
          <LogOut />
          {isExpanded && <span>Cerrar sesión</span>}
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;

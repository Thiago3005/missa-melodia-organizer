
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Music, 
  MessageSquare, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [collapsed, setCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'missas', label: 'Missas', icon: Calendar },
    { id: 'musicos', label: 'Músicos', icon: Users },
    { id: 'musicas', label: 'Músicas', icon: Music },
    { id: 'sugestoes', label: 'Sugestões', icon: MessageSquare },
    { id: 'relatorios', label: 'Relatórios', icon: FileText }
  ];

  return (
    <div className={cn(
      "bg-slate-900 text-white transition-all duration-300 flex flex-col min-h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold">Música Litúrgica</h1>
              <p className="text-xs text-slate-400">Paróquia Boa Viagem</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-slate-800"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full justify-start gap-3 h-12 rounded-none px-4 text-left",
                "hover:bg-slate-800 hover:text-white",
                isActive && "bg-blue-600 text-white hover:bg-blue-700 border-r-2 border-blue-400"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{tab.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            Sistema de Gestão Musical
          </p>
        </div>
      )}
    </div>
  );
}


import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'missas', label: '📅 Missas', icon: '🎵' },
    { id: 'musicos', label: '👥 Músicos', icon: '🎤' },
    { id: 'musicas', label: '🎼 Músicas', icon: '📝' },
    { id: 'buscar', label: '🔍 Buscar', icon: '🔎' },
    { id: 'historico', label: '📚 Histórico', icon: '📋' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => onTabChange(tab.id)}
              className="py-4 px-6 text-sm font-medium"
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}

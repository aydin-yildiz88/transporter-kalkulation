import { useAppStore } from '../store/appStore';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentSheet, sidebarOpen, toggleSidebar } = useAppStore();

  const sheets = [
    { id: 'datenblatt', label: 'Datenblatt', icon: '📋' },
    { id: 'nebenrechnungen', label: 'Nebenrechnungen', icon: '🔢' },
    { id: 'splitsatz', label: 'Splitsatz', icon: '🔀' },
    { id: 'auftragskalkulation', label: 'Auftragskalkulation', icon: '📊' },
    { id: 'personal', label: 'Personal', icon: '👥' },
    { id: 'verwaltung', label: 'Verwaltung', icon: '🏢' },
    { id: 'kfzkosten', label: 'KFZ Kosten', icon: '🚗' },
    { id: 'stopp', label: 'Stopp', icon: '⏸️' },
    { id: 'kostentransporter', label: 'Kosten Transporter', icon: '💰' },
    { id: 'stundenzettel', label: 'Stundenzettel', icon: '⏱️' },
    { id: 'fahrtenbuch', label: 'Fahrtenbuch', icon: '🛣️' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-24'
        } bg-gradient-to-br from-blue-600 to-blue-700 text-white transition-all duration-300 overflow-y-auto shadow-lg flex flex-col`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚛</div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg leading-tight">Transporter</h1>
                <p className="text-xs text-blue-200">Kalkulation</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sheets.map((sheet) => {
            const isActive = currentSheet === sheet.id;
            return (
              <button
                key={sheet.id}
                onClick={() => useAppStore.setState({ currentSheet: sheet.id as any })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 shadow-lg text-white'
                    : 'text-blue-100 hover:bg-blue-600/50 hover:text-white'
                }`}
                title={sheet.label}
              >
                <span className="text-xl flex-shrink-0">{sheet.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate text-left">
                    {sheet.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="border-t border-blue-500/30 p-4">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-blue-100 hover:bg-blue-600/50 transition-all"
            title={sidebarOpen ? 'Sidebar einklappen' : 'Sidebar ausklappen'}
          >
            <span className="text-lg">{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="text-xs font-medium">Einklappen</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sheets.find((s) => s.id === currentSheet)?.label}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Verwalten und berechnen Sie Ihre Transportkosten</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

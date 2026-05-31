import { useAppStore } from '../store/appStore';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentSheet, sidebarOpen, toggleSidebar } = useAppStore();

  const sheets = [
    { id: 'datenblatt', label: '📋 Datenblatt', icon: '📋' },
    { id: 'nebenrechnungen', label: '🔢 Nebenrechnungen', icon: '🔢' },
    { id: 'splitsatz', label: '🔀 Splitsatz', icon: '🔀' },
    { id: 'auftragskalkulation', label: '📊 Auftragskalkulation', icon: '📊' },
    { id: 'personal', label: '👥 Personal', icon: '👥' },
    { id: 'verwaltung', label: '🏢 Verwaltung', icon: '🏢' },
    { id: 'kfzkosten', label: '🚗 KFZ Kosten', icon: '🚗' },
    { id: 'stopp', label: '⏸️ Stopp', icon: '⏸️' },
    { id: 'kostentransporter', label: '💰 Kosten Transporter', icon: '💰' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-br from-blue-600 to-blue-800 text-white transition-all duration-300 overflow-y-auto`}
      >
        <div className="p-4 border-b border-blue-700">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-xs text-center'}`}>
            {sidebarOpen ? '🚛 Kalkulation' : '🚛'}
          </h1>
        </div>

        <nav className="p-2">
          {sheets.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => useAppStore.setState({ currentSheet: sheet.id as any })}
              className={`w-full p-3 mb-2 rounded text-left transition-all ${
                currentSheet === sheet.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'hover:bg-blue-700'
              } ${!sidebarOpen && 'text-center'}`}
              title={sheet.label}
            >
              <span className="text-lg">{sheet.icon}</span>
              {sidebarOpen && <span className="text-sm ml-2">{sheet.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded"
            title={sidebarOpen ? 'Sidebar einklappen' : 'Sidebar ausklappen'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {sheets.find((s) => s.id === currentSheet)?.label}
          </h2>
          <div className="w-10" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

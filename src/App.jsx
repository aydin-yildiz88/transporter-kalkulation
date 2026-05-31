import { useEffect } from 'react'
import './App.css'
import { MainLayout } from './components/Layout'
import { Sheet1Datenblatt } from './components/sheets/Sheet1Datenblatt'
import { Sheet2Nebenrechnungen } from './components/sheets/Sheet2Nebenrechnungen'
import { Sheet3Splitsatz } from './components/sheets/Sheet3Splitsatz'
import { Sheet4Auftragskalkulation } from './components/sheets/Sheet4Auftragskalkulation'
import { Sheet5PersonalKosten } from './components/sheets/Sheet5PersonalKosten'
import {
  Sheet6Verwaltung,
  Sheet7KFZKosten,
  Sheet8Stopp,
  Sheet9KostenTransporter,
} from './components/sheets/SheetSkeleton'
import { useAppStore } from './store/appStore'
import { storageService } from './services/storage'
import { useDemoData } from './hooks/useDemoData'

function App() {
  const currentSheet = useAppStore((state) => state.currentSheet)

  // Initialize Database
  useEffect(() => {
    storageService.init().catch((error) => {
      console.error('Failed to initialize database:', error)
    })
  }, [])

  // Load demo data on first start (can be disabled)
  useDemoData(true)

  const renderSheet = () => {
    switch (currentSheet) {
      case 'datenblatt':
        return <Sheet1Datenblatt />
      case 'nebenrechnungen':
        return <Sheet2Nebenrechnungen />
      case 'splitsatz':
        return <Sheet3Splitsatz />
      case 'auftragskalkulation':
        return <Sheet4Auftragskalkulation />
      case 'personal':
        return <Sheet5PersonalKosten />
      case 'verwaltung':
        return <Sheet6Verwaltung />
      case 'kfzkosten':
        return <Sheet7KFZKosten />
      case 'stopp':
        return <Sheet8Stopp />
      case 'kostentransporter':
        return <Sheet9KostenTransporter />
      default:
        return <Sheet1Datenblatt />
    }
  }

  return (
    <MainLayout>
      {renderSheet()}
    </MainLayout>
  )
}

export default App

// import { useState } from 'react'
// import { useMetro } from '../context/MetroContext'
// import LineList from '../components/admin/LineManagement/LineList'
// import BulkImport from '../components/admin/BulkImport/BulkImport'
// import CompatMatrix from '../components/admin/CompatibilityMatrix/CompatMatrix'
// import { Loader } from '../components/common/Loader'

// const TABS = [
//   { id: 'lines',  label: '🛤️ Line Management' },
//   { id: 'import', label: '📥 Bulk Import'      },
//   { id: 'matrix', label: '🔢 Compat Matrix'    },
// ]

// export default function AdminPage() {
//   const [activeTab, setActiveTab] = useState('lines')
//   const { lines, loading, refetch } = useMetro()

//   const totalStations = lines.reduce((sum, l) => sum + (l.stations?.length || 0), 0)

//   return (
//     <div className="flex min-h-[calc(100vh-60px)]">

//       {/* Sidebar */}
//       <aside className="w-56 bg-surface border-r border-metro p-5 flex-shrink-0 flex flex-col">
//         <div className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-4">
//           Admin Panel
//         </div>

//         <nav className="flex flex-col gap-1">
//           {TABS.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
//                 ${activeTab === tab.id
//                   ? 'bg-accent text-white'
//                   : 'text-muted hover:bg-surface2 hover:text-[#e8eaf6]'}`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </nav>

//         {/* Stats card */}
//         <div className="mt-auto bg-surface2 rounded-xl p-4">
//           <div className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">
//             Network Stats
//           </div>
//           <div className="text-2xl font-bold text-accent">{lines.length}</div>
//           <div className="text-xs text-muted mb-3">Active Lines</div>
//           <div className="text-2xl font-bold text-[#e8eaf6]">{totalStations}</div>
//           <div className="text-xs text-muted">Total Stations</div>
//         </div>
//       </aside>

//       {/* Content area */}
//       <main className="flex-1 p-7 overflow-y-auto">
//         {loading
//           ? <Loader text="Loading network data..." />
//           : (
//             <>
//               {activeTab === 'lines'  && <LineList    lines={lines} onUpdate={refetch} />}
//               {activeTab === 'import' && <BulkImport  />}
//               {activeTab === 'matrix' && <CompatMatrix />}
//             </>
//           )
//         }
//       </main>
//     </div>
//   )
// }



import { useState } from 'react'
import { useMetro } from '../context/MetroContext'
import LineList from '../components/admin/LineManagement/LineList'
import BulkImport from '../components/admin/BulkImport/BulkImport'
import CompatMatrix from '../components/admin/CompatibilityMatrix/CompatMatrix'
import { Loader } from '../components/common/Loader'

const TABS = [
  { id: 'lines',  label: 'Line Management', icon: '🛤️' },
  { id: 'import', label: 'Bulk Import',      icon: '📥' },
  { id: 'matrix', label: 'Compat Matrix',    icon: '🔢' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('lines')
  const { lines, loading, refetch } = useMetro()

  const totalStations = lines.reduce((sum, l) => sum + (l.stations?.length || 0), 0)

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-60px)]">

      {/* ── SIDEBAR — desktop only ── */}
      <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-metro p-5 flex-shrink-0">
        <div className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-4">
          Admin Panel
        </div>

        <nav className="flex flex-col gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-muted hover:bg-surface2 hover:text-[#e8eaf6]'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {/* Stats */}
        <div className="mt-auto bg-surface2 rounded-xl p-4">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">
            Network Stats
          </div>
          <div className="text-2xl font-bold text-accent">{lines.length}</div>
          <div className="text-xs text-muted mb-3">Active Lines</div>
          <div className="text-2xl font-bold text-[#e8eaf6]">{totalStations}</div>
          <div className="text-xs text-muted">Total Stations</div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR — stats + tabs ── */}
      <div className="md:hidden bg-surface border-b border-metro">
        {/* Stats row */}
        <div className="flex gap-4 px-4 py-3 border-b border-metro">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-accent">{lines.length}</div>
            <div className="text-xs text-muted">Lines</div>
          </div>
          <div className="w-px bg-metro" />
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-[#e8eaf6]">{totalStations}</div>
            <div className="text-xs text-muted">Stations</div>
          </div>
        </div>

        {/* Tab pills — horizontal scroll */}
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                         whitespace-nowrap flex-shrink-0 transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-surface2 text-muted border border-metro'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="flex-1 p-4 md:p-7 overflow-y-auto">
        {loading
          ? <Loader text="Loading network data..." />
          : (
            <>
              {activeTab === 'lines'  && <LineList    lines={lines} onUpdate={refetch} />}
              {activeTab === 'import' && <BulkImport  />}
              {activeTab === 'matrix' && <CompatMatrix />}
            </>
          )
        }
      </main>
    </div>
  )
}
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api';
import { parseCSV, parseJSON, validateStationData } from '../../../utils/csvParser'
const API_URL = import.meta.env.VITE_API_URL;
export default function BulkImport() {
  const [rows,       setRows]       = useState([])
  const [fileName,   setFileName]   = useState('')
  const [validation, setValidation] = useState(null)
  const [importing,  setImporting]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [result,     setResult]     = useState(null)
  const [dragOver,   setDragOver]   = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    setResult(null)
    setValidation(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      let parsed
      if (file.name.endsWith('.json')) {
        parsed = parseJSON(text)
        if (!parsed) { alert('Invalid JSON'); return }
      } else {
        parsed = parseCSV(text)
      }
      setRows(parsed)
      setValidation(validateStationData(parsed))
    }
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleCommit = async () => {
    if (!validation?.isValid) return
    setImporting(true)
    setProgress(0)
    const interval = setInterval(() => setProgress(p => Math.min(p + 12, 90)), 200)
    try {
      const { data } = await api.post(`${API_URL}/api/import/commit`, { stations: rows })
      setProgress(100)
      setResult(data.data)
    } catch (err) {
      alert('Import failed')
    } finally {
      clearInterval(interval)
      setImporting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#e8eaf6]">Bulk Import</h2>
        <p className="text-xs text-muted mt-1">Upload a CSV or JSON file with station data</p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-5
          ${dragOver ? 'border-accent bg-accent/5' : 'border-metro bg-surface hover:border-accent/50'}`}
      >
        <div className="text-4xl mb-3">📁</div>
        <p className="text-sm font-medium text-[#e8eaf6]">Drop CSV or JSON file here</p>
        <p className="text-xs text-muted mt-1">or click to browse</p>
        {fileName && (
          <p className="mt-3 text-xs text-accent font-semibold">📄 {fileName}</p>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.json"
          onChange={e => handleFile(e.target.files[0])}
          className="hidden"
        />
      </div>

      {/* Format hint */}
      <div className="bg-surface border border-metro rounded-xl px-4 py-3 mb-5 text-xs text-muted">
        <strong className="text-[#e8eaf6]">CSV format: </strong>
        <code>name,code,line</code> e.g. <code>Kashmere Gate,KG,Yellow Line</code>
      </div>

      {/* Validation */}
      {validation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-metro rounded-xl p-4 mb-5"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-lg">{validation.isValid ? '✅' : '❌'}</span>
            <h3 className="text-sm font-bold text-[#e8eaf6]">
              {validation.isValid ? 'Validation Passed' : 'Validation Failed'}
            </h3>
            <span className="text-xs text-muted ml-auto">{rows.length} rows</span>
          </div>
          {validation.errors.map((e, i) => (
            <div key={i} className="px-3 py-1.5 bg-red-500/10 rounded-lg text-xs text-red-400 mb-1.5">
              ❌ {e.message}
            </div>
          ))}
          {validation.warnings.map((w, i) => (
            <div key={i} className="px-3 py-1.5 bg-amber-500/10 rounded-lg text-xs text-amber-400 mb-1.5">
              ⚠️ {w.message}
            </div>
          ))}
        </motion.div>
      )}

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="bg-surface border border-metro rounded-xl p-4 mb-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-[#e8eaf6] mb-3">Preview ({rows.length} rows)</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {Object.keys(rows[0])
                  .filter(k => k !== '_rowIndex')
                  .map(k => (
                    <th key={k} className="text-left px-3 py-2 text-[10px] font-semibold text-muted uppercase tracking-wide border-b border-metro">
                      {k}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, i) => {
                const hasError = validation?.errors.some(e => e.row === row._rowIndex)
                return (
                  <tr key={i} className={hasError ? 'bg-red-500/5' : ''}>
                    {Object.entries(row)
                      .filter(([k]) => k !== '_rowIndex')
                      .map(([k, v]) => (
                        <td key={k} className="px-3 py-2 border-b border-white/[0.04] text-[#e8eaf6]">
                          {v || <span className="text-red-400">—</span>}
                        </td>
                      ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {rows.length > 10 && (
            <p className="text-center text-xs text-muted mt-2.5">+{rows.length - 10} more rows</p>
          )}
        </div>
      )}

      {/* Progress bar */}
      {importing && (
        <div className="mb-5">
          <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted mt-1.5 text-right">{progress}%</p>
        </div>
      )}

      {/* Success result */}
      {result && (
        <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-xs text-green-400 mb-4">
          ✅ Import complete — Created: {result.stationsCreated} · Updated: {result.stationsUpdated}
        </div>
      )}

      {/* Commit */}
      {rows.length > 0 && validation?.isValid && !result && (
        <button
          onClick={handleCommit}
          disabled={importing}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-accent text-white hover:bg-accent-h disabled:opacity-50 transition-all"
        >
          {importing ? '⏳ Importing...' : `📥 Import ${rows.length} Stations`}
        </button>
      )}
    </div>
  )
}
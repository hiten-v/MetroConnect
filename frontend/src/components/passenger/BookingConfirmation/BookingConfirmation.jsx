
import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import QRTicket from './QRTicket'
import { useBooking } from '../../../context/BookingContext'

export default function BookingConfirmation({ route, onNewBooking }) {
  const { source, destination, setBooking, booking } = useBooking()
  const [loading,   setLoading]   = useState(false)
  const [confirmed, setConfirmed] = useState(booking || null)
  const [error,     setError]     = useState(null)

  const confirmBooking = async () => {
    if (!source || !destination || !route) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post('/api/bookings', {
        source: source.name,
        destination: destination.name,
        route,
        fare: route.fare,
        passengerName: 'Guest',
      })
      setConfirmed(data.data)
      setBooking(data.data)
    } catch {
      setError('Failed to confirm booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Confirmed ── */
  if (confirmed) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-metro rounded-xl p-4 md:p-5">

      <div className="text-center mb-5">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="text-4xl md:text-5xl mb-2">
        </motion.div>
        <h2 className="text-lg md:text-xl font-bold text-[#e8eaf6]">Booking Confirmed!</h2>
        <p className="text-muted text-xs md:text-sm mt-1">Your metro ticket is ready</p>
      </div>

      <div className="bg-surface2 border border-metro rounded-xl p-4 mb-4">
        {/* Route header */}
        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
          <div>
            <div className="text-[10px] text-muted uppercase tracking-widest">From</div>
            <div className="font-bold text-sm md:text-base text-[#e8eaf6]">{confirmed.source}</div>
          </div>
          <span className="text-accent text-xl self-center">→</span>
          <div className="text-right">
            <div className="text-[10px] text-muted uppercase tracking-widest">To</div>
            <div className="font-bold text-sm md:text-base text-[#e8eaf6]">{confirmed.destination}</div>
          </div>
        </div>

        {/* Stats — 2 col grid on mobile */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Info label="Fare"        value={`₹${confirmed.fare}`}              accent />
          <Info label="Travel Time" value={`${confirmed.route.totalTime} min`} />
          <Info label="Stops"       value={confirmed.route.totalStops}         />
          <Info label="Transfers"   value={confirmed.route.transfers}          />
        </div>

        <div className="flex justify-center">
          <QRTicket qrData={confirmed.qrData} bookingRef={confirmed.bookingRef} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => {
            const el   = document.createElement('a')
            const blob = new Blob([JSON.stringify(confirmed, null, 2)], { type: 'application/json' })
            el.href     = URL.createObjectURL(blob)
            el.download = `ticket-${confirmed.bookingRef}.json`
            el.click()
          }}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-metro
                     text-muted hover:bg-surface2 hover:text-[#e8eaf6] transition-all text-center"
        >
          📥 Download Ticket
        </button>
        <button onClick={onNewBooking}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-accent text-white
                     hover:bg-accent-h transition-all text-center">
          + New Booking
        </button>
      </div>
    </motion.div>
  )

  /* ── Pre-confirm ── */
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-metro rounded-xl p-4 md:p-5">

      <h3 className="text-base font-bold mb-4 text-[#e8eaf6]">Confirm Booking</h3>

      <div className="flex justify-between items-center bg-surface2 rounded-xl px-4 py-3 mb-4 flex-wrap gap-2">
        <div>
          <div className="text-[10px] text-muted uppercase tracking-widest">From</div>
          <div className="font-bold text-sm text-[#e8eaf6]">{source?.name}</div>
        </div>
        <span className="text-accent text-xl">→</span>
        <div className="text-right">
          <div className="text-[10px] text-muted uppercase tracking-widest">To</div>
          <div className="font-bold text-sm text-[#e8eaf6]">{destination?.name}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Info label="Duration"  value={`${route.totalTime} min`} />
        <Info label="Stops"     value={route.totalStops}         />
        <Info label="Transfers" value={route.transfers}          />
        <Info label="Fare"      value={`₹${route.fare}`}         accent />
      </div>

      <div className="flex gap-2">
        <button onClick={() => onNewBooking(true)}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-metro
                     text-muted hover:bg-surface2 transition-all">
          ← Back
        </button>
        <button onClick={confirmBooking} disabled={loading}
          className="flex-[2] py-2.5 rounded-xl text-sm font-bold bg-accent text-white
                     hover:bg-accent-h disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          {loading ? 'Confirming...' : 'Confirm & Get Ticket'}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
    </motion.div>
  )
}

function Info({ label, value, accent }) {
  return (
    <div className="bg-surface2 rounded-lg px-3 py-2.5">
      <div className="text-[10px] text-muted uppercase tracking-widest">{label}</div>
      <div className={`font-bold text-sm md:text-base mt-0.5 ${accent ? 'text-accent' : 'text-[#e8eaf6]'}`}>
        {value}
      </div>
    </div>
  )
}
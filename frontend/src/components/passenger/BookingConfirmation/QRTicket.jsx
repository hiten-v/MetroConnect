import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'

export default function QRTicket({ qrData, bookingRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && qrData) {
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 180,
        margin: 2,
        color: { dark: '#1a1d27', light: '#ffffff' },
      })
    }
  }, [qrData])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
      className="flex flex-col items-center"
    >
      <div className="p-4 bg-white rounded-2xl shadow-[0_8px_40px_rgba(108,99,255,0.3)]">
        <canvas ref={canvasRef} className="block rounded-lg" />
      </div>
      <p className="text-xs text-muted mt-2.5">Scan at station entry / exit</p>
      <div className="mt-2 font-mono text-sm tracking-widest font-bold text-accent">
        {bookingRef}
      </div>
    </motion.div>
  )
}
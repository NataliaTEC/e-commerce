// src/components/VoiceSearchPanel.jsx
import React, { useEffect, useRef, useState } from 'react'
import './VoiceSearchPanel.css'

const getSpeechRecognition = () =>
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)

export default function VoiceSearchPanel({ onClose, onResult, initialValue = '' }) {
  const [supported, setSupported] = useState(true)
  const [listening, setListening] = useState(false)
  const [text, setText] = useState(initialValue || '')
  const [status, setStatus] = useState('Haz clic y habla con normalidad.')
  const recognitionRef = useRef(null)

  const stopRecognition = () => {
    const r = recognitionRef.current
    if (!r) return
    try {
      r.onresult = null
      r.onend = null
      r.onerror = null
      r.stop()
      r.abort && r.abort()
    } catch {}
    recognitionRef.current = null
    setListening(false)
  }

  const startRecognition = () => {
    const SR = getSpeechRecognition()
    if (!SR) {
      setSupported(false)
      setStatus('Lo siento, la búsqueda por voz no está disponible en este navegador.')
      return
    }

    stopRecognition()

    const r = new SR()
    recognitionRef.current = r
    const isEs = navigator.language?.toLowerCase().startsWith('es')
    r.lang = isEs ? 'es-ES' : 'en-US'
    r.interimResults = true
    r.maxAlternatives = 1

    let finalText = ''

    r.onstart = () => {
      setListening(true)
      setStatus(isEs ? 'Te estoy escuchando, habla con normalidad…' : 'Listening, speak normally…')
    }

    r.onresult = (evt) => {
      let interim = ''
      for (let i = evt.resultIndex; i < evt.results.length; i++) {
        const res = evt.results[i]
        if (res.isFinal) finalText += res[0].transcript + ' '
        else interim += res[0].transcript
      }
      const trimmed = (finalText + interim).trim()
      const full = trimmed.replace('.', ' ')
      setText(full)
    }

    r.onerror = (e) => {
      console.warn('[Voice] error', e)
      setListening(false)
      setStatus(isEs ? 'Ocurrió un problema al escuchar. Intenta de nuevo.' : 'There was an error. Try again.')
    }

    r.onend = () => {
      setListening(false)
      if (!text && !finalText) {
        setStatus(isEs ? 'No logré escuchar nada. Prueba de nuevo.' : 'I could not hear anything, try again.')
      } else {
        setStatus(isEs ? 'Listo, confirma tu búsqueda o vuelve a intentarlo.' : 'Done, confirm your search or try again.')
      }
    }

    try {
      r.start()
    } catch (err) {
      console.warn('[Voice] start failed', err)
      setSupported(false)
      setStatus('No fue posible iniciar la búsqueda por voz.')
    }
  }

  useEffect(() => {
    if (!getSpeechRecognition()) {
      setSupported(false)
      setStatus('Lo siento, la búsqueda por voz no está disponible en este navegador.')
      return
    }
    startRecognition()
    return () => {
      stopRecognition()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConfirm = () => {
    stopRecognition()
    const value = text.trim()
    if (onResult) onResult(value)
  }

  const handleClose = () => {
    stopRecognition()
    if (onClose) onClose()
  }

  return (
    <div className="vs-overlay" role="dialog" aria-label="Búsqueda por voz">
      <div className="vs-panel">
        <button className="vs-close" onClick={handleClose} aria-label="Cerrar búsqueda por voz">
          ×
        </button>

        <div className="vs-mic-wrap">
          <button
            type="button"
            className={`vs-mic ${listening ? 'listening' : ''}`}
            onClick={() => !listening && startRecognition()}
            aria-label="Iniciar búsqueda por voz"
          >
            🎤
          </button>
        </div>

        <p className="vs-status">
          {supported
            ? listening
              ? 'Te estoy escuchando, habla con calma y naturalidad.'
              : status
            : status}
        </p>

        <div className="vs-preview">
          {text ? (
            <span>{text}</span>
          ) : (
            <span className="vs-placeholder">
              El texto que dictes aparecerá aquí…
            </span>
          )}
        </div>

        <div className="vs-actions">
          <button className="vs-btn ghost" type="button" onClick={handleClose}>
            Cancelar
          </button>
          <button className="vs-btn primary" type="button" onClick={handleConfirm}>
            Usar este texto
          </button>
        </div>
      </div>
    </div>
  )
}

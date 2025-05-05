import { useEffect, useRef, useState } from 'react'
import Vapi from '@vapi-ai/web'
import '../css/vapiai.css'

const PUBLIC_KEY = import.meta.env.VITE_VAPI_KEY
const ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_KEY

const VapiAI = () => {
    const vapiRef = useRef(null)
    const [isCalling, setIsCalling] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [log, setLog] = useState([])
    const [isDarkMode, setIsDarkMode] = useState(true)

    useEffect(() => {
        const vapi = new Vapi(PUBLIC_KEY)
        vapiRef.current = vapi

        vapi.on('call-start', () => logMsg('Call started'))

        vapi.on('call-end', () => {
            setIsCalling(false)
            logMsg('Call ended')
        })

        vapi.on('speech-start', () => logMsg('Speech started'))
        vapi.on('speech-end', () => logMsg('Speech ended'))

        vapi.on('message', (message) => {
            logMsg(`[${message.message.role}]: ${message.message.content}`)
        })

        vapi.on('volume-level', (volume) => {
            console.log(`Volume: ${volume}`)
        })

        vapi.on('error', (error) => {
            console.error(error)
            logMsg(`Error: ${error.message}`)
        })
    }, [])

    const logMsg = (msg) => {
        setLog(prev => [...prev, msg])
    }

    const startCall = () => {
        if (!vapiRef.current) return
        setIsCalling(true)

        vapiRef.current.start(
            ASSISTANT_ID,
            {
                recordingEnabled: true,
                variableValues: { name: 'John' },
            }
        )
    }

    const stopCall = () => {
        vapiRef.current?.stop()
        setIsCalling(false)
    }

    const toggleMute = () => {
        const muted = !isMuted
        setIsMuted(muted)
        vapiRef.current?.setMuted(muted)
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <div className='vapi-container' data-theme={isDarkMode ? 'dark' : 'light'}>
            <button
                onClick={toggleTheme}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? '#fff' : '#1a1a1a',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                    padding: 0,
                    outline: 'none',
                }}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
                {isDarkMode ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 22V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M20 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M2 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M17.6569 6.34315L19.0711 4.92893" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4.92893 19.0711L6.34315 17.6569" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M17.6569 17.6569L19.0711 19.0711" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4.92893 4.92893L6.34315 6.34315" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20V4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z"
                            fill="currentColor"
                        />
                    </svg>
                )}
            </button>
            
            <div className="vapi-header">
                <div className="vapi-logo">
                    <img src="/icon.svg" alt="Vapi Logo" />
                </div>
                <h2 className='vapi-title'>Voice Chat</h2>
            </div>
            
            <div className='vapi-buttons'>
                <button onClick={startCall} disabled={isCalling} className='start'>Start Call</button>
                <button onClick={stopCall} disabled={!isCalling} className='stop'>Stop Call</button>
                <button onClick={toggleMute} disabled={!isCalling} className='mute'>Mute</button>
            </div>
            
            <div className='vapi-logs'>
                {log.length > 0 && ( <p className='vapi-text-logs vapi-log-fixed'>Status: &nbsp;{log[0]}</p> )}

                <div className='vapi-log-scrollable'>
                    {log.slice(1).map((entry, i) => ( <p key={i + 1} className='vapi-text-logs'>Status: &nbsp;{entry}</p> ))}
                </div>
            </div>
        </div>
    )
}

export default VapiAI
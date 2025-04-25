import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function BottomBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname
    if (path === '/overall') return 'overall'
    if (path === '/fixtures') return 'fixtures'
    return 'fixtures'
  })

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'overall':
        navigate('/overall')
        break
      case 'fixtures':
        navigate('/fixtures')
        break
      default:
        navigate('/fixtures')
        break
    }
  }

  return (
    <div className="bottom-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
      <button 
        className={location.pathname === '/fixtures' ? 'active' : ''}
        onClick={() => handleTabClick('fixtures')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button 
        className={location.pathname === '/overall' ? 'active' : ''}
        onClick={() => handleTabClick('overall')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
        </svg>
      </button>
    </div>
  )
} 
import styles from './ThankYouPage.module.css'
import { useWinnerData } from '../hooks/useWinnerData'

export function ThankYouPage() {
  const { winnerData, loading, error } = useWinnerData()

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Thank You Section */}
      <div className={styles.thankYouSection}>
        <div className={styles.thankYouHeader}>
          <h1 className={styles.mainTitle}>🙏 Thank You!</h1>
        </div>
        
        <div className={styles.appreciationMessage}>
          <p>
            Thanks for going along with my request and sticking with it even when I was slacking on updating the scores. Appreciate it!
          </p>
        </div>
      </div>

      {/* Winners Announcement Section */}
      <div className={styles.announcementSection}>
        <h2 className={styles.announcementTitle}>🏆</h2>
        <h2 className={styles.announcementTitle}>We have the results!</h2>
        
        <div className={styles.winnersContainer}>
          {/* Overall Points Winner */}
          <div className={styles.winnerCard}>
            <div className={styles.winnerBadge}>
              <span className={styles.trophy}>👑</span>
              <span className={styles.winnerLabel}>Overall Points Champion</span>
            </div>
            <div className={styles.winnerDetails}>
              <h3 className={styles.winnerName}>{winnerData?.overallPointsWinner.name}</h3>
              <p className={styles.winnerStats}>{winnerData?.overallPointsWinner.points} Points</p>
            </div>
            <div className={styles.winnerDetails}>
              <p className={styles.winnerStats} style={{ fontSize: '12px' }}>Prize Money</p>
              <h3 className={styles.winnerName}>₹3500</h3>
            </div>
          </div>

          {/* Overall Points Runner */}
          <div className={styles.winnerCard}>
            <div className={styles.winnerBadge}>
              <span className={styles.trophy}>🥈</span>
              <span className={styles.winnerLabel}>Overall Points Runner-Up</span>
            </div>
            <div className={styles.winnerDetails}>
              <h3 className={styles.winnerName}>{winnerData?.overallPointsRunner.name}</h3>
              <p className={styles.winnerStats}>{winnerData?.overallPointsRunner.points} Points</p>
            </div>
            <div className={styles.winnerDetails}>
              <p className={styles.winnerStats} style={{ fontSize: '12px' }}>Prize Money</p>
              <h3 className={styles.winnerName}>₹1500</h3>
            </div>
          </div>

          {/* Most Wins */}
          <div className={styles.winnerCard}>
            <div className={styles.winnerBadge}>
              <span className={styles.trophy}>🏅</span>
              <span className={styles.winnerLabel}>Most Wins Champion</span>
            </div>
            <div className={styles.winnerDetails}>
              <h3 className={styles.winnerName}>{winnerData?.mostWins.name}</h3>
              <p className={styles.winnerStats}>{winnerData?.mostWins.wins} Wins</p>
            </div>
            <div className={styles.winnerDetails}>
              <p className={styles.winnerStats} style={{ fontSize: '12px' }}>Prize Money</p>
              <h3 className={styles.winnerName}>₹1000</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Message */}
      <div className={styles.closingSection}>
        <div className={styles.closingMessage}>
          <p>
            🎉 Congratulations to the winners and apologies to everyone for the late results!
          </p>
          
        </div>
        <div className={styles.winnerDetails}>
            <p className={styles.winnerStats} style={{ fontSize: '12px', paddingBottom: '10px' }}>Coming soon (may be)</p>
            <h3 className={styles.winnerName}>🏏 India Tour of England</h3>
            <h3 className={styles.winnerName}>⚽ English Premier League</h3>
          </div>
        
      </div>
      <div className={styles.winnerDetails} style={{width: '100%', textAlign: "center"}}>
            <h3 className={styles.winnerStats}>Do share your feedback and ideas!</h3>
            <a 
              href="https://wa.me/+919176080540" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '10px',
                fontSize: '2rem',
                textDecoration: 'none',
                color: '#25D366',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
            >
              <img 
                src="/icons/whatsapp.svg" 
                alt="WhatsApp" 
                style={{
                  width: '32px',
                  height: '32px'
                }}
              />
            </a>
          </div>
    </div>
  )
} 
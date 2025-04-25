import styles from './Tabs.module.css'

interface TabsProps {
  activeTab: string
  tabs: { id: string; label: string }[]
  onTabChange: (tabId: string) => void
}

export function Tabs({ activeTab, tabs, onTabChange }: TabsProps) {
  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : styles.inactive}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
} 
import './Statistics.css'
import { AnalysisHistory } from '../App'

interface StatisticsProps {
  totalAnalyses: number
  history: AnalysisHistory[]
}

function Statistics({ totalAnalyses, history }: StatisticsProps) {
  const getTopDiseases = () => {
    const diseaseCount: Record<string, number> = {}

    history.forEach(item => {
      diseaseCount[item.disease_detected] = (diseaseCount[item.disease_detected] || 0) + 1
    })

    return Object.entries(diseaseCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  const getAverageConfidence = () => {
    if (history.length === 0) return 0
    const sum = history.reduce((acc, item) => acc + item.confidence, 0)
    return (sum / history.length).toFixed(1)
  }

  const getRecentAnalyses = () => {
    return history.slice(0, 5)
  }

  const topDiseases = getTopDiseases()
  const avgConfidence = getAverageConfidence()
  const recentAnalyses = getRecentAnalyses()

  if (totalAnalyses === 0) return null

  return (
    <div className="statistics-section">
      <h2 className="stats-title">Analysis Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{totalAnalyses}</div>
          <div className="stat-label">Total Analyses</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{avgConfidence}%</div>
          <div className="stat-label">Avg Confidence</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-value">{topDiseases.length}</div>
          <div className="stat-label">Unique Diseases</div>
        </div>
      </div>

      <div className="details-grid">
        {topDiseases.length > 0 && (
          <div className="details-card">
            <h3 className="details-title">Most Detected Diseases</h3>
            <div className="disease-list">
              {topDiseases.map(([disease, count], idx) => (
                <div key={idx} className="disease-stat-item">
                  <div className="disease-stat-info">
                    <span className="disease-stat-rank">#{idx + 1}</span>
                    <span className="disease-stat-name">{disease}</span>
                  </div>
                  <span className="disease-stat-count">{count} times</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentAnalyses.length > 0 && (
          <div className="details-card">
            <h3 className="details-title">Recent Analyses</h3>
            <div className="recent-list">
              {recentAnalyses.map((item) => (
                <div key={item.id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-disease">{item.disease_detected}</span>
                    <span className="recent-time">
                      {new Date(item.analyzed_at).toLocaleDateString()} at{' '}
                      {new Date(item.analyzed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="recent-confidence">{item.confidence.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistics

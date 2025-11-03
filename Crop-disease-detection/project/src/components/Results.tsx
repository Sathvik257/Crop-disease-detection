import { useState, useEffect } from 'react'
import './Results.css'
import { Prediction } from '../App'
import { getDiseaseInfo, DiseaseInfo } from '../services/api'
import Solutions from './Solutions'

interface ResultsProps {
  imageUrl: string
  predictions: Prediction[]
  isAnalyzing: boolean
  error: string | null
  onReset: () => void
}

const getConfidenceLevel = (confidence: number) => {
  if (confidence >= 80) return { level: 'High', color: '#10b981' }
  if (confidence >= 60) return { level: 'Medium', color: '#f59e0b' }
  return { level: 'Low', color: '#ef4444' }
}

const getRecommendation = (confidence: number) => {
  if (confidence >= 80) {
    return 'High confidence detection. Consider consulting with an agricultural expert for treatment options.'
  }
  if (confidence >= 60) {
    return 'Moderate confidence. Additional images or expert consultation recommended for confirmation.'
  }
  return 'Low confidence. Please capture clearer images or consult an agricultural expert for accurate diagnosis.'
}

function Results({ imageUrl, predictions, isAnalyzing, error, onReset }: ResultsProps) {
  const [diseaseDetails, setDiseaseDetails] = useState<DiseaseInfo | null>(null)
  const [showDetails, setShowDetails] = useState(true)
  const [showSolutions, setShowSolutions] = useState(false)

  const topPrediction = predictions.length > 0 ? predictions[0] : null
  const confidenceInfo = topPrediction ? getConfidenceLevel(topPrediction.confidence) : null

  const getSeverity = (confidence: number): 'critical' | 'high' | 'moderate' | 'low' => {
    if (confidence >= 90) return 'critical'
    if (confidence >= 75) return 'high'
    if (confidence >= 60) return 'moderate'
    return 'low'
  }

  useEffect(() => {
    if (topPrediction && !isAnalyzing) {
      loadDiseaseDetails(topPrediction.disease)
    }
  }, [topPrediction, isAnalyzing])

  const loadDiseaseDetails = async (diseaseName: string) => {
    const details = await getDiseaseInfo(diseaseName)
    setDiseaseDetails(details)
  }

  return (
    <div className="results-section">
      <div className="results-grid">
        <div className="image-preview-container">
          <img src={imageUrl} alt="Uploaded crop" className="preview-image" />
          <button className="reset-button" onClick={onReset}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            Analyze Another
          </button>
        </div>

        <div className="predictions-container">
          <h2 className="predictions-title">Analysis Results</h2>

          {isAnalyzing && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing image with AI model...</p>
              <span className="loading-subtitle">Please wait while we process your image...</span>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          )}

          {!isAnalyzing && !error && predictions.length > 0 && (
            <>
              {confidenceInfo && (
                <div className="confidence-summary">
                  <div className="summary-badge" style={{ backgroundColor: confidenceInfo.color + '20', color: confidenceInfo.color }}>
                    <span className="summary-icon">🎯</span>
                    <span>{confidenceInfo.level} Confidence</span>
                  </div>
                  <p className="summary-text">{getRecommendation(topPrediction!.confidence)}</p>
                </div>
              )}

              <div className="predictions-list">
                {predictions.map((prediction, index) => (
                  <div key={index} className="prediction-item">
                    <div className="prediction-header">
                      <span className="prediction-rank">#{index + 1}</span>
                      <h3 className="prediction-disease">{prediction.disease}</h3>
                    </div>
                    <div className="confidence-bar-container">
                      <div
                        className="confidence-bar"
                        style={{ width: `${prediction.confidence}%` }}
                      >
                        <span className="confidence-label">{prediction.confidence.toFixed(1)}%</span>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="prediction-badge">Primary Detection</div>
                    )}
                  </div>
                ))}
              </div>

              {topPrediction && (
                <>
                  <div className="disease-info-block">
                    <div className="info-block-header">
                      <span className="info-block-icon">🦠</span>
                      <h3>About This Disease</h3>
                    </div>
                    <div className="info-block-content">
                      <div className="info-block-main">
                        <div className="info-block-item">
                          <span className="info-item-label">Disease Name:</span>
                          <span className="info-item-value">{topPrediction.disease}</span>
                        </div>
                        <div className="info-block-item">
                          <span className="info-item-label">Confidence:</span>
                          <span className="info-item-value">{topPrediction.confidence.toFixed(1)}%</span>
                        </div>
                        {diseaseDetails && (
                          <>
                            <div className="info-block-item">
                              <span className="info-item-label">Crop Type:</span>
                              <span className="info-item-value">{diseaseDetails.crop_type}</span>
                            </div>
                            <div className="info-block-item">
                              <span className="info-item-label">Severity Level:</span>
                              <span className={`severity-badge severity-${diseaseDetails.severity.toLowerCase().replace(' ', '-')}`}>
                                {diseaseDetails.severity}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="info-block-description">
                        <h4>Disease Description</h4>
                        {diseaseDetails ? (
                          <>
                            <p className="description-text">
                              <strong>Symptoms:</strong> {diseaseDetails.symptoms}
                            </p>
                            <p className="description-text">
                              <strong>What Causes This:</strong> {diseaseDetails.causes}
                            </p>
                            <p className="description-text">
                              <strong>How to Prevent:</strong> {diseaseDetails.prevention}
                            </p>
                          </>
                        ) : (
                          <p className="description-text">
                            This disease has been detected in your crop with {topPrediction.confidence.toFixed(1)}% confidence.
                            We recommend consulting with a local agricultural expert for detailed information and treatment options specific to your region.
                            Document the affected areas with clear photos and monitor the spread closely. Early intervention is key to preventing further damage.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {diseaseDetails && (
                  <div className="disease-details-card">
                  <div className="details-header">
                    <div className="header-content">
                      <span className="header-icon">📋</span>
                      <h3>Disease Information</h3>
                    </div>
                    <button
                      className="toggle-details-btn"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      <span className="btn-text">{showDetails ? 'Hide Details' : 'Show Full Details'}</span>
                      <svg
                        className={`btn-arrow ${showDetails ? 'expanded' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>

                  {showDetails && (
                    <div className="details-content">
                      <div className="detail-section">
                        <div className="detail-header">
                          <span className="detail-icon">🔍</span>
                          <h4>Symptoms</h4>
                        </div>
                        <p>{diseaseDetails.symptoms}</p>
                      </div>

                      <div className="detail-section">
                        <div className="detail-header">
                          <span className="detail-icon">⚠️</span>
                          <h4>Causes</h4>
                        </div>
                        <p>{diseaseDetails.causes}</p>
                      </div>

                      <div className="detail-section">
                        <div className="detail-header">
                          <span className="detail-icon">🛡️</span>
                          <h4>Prevention</h4>
                        </div>
                        <p>{diseaseDetails.prevention}</p>
                      </div>

                      <div className="detail-section">
                        <div className="detail-header">
                          <span className="detail-icon">💊</span>
                          <h4>Treatment</h4>
                        </div>
                        <p>{diseaseDetails.treatment}</p>
                      </div>

                      <div className="detail-grid">
                        <div className="detail-box">
                          <span className="box-label">Severity</span>
                          <span className={`severity-badge severity-${diseaseDetails.severity.toLowerCase().replace(' ', '-')}`}>
                            {diseaseDetails.severity}
                          </span>
                        </div>
                        <div className="detail-box">
                          <span className="box-label">Crop Type</span>
                          <span className="box-value">{diseaseDetails.crop_type}</span>
                        </div>
                      </div>

                      {diseaseDetails.affected_parts.length > 0 && (
                        <div className="detail-section">
                          <div className="detail-header">
                            <span className="detail-icon">🌿</span>
                            <h4>Affected Parts</h4>
                          </div>
                          <div className="affected-parts-list">
                            {diseaseDetails.affected_parts.map((part, idx) => (
                              <span key={idx} className="part-tag">{part}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {diseaseDetails.optimal_conditions && (
                        <div className="detail-section">
                          <div className="detail-header">
                            <span className="detail-icon">🌡️</span>
                            <h4>Optimal Conditions for Disease</h4>
                          </div>
                          <p>{diseaseDetails.optimal_conditions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                  )}
                </>
              )}

              <div className="action-buttons">
                <button
                  className="view-solutions-btn"
                  onClick={() => setShowSolutions(!showSolutions)}
                >
                  <span className="btn-icon">💊</span>
                  {showSolutions ? 'Hide Treatment Solutions' : 'View Treatment Solutions'}
                </button>
              </div>

              {showSolutions && topPrediction && (
                <Solutions
                  disease={topPrediction.disease}
                  severity={getSeverity(topPrediction.confidence)}
                />
              )}

              {!showSolutions && (
                <div className="results-info">
                  <div className="info-box">
                    <h4>Next Steps</h4>
                    <ul>
                      <li>Document the affected areas with photos</li>
                      <li>Isolate infected plants if possible</li>
                      <li>Consult with local agricultural extension</li>
                      <li>Consider appropriate treatment options based on recommendations</li>
                      <li>Monitor surrounding plants for symptoms</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {!isAnalyzing && !error && predictions.length === 0 && (
            <div className="empty-state">
              <p>No predictions available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Results

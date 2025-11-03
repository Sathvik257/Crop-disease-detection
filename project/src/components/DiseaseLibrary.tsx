import { useState, useEffect } from 'react'
import './DiseaseLibrary.css'
import { getAllDiseases, DiseaseInfo } from '../services/api'

interface DiseaseLibraryProps {
  onClose: () => void
}

function DiseaseLibrary({ onClose }: DiseaseLibraryProps) {
  const [diseases, setDiseases] = useState<DiseaseInfo[]>([])
  const [filteredDiseases, setFilteredDiseases] = useState<DiseaseInfo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCrop, setSelectedCrop] = useState<string>('All')
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDiseases()
  }, [])

  useEffect(() => {
    filterDiseases()
  }, [diseases, selectedCrop, searchQuery])

  const loadDiseases = async () => {
    setLoading(true)
    const data = await getAllDiseases()
    setDiseases(data)
    setFilteredDiseases(data)
    setLoading(false)
  }

  const filterDiseases = () => {
    let filtered = diseases

    if (selectedCrop !== 'All') {
      filtered = filtered.filter(d => d.crop_type === selectedCrop)
    }

    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredDiseases(filtered)
  }

  const cropTypes = ['All', ...Array.from(new Set(diseases.map(d => d.crop_type)))]

  return (
    <div className="disease-library">
      <div className="library-header">
        <div>
          <h2 className="library-title">Disease Library</h2>
          <p className="library-subtitle">Browse comprehensive information about crop diseases</p>
        </div>
        <button className="close-library-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="library-controls">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search diseases or symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {cropTypes.map(crop => (
            <button
              key={crop}
              className={`filter-tab ${selectedCrop === crop ? 'active' : ''}`}
              onClick={() => setSelectedCrop(crop)}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="library-loading">
          <div className="spinner"></div>
          <p>Loading disease database...</p>
        </div>
      ) : (
        <div className="library-content">
          <div className="diseases-grid">
            {filteredDiseases.map(disease => (
              <div
                key={disease.id}
                className="disease-card"
                onClick={() => setSelectedDisease(disease)}
              >
                <div className="card-header">
                  <h3>{disease.name}</h3>
                  <span className={`severity-tag severity-${disease.severity.toLowerCase().replace(' ', '-')}`}>
                    {disease.severity}
                  </span>
                </div>
                <div className="card-crop-type">
                  <span className="crop-icon">🌾</span>
                  <span>{disease.crop_type}</span>
                </div>
                <p className="card-symptoms">{disease.symptoms.substring(0, 120)}...</p>
                <button className="view-details-btn">View Details →</button>
              </div>
            ))}
          </div>

          {filteredDiseases.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>No diseases found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {selectedDisease && (
        <div className="disease-modal-overlay" onClick={() => setSelectedDisease(null)}>
          <div className="disease-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDisease.name}</h2>
              <button className="modal-close" onClick={() => setSelectedDisease(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-meta">
                <div className="meta-item">
                  <span className="meta-label">Crop Type</span>
                  <span className="meta-value">{selectedDisease.crop_type}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Severity</span>
                  <span className={`severity-tag severity-${selectedDisease.severity.toLowerCase().replace(' ', '-')}`}>
                    {selectedDisease.severity}
                  </span>
                </div>
              </div>

              <div className="modal-section">
                <h3>🔍 Symptoms</h3>
                <p>{selectedDisease.symptoms}</p>
              </div>

              <div className="modal-section">
                <h3>⚠️ Causes</h3>
                <p>{selectedDisease.causes}</p>
              </div>

              <div className="modal-section">
                <h3>🛡️ Prevention</h3>
                <p>{selectedDisease.prevention}</p>
              </div>

              <div className="modal-section">
                <h3>💊 Treatment</h3>
                <p>{selectedDisease.treatment}</p>
              </div>

              {selectedDisease.affected_parts.length > 0 && (
                <div className="modal-section">
                  <h3>🌿 Affected Plant Parts</h3>
                  <div className="parts-grid">
                    {selectedDisease.affected_parts.map((part, idx) => (
                      <span key={idx} className="part-badge">{part}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDisease.optimal_conditions && (
                <div className="modal-section">
                  <h3>🌡️ Favorable Conditions</h3>
                  <p>{selectedDisease.optimal_conditions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiseaseLibrary

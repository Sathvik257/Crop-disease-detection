import './InfoSection.css'

interface InfoSectionProps {
  onClose: () => void
}

const diseaseInfo = [
  {
    category: 'Apple',
    icon: '🍎',
    diseases: [
      { name: 'Apple Scab', symptoms: 'Dark, scaly lesions on leaves and fruit', prevention: 'Remove fallen leaves, use resistant varieties' },
      { name: 'Black Rot', symptoms: 'Brown circular lesions with purple border', prevention: 'Prune infected branches, improve air circulation' },
      { name: 'Cedar Apple Rust', symptoms: 'Yellow-orange spots on leaves', prevention: 'Remove nearby cedar trees, apply fungicides' }
    ]
  },
  {
    category: 'Tomato',
    icon: '🍅',
    diseases: [
      { name: 'Early Blight', symptoms: 'Dark concentric rings on older leaves', prevention: 'Rotate crops, mulch around plants' },
      { name: 'Late Blight', symptoms: 'Water-soaked spots on leaves and fruit', prevention: 'Avoid overhead watering, provide good spacing' },
      { name: 'Leaf Mold', symptoms: 'Yellow spots on upper leaf surface', prevention: 'Improve ventilation, reduce humidity' }
    ]
  },
  {
    category: 'Corn',
    icon: '🌽',
    diseases: [
      { name: 'Common Rust', symptoms: 'Orange-brown pustules on leaves', prevention: 'Plant resistant hybrids, early planting' },
      { name: 'Northern Leaf Blight', symptoms: 'Long grayish-green lesions', prevention: 'Crop rotation, tillage practices' },
      { name: 'Cercospora Leaf Spot', symptoms: 'Small rectangular spots on leaves', prevention: 'Proper plant spacing, balanced fertilization' }
    ]
  },
  {
    category: 'Grape',
    icon: '🍇',
    diseases: [
      { name: 'Black Rot', symptoms: 'Brown circular lesions on fruit and leaves', prevention: 'Prune and destroy infected parts, fungicide application' },
      { name: 'Leaf Blight', symptoms: 'Angular brown spots on leaves', prevention: 'Good air circulation, remove fallen leaves' },
      { name: 'Esca (Black Measles)', symptoms: 'Tiger stripe pattern on leaves', prevention: 'Prune in dry weather, protect pruning wounds' }
    ]
  }
]

function InfoSection({ onClose }: InfoSectionProps) {
  return (
    <div className="info-section">
      <div className="info-header">
        <h2 className="info-title">Crop Disease Information</h2>
        <button className="close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <p className="info-description">
        Learn about common crop diseases, their symptoms, and prevention methods.
        Our AI model can detect these and many more diseases across various crops.
      </p>

      <div className="disease-categories">
        {diseaseInfo.map((category, idx) => (
          <div key={idx} className="category-card">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h3 className="category-name">{category.category}</h3>
            </div>
            <div className="diseases-list">
              {category.diseases.map((disease, dIdx) => (
                <div key={dIdx} className="disease-item">
                  <h4 className="disease-name">{disease.name}</h4>
                  <div className="disease-detail">
                    <span className="detail-label">Symptoms:</span>
                    <span className="detail-text">{disease.symptoms}</span>
                  </div>
                  <div className="disease-detail">
                    <span className="detail-label">Prevention:</span>
                    <span className="detail-text">{disease.prevention}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="info-footer">
        <div className="footer-card">
          <h4>How It Works</h4>
          <ol>
            <li>Upload a clear image of the affected crop leaf</li>
            <li>Our AI model analyzes the image using deep learning</li>
            <li>Receive top 3 predictions with confidence scores</li>
            <li>Review recommendations and take appropriate action</li>
          </ol>
        </div>
        <div className="footer-card">
          <h4>Best Practices</h4>
          <ul>
            <li>Use high-quality, well-lit images</li>
            <li>Focus on the affected leaf area</li>
            <li>Avoid blurry or dark images</li>
            <li>Capture both upper and lower leaf surfaces if possible</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InfoSection

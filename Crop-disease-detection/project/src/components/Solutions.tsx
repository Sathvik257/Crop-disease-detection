import { useState, useEffect } from 'react'
import './Solutions.css'
import { getSolutions, SolutionData } from '../services/api'

interface Solution {
  category: string
  title: string
  description: string
  icon: string
  items: string[]
  priority: 'high' | 'medium' | 'low'
}

interface SolutionsProps {
  disease: string
  severity: 'critical' | 'high' | 'moderate' | 'low'
}

const categoryIcons: Record<string, string> = {
  'immediate': '🚨',
  'treatment': '💊',
  'fertilizer': '🌿',
  'soil': '🪴',
  'watering': '💧',
  'prevention': '🛡️',
  'organic': '🌱',
  'chemical': '⚗️'
}

export default function Solutions({ disease, severity }: SolutionsProps) {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSolutions()
  }, [disease])

  const loadSolutions = async () => {
    setLoading(true)
    try {
      const data = await getSolutions(disease)

      if (data && data.length > 0) {
        const formattedSolutions: Solution[] = data.map((item: SolutionData) => ({
          category: item.category,
          title: item.title,
          description: item.description,
          icon: categoryIcons[item.category] || '📋',
          items: item.items,
          priority: item.priority
        }))

        setSolutions(formattedSolutions)
        setActiveTab(formattedSolutions[0].category)
      } else {
        loadDefaultSolutions()
      }
    } catch (error) {
      console.error('Error loading solutions:', error)
      loadDefaultSolutions()
    } finally {
      setLoading(false)
    }
  }

  const loadDefaultSolutions = () => {
    const defaultSolutions: Solution[] = [
      {
        category: 'immediate',
        title: 'Immediate Actions',
        description: 'Critical steps to take right now',
        icon: '🚨',
        priority: 'high',
        items: [
          'Isolate affected plants immediately to prevent spread',
          'Remove and destroy severely infected leaves',
          'Stop overhead watering to reduce moisture',
          'Improve air circulation around plants',
          'Apply appropriate fungicide or treatment spray'
        ]
      },
      {
        category: 'treatment',
        title: 'Treatment Solutions',
        description: 'Proven methods to cure the disease',
        icon: '💊',
        priority: 'high',
        items: [
          'Organic neem oil spray (2-3 applications weekly)',
          'Copper-based fungicide for fungal infections',
          'Biological control agents (Trichoderma, Bacillus)',
          'Sulfur-based fungicides for powdery mildew',
          'Remove infected plant parts and sanitize tools'
        ]
      },
      {
        category: 'fertilizer',
        title: 'Fertilizer Recommendations',
        description: 'Nutrients to strengthen plant immunity',
        icon: '🌿',
        priority: 'medium',
        items: [
          'NPK 19-19-19 balanced fertilizer for general health',
          'Potassium-rich fertilizer (0-0-60) to boost immunity',
          'Calcium nitrate for cell wall strengthening',
          'Micronutrient mix (Zinc, Iron, Manganese)',
          'Organic compost tea for beneficial microbes'
        ]
      },
      {
        category: 'soil',
        title: 'Soil Management',
        description: 'Improve soil health and drainage',
        icon: '🪴',
        priority: 'medium',
        items: [
          'Test soil pH (ideal 6.0-7.0) and adjust if needed',
          'Add organic matter (compost, well-rotted manure)',
          'Improve drainage with perlite or sand',
          'Apply beneficial microbes (mycorrhizae)',
          'Rotate crops to break disease cycles'
        ]
      },
      {
        category: 'watering',
        title: 'Water Management',
        description: 'Proper irrigation practices',
        icon: '💧',
        priority: 'medium',
        items: [
          'Water early morning to allow foliage to dry',
          'Use drip irrigation instead of overhead sprinklers',
          'Avoid waterlogging - ensure proper drainage',
          'Reduce watering frequency in humid conditions',
          'Mulch around plants to maintain moisture'
        ]
      },
      {
        category: 'prevention',
        title: 'Long-term Prevention',
        description: 'Steps to prevent future outbreaks',
        icon: '🛡️',
        priority: 'low',
        items: [
          'Plant disease-resistant crop varieties',
          'Maintain proper plant spacing for air flow',
          'Practice crop rotation (3-4 year cycle)',
          'Remove plant debris and weeds regularly',
          'Monitor plants weekly for early detection'
        ]
      },
      {
        category: 'organic',
        title: 'Organic Solutions',
        description: 'Natural and eco-friendly treatments',
        icon: '🌱',
        priority: 'medium',
        items: [
          'Baking soda spray (1 tbsp per gallon water)',
          'Garlic and chili pepper spray as natural pesticide',
          'Milk solution (1:9 ratio) for powdery mildew',
          'Cinnamon powder as natural fungicide',
          'Companion planting with marigolds or basil'
        ]
      },
      {
        category: 'chemical',
        title: 'Chemical Treatments',
        description: 'Effective chemical solutions when needed',
        icon: '⚗️',
        priority: 'high',
        items: [
          'Mancozeb fungicide for leaf spots and blight',
          'Chlorothalonil for broad-spectrum fungal control',
          'Propiconazole for systemic fungal infections',
          'Streptomycin for bacterial diseases',
          'Always follow label instructions and safety precautions'
        ]
      }
    ]

    setSolutions(defaultSolutions)
    setActiveTab('immediate')
  }

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical': return '#ef4444'
      case 'high': return '#f97316'
      case 'moderate': return '#eab308'
      case 'low': return '#22c55e'
      default: return '#64748b'
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    }
    return (
      <span
        className="priority-badge"
        style={{ backgroundColor: colors[priority as keyof typeof colors] }}
      >
        {priority} priority
      </span>
    )
  }

  if (loading) {
    return (
      <div className="solutions-container">
        <div className="solutions-loading">
          <div className="spinner"></div>
          <p>Loading treatment solutions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="solutions-container">
      <div className="solutions-header">
        <div className="severity-indicator" style={{ borderColor: getSeverityColor() }}>
          <span className="severity-icon">⚠️</span>
          <div>
            <h3>Action Plan Required</h3>
            <p className="severity-text" style={{ color: getSeverityColor() }}>
              {severity.toUpperCase()} severity detected
            </p>
          </div>
        </div>
        <p className="disease-name">Treatment plan for: <strong>{disease}</strong></p>
      </div>

      <div className="solutions-tabs">
        {solutions.map(solution => (
          <button
            key={solution.category}
            className={`solution-tab ${activeTab === solution.category ? 'active' : ''}`}
            onClick={() => setActiveTab(solution.category)}
          >
            <span className="tab-icon">{solution.icon}</span>
            <span className="tab-label">{solution.title}</span>
          </button>
        ))}
      </div>

      <div className="solutions-content">
        {solutions
          .filter(solution => solution.category === activeTab)
          .map(solution => (
            <div key={solution.category} className="solution-card">
              <div className="solution-header">
                <div className="solution-title-row">
                  <span className="solution-icon">{solution.icon}</span>
                  <h3>{solution.title}</h3>
                  {getPriorityBadge(solution.priority)}
                </div>
                <p className="solution-description">{solution.description}</p>
              </div>

              <div className="solution-items">
                {solution.items.map((item, index) => (
                  <div key={index} className="solution-item">
                    <span className="item-number">{index + 1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              {solution.category === 'immediate' && (
                <div className="urgency-notice">
                  <span className="urgency-icon">⏰</span>
                  <p>These actions should be taken within 24-48 hours for best results</p>
                </div>
              )}

              {solution.category === 'chemical' && (
                <div className="warning-notice">
                  <span className="warning-icon">⚠️</span>
                  <p>Always wear protective equipment and follow safety guidelines when using chemicals</p>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="solutions-footer">
        <div className="footer-tip">
          <span className="tip-icon">💡</span>
          <p><strong>Pro Tip:</strong> Combining organic and chemical methods often yields the best results. Start with organic solutions and use chemicals only when necessary.</p>
        </div>
      </div>
    </div>
  )
}

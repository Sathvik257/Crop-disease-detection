import { useState, useEffect } from 'react'
import './App.css'
import ImageUpload from './components/ImageUpload'
import Results from './components/Results'
import Statistics from './components/Statistics'
import InfoSection from './components/InfoSection'
import DiseaseLibrary from './components/DiseaseLibrary'
import { analyzeCropDisease, saveAnalysis, getAnalysisHistory } from './services/api'

export interface Prediction {
  disease: string
  confidence: number
}

export interface AnalysisHistory {
  id: string
  disease_detected: string
  confidence: number
  analyzed_at: string
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<AnalysisHistory[]>([])
  const [totalAnalyses, setTotalAnalyses] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getAnalysisHistory()
      setHistory(data)
      setTotalAnalyses(data.length)
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  const handleImageSelect = async (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)
    setPredictions([])
    setError(null)
    setIsAnalyzing(true)

    try {
      const results = await analyzeCropDisease(file)
      setPredictions(results)

      if (results.length > 0) {
        await saveAnalysis({
          disease_detected: results[0].disease,
          confidence: results[0].confidence
        })
        await loadHistory()
      }
    } catch (err) {
      setError('Failed to analyze image. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPredictions([])
    setError(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="app">
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="gradient-orb orb-5"></div>
      </div>

      <div className="container">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="nav-icon">🌱</span>
            <span className="nav-title">CropAI</span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => {
              setShowInfo(false)
              setShowLibrary(false)
            }}>
              Analyze
            </button>
            <button className="nav-link" onClick={() => {
              setShowInfo(!showInfo)
              setShowLibrary(false)
            }}>
              Learn More
            </button>
            <button className="nav-link" onClick={() => {
              setShowLibrary(!showLibrary)
              setShowInfo(false)
            }}>
              Disease Library
            </button>
          </div>
        </nav>

        <header className="header">
          <div className="badge">
            <span className="badge-icon">🌱</span>
            <span>AI-Powered Detection</span>
          </div>
          <h1 className="title">
            Smart Crop Disease
            <span className="gradient-text"> Detection</span>
          </h1>
          <p className="subtitle">
            Upload a crop leaf image and let our AI identify potential diseases with confidence scores
          </p>
        </header>

        <main className="main-content">
          {showLibrary ? (
            <DiseaseLibrary onClose={() => setShowLibrary(false)} />
          ) : showInfo ? (
            <InfoSection onClose={() => setShowInfo(false)} />
          ) : !selectedImage ? (
            <>
              <ImageUpload onImageSelect={handleImageSelect} />
              <Statistics totalAnalyses={totalAnalyses} history={history} />
            </>
          ) : (
            <Results
              imageUrl={selectedImage}
              predictions={predictions}
              isAnalyzing={isAnalyzing}
              error={error}
              onReset={handleReset}
            />
          )}
        </main>

        <footer className="footer">
          <p>Proof of concept for educational purposes. For production use, please validate results with agricultural experts.</p>
        </footer>
      </div>
    </div>
  )
}

export default App

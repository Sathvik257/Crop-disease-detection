import { useState, useRef } from 'react'
import './ImageUpload.css'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
}

function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onImageSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-section">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <div className="upload-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <h3 className="upload-title">
          {isDragging ? 'Drop your image here' : 'Upload Crop Leaf Image'}
        </h3>
        <p className="upload-description">
          Drag and drop or click to browse
        </p>
        <p className="upload-formats">
          Supports: JPG, PNG, JPEG
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔬</div>
          <h4>AI Analysis</h4>
          <p>Advanced deep learning model for accurate disease detection</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h4>Fast Results</h4>
          <p>Get instant predictions with confidence scores</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h4>38+ Diseases</h4>
          <p>Detects diseases across multiple crop types</p>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload

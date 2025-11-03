import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import './MultiImageUpload.css';

interface MultiImageUploadProps {
  onImagesSelect: (files: File[]) => void;
  maxImages?: number;
}

export default function MultiImageUpload({ onImagesSelect, maxImages = 5 }: MultiImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files).slice(0, maxImages - selectedFiles.length);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, [selectedFiles, maxImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (selectedFiles.length > 0) {
      onImagesSelect(selectedFiles);
    }
  };

  return (
    <div className="multi-upload-container">
      <div className="upload-header">
        <ImageIcon size={32} />
        <h3>Upload Multiple Images</h3>
        <p>Analyze up to {maxImages} crop images at once</p>
      </div>

      <div
        className={`multi-drop-zone ${isDragging ? 'dragging' : ''} ${selectedFiles.length >= maxImages ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
      >
        <Upload size={48} />
        <p className="drop-text">
          {selectedFiles.length >= maxImages
            ? `Maximum ${maxImages} images selected`
            : 'Drag and drop images here'}
        </p>
        <p className="or-text">or</p>
        <label className="file-select-button">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={selectedFiles.length >= maxImages}
            style={{ display: 'none' }}
          />
          Browse Files
        </label>
        <p className="hint-text">
          {selectedFiles.length} / {maxImages} images selected
        </p>
      </div>

      {previews.length > 0 && (
        <div className="previews-grid">
          {previews.map((preview, index) => (
            <div key={index} className="preview-item">
              <img src={preview} alt={`Preview ${index + 1}`} />
              <button
                className="remove-preview"
                onClick={() => removeImage(index)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <button className="analyze-button" onClick={handleAnalyze}>
          Analyze {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
        </button>
      )}
    </div>
  );
}

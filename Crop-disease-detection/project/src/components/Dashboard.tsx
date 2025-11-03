import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnalysisHistory from './AnalysisHistory';
import TreatmentTracker from './TreatmentTracker';
import MultiImageUpload from './MultiImageUpload';
import { History, Package, ImagePlus, User as UserIcon } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'history' | 'treatments' | 'multi-upload'>('history');

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-login-prompt">
          <UserIcon size={48} />
          <h2>Sign In Required</h2>
          <p>Please sign in to access your dashboard</p>
        </div>
      </div>
    );
  }

  const handleMultiImageUpload = async (files: File[]) => {
    console.log('Analyzing', files.length, 'images');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Track your analyses, treatments, and progress</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={20} />
          Analysis History
        </button>
        <button
          className={`tab-button ${activeTab === 'treatments' ? 'active' : ''}`}
          onClick={() => setActiveTab('treatments')}
        >
          <Package size={20} />
          Treatments
        </button>
        <button
          className={`tab-button ${activeTab === 'multi-upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('multi-upload')}
        >
          <ImagePlus size={20} />
          Batch Upload
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'history' && <AnalysisHistory />}
        {activeTab === 'treatments' && <TreatmentTracker />}
        {activeTab === 'multi-upload' && <MultiImageUpload onImagesSelect={handleMultiImageUpload} />}
      </div>
    </div>
  );
}

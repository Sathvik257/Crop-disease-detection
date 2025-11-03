import { useEffect, useState } from 'react';
import { supabase } from '../services/api';
import { Calendar, TrendingUp, MapPin, FileText } from 'lucide-react';
import './AnalysisHistory.css';

interface UserAnalysis {
  id: string;
  disease_detected: string;
  confidence: number;
  location: string;
  field_size: number;
  notes: string;
  analyzed_at: string;
}

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<UserAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_analyses')
        .select('*')
        .order('analyzed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (err) {
      console.error('Failed to load analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="history-loading">Loading your analysis history...</div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="history-container">
        <div className="history-empty">
          <FileText size={48} />
          <h3>No Analysis History Yet</h3>
          <p>Upload a crop image to get started with disease detection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <FileText size={24} />
        <h2>Your Analysis History</h2>
      </div>

      <div className="history-list">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="history-item">
            <div className="history-item-header">
              <div className="history-disease">
                <span className="disease-name">{analysis.disease_detected}</span>
                <span className="confidence-badge">
                  <TrendingUp size={14} />
                  {analysis.confidence.toFixed(1)}%
                </span>
              </div>
              <div className="history-date">
                <Calendar size={14} />
                {formatDate(analysis.analyzed_at)}
              </div>
            </div>

            {(analysis.location || analysis.field_size > 0) && (
              <div className="history-details">
                {analysis.location && (
                  <span className="detail-item">
                    <MapPin size={14} />
                    {analysis.location}
                  </span>
                )}
                {analysis.field_size > 0 && (
                  <span className="detail-item">
                    {analysis.field_size} acres
                  </span>
                )}
              </div>
            )}

            {analysis.notes && (
              <div className="history-notes">
                <FileText size={14} />
                {analysis.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

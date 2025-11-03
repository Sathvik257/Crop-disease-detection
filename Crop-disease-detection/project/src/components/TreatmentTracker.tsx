import { useState, useEffect } from 'react';
import { supabase } from '../services/api';
import { Calendar, DollarSign, Star, Plus, Package } from 'lucide-react';
import './TreatmentTracker.css';

interface Treatment {
  id: string;
  treatment_type: string;
  products_used: string[];
  application_date: string;
  cost: number;
  field_size_treated: number;
  effectiveness_rating: number | null;
  notes: string;
  created_at: string;
}

interface TreatmentTrackerProps {
  analysisId?: string;
}

export default function TreatmentTracker({ analysisId }: TreatmentTrackerProps) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    treatment_type: 'chemical',
    products_used: '',
    application_date: new Date().toISOString().split('T')[0],
    cost: 0,
    field_size_treated: 0,
    effectiveness_rating: 0,
    notes: '',
  });

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      let query = supabase
        .from('treatment_logs')
        .select('*')
        .order('application_date', { ascending: false });

      if (analysisId) {
        query = query.eq('analysis_id', analysisId);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;
      setTreatments(data || []);
    } catch (err) {
      console.error('Failed to load treatments:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const productsArray = formData.products_used
        .split(',')
        .map(p => p.trim())
        .filter(p => p);

      const { error } = await supabase.from('treatment_logs').insert({
        user_id: user.id,
        analysis_id: analysisId || null,
        treatment_type: formData.treatment_type,
        products_used: productsArray,
        application_date: formData.application_date,
        cost: formData.cost,
        field_size_treated: formData.field_size_treated,
        effectiveness_rating: formData.effectiveness_rating || null,
        notes: formData.notes,
      });

      if (error) throw error;

      setShowForm(false);
      setFormData({
        treatment_type: 'chemical',
        products_used: '',
        application_date: new Date().toISOString().split('T')[0],
        cost: 0,
        field_size_treated: 0,
        effectiveness_rating: 0,
        notes: '',
      });
      loadTreatments();
    } catch (err) {
      console.error('Failed to save treatment:', err);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="no-rating">Not rated</span>;
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#10b981' : 'none'}
            color={star <= rating ? '#10b981' : 'rgba(255,255,255,0.3)'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="treatment-tracker-container">
      <div className="tracker-header">
        <div>
          <h2>Treatment Tracker</h2>
          <p>Monitor and log your treatment applications</p>
        </div>
        <button className="add-treatment-btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Add Treatment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="treatment-form">
          <div className="form-row">
            <div className="form-field">
              <label>Treatment Type</label>
              <select
                value={formData.treatment_type}
                onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
              >
                <option value="chemical">Chemical</option>
                <option value="organic">Organic</option>
                <option value="cultural">Cultural</option>
                <option value="biological">Biological</option>
              </select>
            </div>

            <div className="form-field">
              <label>Application Date</label>
              <input
                type="date"
                value={formData.application_date}
                onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Products Used (comma-separated)</label>
            <input
              type="text"
              value={formData.products_used}
              onChange={(e) => setFormData({ ...formData, products_used: e.target.value })}
              placeholder="Product 1, Product 2, Product 3"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Cost ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-field">
              <label>Field Size (acres)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.field_size_treated}
                onChange={(e) => setFormData({ ...formData, field_size_treated: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-field">
              <label>Effectiveness (1-5)</label>
              <select
                value={formData.effectiveness_rating}
                onChange={(e) => setFormData({ ...formData, effectiveness_rating: parseInt(e.target.value) })}
              >
                <option value="0">Not rated</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional observations and notes..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save Treatment
            </button>
          </div>
        </form>
      )}

      <div className="treatments-list">
        {treatments.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>No treatments logged yet</p>
          </div>
        ) : (
          treatments.map((treatment) => (
            <div key={treatment.id} className="treatment-card">
              <div className="treatment-header">
                <span className={`treatment-type-badge ${treatment.treatment_type}`}>
                  {treatment.treatment_type}
                </span>
                <div className="treatment-date">
                  <Calendar size={14} />
                  {new Date(treatment.application_date).toLocaleDateString()}
                </div>
              </div>

              {treatment.products_used && treatment.products_used.length > 0 && (
                <div className="products-list">
                  <Package size={14} />
                  {treatment.products_used.join(', ')}
                </div>
              )}

              <div className="treatment-stats">
                {treatment.cost > 0 && (
                  <div className="stat-item">
                    <DollarSign size={14} />
                    ${treatment.cost.toFixed(2)}
                  </div>
                )}
                {treatment.field_size_treated > 0 && (
                  <div className="stat-item">
                    {treatment.field_size_treated} acres
                  </div>
                )}
                <div className="stat-item">
                  {renderStars(treatment.effectiveness_rating)}
                </div>
              </div>

              {treatment.notes && (
                <div className="treatment-notes">{treatment.notes}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

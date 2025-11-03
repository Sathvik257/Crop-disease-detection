import { createClient } from '@supabase/supabase-js'
import { Prediction, AnalysisHistory } from '../App'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function analyzeCropDisease(imageFile: File): Promise<Prediction[]> {
  const apiUrl = `${SUPABASE_URL}/functions/v1/analyze-crop`

  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to analyze image')
  }

  const data = await response.json()
  return data.predictions
}

export async function saveAnalysis(analysis: { disease_detected: string; confidence: number }) {
  const { data, error } = await supabase
    .from('analysis_history')
    .insert([analysis])
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error saving analysis:', error)
    throw error
  }

  return data
}

export async function getAnalysisHistory(): Promise<AnalysisHistory[]> {
  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .order('analyzed_at', { ascending: false })

  if (error) {
    console.error('Error fetching history:', error)
    throw error
  }

  return data || []
}

export interface DiseaseInfo {
  id: string
  name: string
  crop_type: string
  symptoms: string
  causes: string
  prevention: string
  treatment: string
  severity: string
  affected_parts: string[]
  optimal_conditions: string
}

export async function getDiseaseInfo(diseaseName: string): Promise<DiseaseInfo | null> {
  const { data, error } = await supabase
    .from('disease_info')
    .select('*')
    .eq('name', diseaseName)
    .maybeSingle()

  if (error) {
    console.error('Error fetching disease info:', error)
    return null
  }

  return data
}

export async function getAllDiseases(): Promise<DiseaseInfo[]> {
  const { data, error } = await supabase
    .from('disease_info')
    .select('*')
    .order('crop_type', { ascending: true })

  if (error) {
    console.error('Error fetching diseases:', error)
    return []
  }

  return data || []
}

export async function searchDiseases(query: string): Promise<DiseaseInfo[]> {
  const { data, error } = await supabase
    .from('disease_info')
    .select('*')
    .or(`name.ilike.%${query}%,crop_type.ilike.%${query}%,symptoms.ilike.%${query}%`)
    .order('crop_type', { ascending: true })

  if (error) {
    console.error('Error searching diseases:', error)
    return []
  }

  return data || []
}

export interface SolutionData {
  id: string
  disease_name: string
  category: string
  title: string
  description: string
  items: string[]
  priority: 'high' | 'medium' | 'low'
}

export async function getSolutions(diseaseName: string): Promise<SolutionData[]> {
  const { data, error } = await supabase
    .from('solutions')
    .select('*')
    .eq('disease_name', diseaseName)

  if (error) {
    console.error('Error fetching solutions:', error)
    return []
  }

  if (!data) return []

  const priorityOrder = { high: 1, medium: 2, low: 3 }
  return data.sort((a, b) => {
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 4
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 4
    return aPriority - bPriority
  })
}

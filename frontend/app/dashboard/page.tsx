'use client'

import { useEffect, useState } from 'react'

type Patient = {
  id: string
  health_id: string
  national_id: string
  demographics?: any
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    // Load patients list (placeholder — in a real app, fetch user's assigned patients)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm font-medium text-slate-500">Total Patients</h2>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm font-medium text-slate-500">Recent Visits</h2>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm font-medium text-slate-500">Lab Results</h2>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm font-medium text-slate-500">Prescriptions</h2>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/patient-search" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Search Patient
            </a>
            <a href="/records/add" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add Record
            </a>
            <a href="/labs/upload" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Upload Lab
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

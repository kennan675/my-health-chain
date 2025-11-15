'use client'

import { useState } from 'react'
import axios from 'axios'

export default function PatientSearchPage() {
  const [nationalId, setNationalId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:4000/api/patients/lookup/${nationalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">Search Patient</h1>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">National ID</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter national ID"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">{error}</div>}

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-slate-900">Patient Found</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Health ID:</label>
                <p className="text-slate-900">{result.health_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">National ID:</label>
                <p className="text-slate-900">{result.national_id}</p>
              </div>
              {result.demographics && (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Name:</label>
                    <p className="text-slate-900">
                      {result.demographics.first_name} {result.demographics.last_name}
                    </p>
                  </div>
                </>
              )}
            </div>
            <a
              href={`/patient/${result.id}`}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Full Record
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

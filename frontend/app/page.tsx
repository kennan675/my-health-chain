export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">My Health Chain</h1>
        <p className="text-xl text-slate-600 mb-8">National digital health record system for Kenya</p>
        <a href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Login
        </a>
      </div>
    </div>
  )
}

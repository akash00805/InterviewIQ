import { CheckCircle } from 'lucide-react'

export default function RegistrationSuccess({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful! 🎉</h2>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-slate-700 mb-3">
            <strong>Your account has been created successfully!</strong>
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            <p>✅ User saved to MongoDB</p>
            <p>✅ Verification email sent</p>
            <p>✅ Account ready for use</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-slate-900 mb-2">Next Step:</p>
          <p className="text-sm text-slate-700">
            Check your email for a verification link and click it to activate your account.
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Continue to Login
        </button>

        <p className="text-xs text-slate-500 mt-4">
          You will be automatically redirected in a few seconds...
        </p>
      </div>
    </div>
  )
}

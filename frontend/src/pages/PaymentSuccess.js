import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyPayment, getSessionStatus } from '../services/checkoutService'

export default function PaymentSuccess() {
  const [paymentStatus, setPaymentStatus] = useState('verifying')
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const sessionId = searchParams.get('session_id')
  const invoiceId = searchParams.get('invoice_id')

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        // verifying session status
        if (sessionId) {
          const session = await getSessionStatus(sessionId)
          if (session.payment_status === 'paid') {
            setPaymentStatus('success')
            return
          }
        }

        // Fallback to invoice verification
        if (invoiceId) {
          const result = await verifyPayment(invoiceId)
          if (result.paid) {
            setPaymentStatus('success')
          } else {
            setPaymentStatus('pending')
          }
        } else {
          setError('No payment identifier provided')
          setPaymentStatus('error')
        }
      } catch (err) {
        setError(err.message)
        setPaymentStatus('error')
      }
    }

    verifyPaymentStatus()
  }, [sessionId, invoiceId])

  if (paymentStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue mx-auto mb-4"></div>
          <p className="text-lg">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
            <p>{error || 'Something went wrong with your payment'}</p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="bg-vivid_blue text-white px-6 py-2 rounded-lg hover:bg-primary">
            Back to Cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/web-hosting')}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

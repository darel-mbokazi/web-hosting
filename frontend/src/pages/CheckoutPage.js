import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkout, createCheckoutSession } from '../services/checkoutService'

const getToken = () => localStorage.getItem('token')

export default function CheckoutPage() {
  const [checkoutData, setCheckoutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const token = getToken()
        if (!token) {
          setError('Please log in to checkout')
          setLoading(false)
          navigate('/login')
          return
        }

        const data = await checkout()
        console.log('Checkout response:', data)
        setCheckoutData(data)
      } catch (err) {
        console.error('Checkout failed:', err)
        setError(err.message || 'Failed to load checkout details.')
      } finally {
        setLoading(false)
      }
    }
    initializeCheckout()
  }, [navigate])

  const handleStripePayment = async () => {
    if (!checkoutData?.invoice?._id) return
    setProcessing(true)
    setError('')

    try {
      // Create checkout session
      const { sessionId, url } = await createCheckoutSession(checkoutData.invoice._id)
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        throw new Error('No checkout URL received from Stripe')
      }
    } catch (err) {
      console.error('Payment failed:', err)
      setError(err.message || 'Payment failed. Try again.')
      setProcessing(false)
    }
  }

  // Handle empty cart redirect
  if (error && error.includes('cart is empty')) {
    return (
      <div className="max-w-2xl mx-auto p-6 my-10">
        <div className="bg-background border border-light_gray rounded-lg p-6 text-center">
          <div className="text-primary mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-6V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v3M9 11h6" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Empty Cart</h2>
            <p>{error}</p>
          </div>
          <p className="text-text mb-4">Redirecting to cart page...</p>
        </div>
      </div>
    )
  }

  if (loading)
    return (
      <div className="max-w-2xl mx-auto p-6 my-40">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue"></div>
          <span className="ml-4 text-lg">Loading checkout...</span>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="max-w-2xl mx-auto p-6 my-10">
        <div className="bg-background border border-light_gray rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Checkout Error</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 mr-4">
            Try Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-vivid_blue text-white px-6 py-2 rounded-lg hover:bg-primary">
            Back to Cart
          </button>
        </div>
      </div>
    )

  const { order, invoice } = checkoutData

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl text-vivid_blue pb-3 font-bold text-center mb-6">
        Checkout
      </h1>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {Array.isArray(order.items) && order.items.length > 0 ? (
          order.items.map((item) => (
            <div key={item.itemId} className="flex justify-between border-b py-3">
              <div>
                <span className="font-medium">{item.name}</span>
                <p className="text-sm text-gray-500 capitalize">
                  {item.itemType} • {item.billingCycle}
                </p>
              </div>
              <span className="font-semibold">
                R {item.price.toLocaleString('en-ZA')}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items in this order.</p>
        )}
        <div className="flex justify-between font-bold pt-4 mt-4 border-t">
          <span className="text-lg">Total</span>
          <span className="text-lg text-green-600">
            R {order.total.toLocaleString('en-ZA')}
          </span>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Invoice ID:</span> {invoice._id}</p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span className={invoice.status === 'paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {invoice.status.toUpperCase()}
            </span>
          </p>
          <p>
            <span className="font-medium">Due Date:</span>{' '}
            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Payment Button */}
      {invoice.status !== 'paid' ? (
        <div className="text-center">
          <button
            onClick={handleStripePayment}
            disabled={processing}
            className="w-full bg-vivid_blue text-white py-4 rounded-lg hover:bg-primary disabled:opacity-50 font-semibold text-lg">
            {processing ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
          </button>
          <p className="text-sm text-gray-600 mt-3">
            You will be redirected to Stripe to complete your payment securely.
          </p>
        </div>
      ) : (
        <div className="text-center bg-green-50 rounded-lg p-6">
          <p className="text-green-600 font-semibold mb-3 text-lg">✅ Payment Complete</p>
          <button
            onClick={() => navigate('/account')}
            className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800">
            Go to Account
          </button>
        </div>
      )}
    </div>
  )
}
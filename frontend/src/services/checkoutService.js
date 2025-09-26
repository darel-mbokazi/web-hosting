import { API_URL } from '../config'

const getToken = () => localStorage.getItem('token')

export const checkout = async () => {
  const res = await fetch(`${API_URL}/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: 'Checkout failed' }))
    throw new Error(errorData.error || 'Checkout failed')
  }
  return res.json()
}

export const createCheckoutSession = async (invoiceId) => {
  const res = await fetch(`${API_URL}/checkout/create-checkout-session`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ invoiceId }),
  })
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: 'Checkout session creation failed' }))
    throw new Error(errorData.error || 'Checkout session creation failed')
  }
  return res.json()
}

export const getSessionStatus = async (sessionId) => {
  const res = await fetch(`${API_URL}/checkout/session-status/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: 'Session status check failed' }))
    throw new Error(errorData.error || 'Session status check failed')
  }
  return res.json()
}

export const verifyPayment = async (invoiceId) => {
  const res = await fetch(`${API_URL}/checkout/verify-payment/${invoiceId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: 'Payment verification failed' }))
    throw new Error(errorData.error || 'Payment verification failed')
  }
  return res.json()
}

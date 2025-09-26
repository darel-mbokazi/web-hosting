import { API_URL } from '../config'

const getToken = () => localStorage.getItem('token')

const getCart = async () => {
  const res = await fetch(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error('Failed to fetch cart')
  return res.json()
}

const addHosting = async (hostingId) => {
  const res = await fetch(`${API_URL}/cart/hosting`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ hostingId }),
  })
  if (!res.ok) throw new Error('Failed to add hosting')
  return res.json()
}

const addWordPress = async (wordpressId) => {
  const res = await fetch(`${API_URL}/cart/wordpress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ wordpressId }),
  })
  if (!res.ok) throw new Error('Failed to add WordPress hosting')
  return res.json()
}

const addAddon = async (addonId) => {
  const res = await fetch(`${API_URL}/cart/addon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ addonId }),
  })
  if (!res.ok) throw new Error('Failed to add addon')
  return res.json()
}

const removeItem = async (itemId) => {
  const res = await fetch(`${API_URL}/cart/item/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error('Failed to remove item')
  return res.json()
}

const cartService = { getCart, addHosting, addWordPress, addAddon, removeItem }
export default cartService

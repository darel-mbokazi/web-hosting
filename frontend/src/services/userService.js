import { API_URL } from '../config'

const getToken = () => localStorage.getItem('token')

export const getUserOrders = async () => {
  const res = await fetch(`${API_URL}/user/orders`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

export const getOrderById = async (orderId) => {
  const res = await fetch(`${API_URL}/user/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error('Failed to fetch order')
  return res.json()
}

const userService = { getUserOrders, getOrderById }
export default userService

import React from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { MdDelete } from 'react-icons/md'

const CartPage = () => {
  const { state, removeItem } = useCart()
  const navigate = useNavigate()

  if (state.loading) {
    return (
      <p className="text-center text-2xl text-vivid_blue m-52 font-semibold">
        Loading cart...
      </p>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <h2 className="text-2xl font-bold text-vivid_blue mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven’t added anything yet.
        </p>
        <button
          onClick={() => navigate('/web-hosting')}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-vivid_blue transition">
          Browse Services
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl text-center font-extrabold text-vivid_blue mb-8">
          Your Cart
        </h1>

        <div className="space-y-6">
          {state.items.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between items-center bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {item.itemType} • {item.billingCycle}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-lg font-bold text-green-600">
                  R{item.price.toLocaleString('en-ZA')}
                </p>
                <button
                  onClick={() => removeItem(item.itemId)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Remove Item">
                  <MdDelete size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-bold text-gray-800">Total</h2>
            <p className="text-2xl font-extrabold text-green-600 mt-1">
              R{state.total.toLocaleString('en-ZA')}
            </p>
          </div>

          <button
            className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-lg hover:bg-vivid_blue transition font-semibold"
            onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import cartService from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext()

const initialState = { items: [], total: 0, loading: true }

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false,
      }
    case 'UPDATE_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      }
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user, token } = useAuth()
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart()
        dispatch({ type: 'SET_CART', payload: data })
      } catch (error) {
        console.error('Error fetching cart:', error)
        dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } })
      }
    }
    fetchCart()
  }, [])

    // Fetch cart when user logs in or token changes
  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          const data = await cartService.getCart()
          dispatch({ type: 'SET_CART', payload: data })
        } catch (error) {
          console.error('Error fetching cart:', error)
          dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } })
        }
      } else {
        // Clear cart if no user
        dispatch({ type: 'CLEAR_CART' })
      }
    }

    fetchCart()
  }, [user, token]) 

  const refreshCart = async () => {
    try {
      const data = await cartService.getCart()
      dispatch({ type: 'SET_CART', payload: data })
    } catch (error) {
      console.error('Error refreshing cart:', error)
    }
  }

  const addDomain = async (_domainData) => {
    try {
      await refreshCart()
    } catch (error) {
      console.error('Error adding domain:', error)
      throw error
    }
  }

  const addHosting = async (hostingId) => {
    const data = await cartService.addHosting(hostingId)
    dispatch({ type: 'UPDATE_CART', payload: data })
  }

  const addWordPress = async (wordpressId) => {
    const data = await cartService.addWordPress(wordpressId)
    dispatch({ type: 'UPDATE_CART', payload: data })
  }

  const addAddon = async (addonId) => {
    const data = await cartService.addAddon(addonId)
    dispatch({ type: 'UPDATE_CART', payload: data })
  }

  const removeItem = async (itemId) => {
    const data = await cartService.removeItem(itemId)
    dispatch({ type: 'UPDATE_CART', payload: data })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        refreshCart,
        addDomain,
        addHosting,
        addWordPress,
        addAddon,
        removeItem,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

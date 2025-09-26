import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import { VscAccount } from 'react-icons/vsc'
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
  IoIosHelpCircleOutline,
} from 'react-icons/io'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CiLogout, CiSettings } from 'react-icons/ci'
import { MdCancel, MdOutlineReceiptLong } from 'react-icons/md'
import { PiSignInFill } from 'react-icons/pi'
import { LiaCartArrowDownSolid } from 'react-icons/lia'
import { IoTicketOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { state, clearCart } = useCart()

  const [selectedService, setSelectedService] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showServices, setShowServices] = useState(false)

  const profileRef = useRef(null)
  const servicesRef = useRef(null)

  const handleLogout = () => {
    clearCart()
    logout()
    navigate('/login')
  }

  const services = [
    {
      service: 'Domain',
      options: ['Register Domain', 'Whois Domain', 'Transfer Domain'],
    },
    {
      service: 'Hosting',
      options: ['Web Hosting', 'WordPress Hosting', 'Addons'],
    },
    { service: 'Security', options: ['Malware Scanner'] },
    { service: 'Reseller', options: ['Domain Reseller', 'Hosting Reseller'] },
    { service: 'Help', options: ['Open Ticket', 'About Us'] },
  ]

  useEffect(() => setShowProfile(false), [location])

  const handleServices = (index) => {
    setSelectedService(selectedService === index ? null : index)
  }

  const toggleProfile = () => setShowProfile(!showProfile)

  useEffect(() => {
    if (showProfile) {
      const timeoutProfile = setTimeout(() => setShowProfile(false), 20000)

      return () => {
        clearTimeout(timeoutProfile)
      }
    }
  }, [showProfile])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfile &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false)
      }
    }

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfile])

  // close services on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showServices &&
        servicesRef.current &&
        !servicesRef.current.contains(event.target)
      ) {
        setShowServices(false)
        setSelectedService(null)
      }
    }

    if (showServices) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showServices])

  // close services when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setSelectedService(null)
        setShowServices(false)
      }
    }

    if (selectedService !== null || showServices) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedService, showServices])

  // close services on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (selectedService !== null || showServices) {
        setSelectedService(null)
        setShowServices(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [selectedService, showServices])

  // close services on navigation
  useEffect(() => {
    setSelectedService(null)
    setShowServices(false)
  }, [location])

  return (
    <nav className="fixed w-full bg-background z-50 top-0 shadow-md">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="w-[75px] cursor-pointer">
          <img
            src={logo}
            alt="logo"
            className="w-full h-auto"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Desktop Nav */}
        <div className="flex items-center gap-16 max-sm:gap-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>

          <Link
            to="/cart"
            className="relative hover:text-primary flex items-center gap-1">
            <LiaCartArrowDownSolid size={22} />
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {state.items.length}
              </span>
            )}
          </Link>

          <div
            className="cursor-pointer hover:text-primary"
            onClick={toggleProfile}>
            <VscAccount size={22} />
          </div>
        </div>

        {showProfile && (
          <div
            className="fixed top-0 right-0 h-full w-[30%] max-sm:w-2/3 bg-white border-l shadow-lg z-50 p-5 animate-slideIn"
            ref={profileRef}>
            <MdCancel
              className="cursor-pointer text-2xl mb-5 hover:text-vivid_blue self-end"
              onClick={() => setShowProfile(false)}
            />

            {loading ? (
              <div className="text-center">Loading...</div>
            ) : user ? (
              <div className="space-y-5">
                <div className="flex justify-between items-center bg-primary p-2 rounded-md">
                  <h2 className="font-semibold">{user.name}</h2>
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block text-blue-600 hover:underline">
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'support' && (
                  <Link
                    to="/support"
                    className="block text-blue-600 hover:underline">
                    Support Dashboard
                  </Link>
                )}

                <ul className="space-y-4 mt-5">
                  <li>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 hover:text-vivid_blue">
                      <VscAccount /> Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 hover:text-vivid_blue">
                      <MdOutlineReceiptLong />
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tickets"
                      className="flex items-center gap-2 hover:text-vivid_blue">
                      <IoTicketOutline /> My Tickets
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/security-settings"
                      className="flex items-center gap-2 hover:text-vivid_blue">
                      <CiSettings /> Security Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      className="flex items-center gap-2 hover:text-vivid_blue">
                      <IoIosHelpCircleOutline /> Get Help
                    </Link>
                  </li>
                  {user && (
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700">
                        <CiLogout /> Logout
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-10">
                <p className="text-text text-center mb-5">
                  Already have an account? Log in to manage your domains and
                  hosting services.
                </p>

                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-md hover:bg-vivid_blue transition">
                  <PiSignInFill className="text-lg" /> Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Bottom Nav */}
      <div
        className="hidden w-full md:block bg-primary px-4 py-2"
        ref={servicesRef}>
        <ul className="flex gap-10">
          {services.map((service, index) => (
            <li key={index} className="relative">
              <button
                onClick={() => handleServices(index)}
                className="bg-background rounded-full px-5 flex items-center gap-5">
                <span className="">{service.service}</span>
                {selectedService === index ? (
                  <IoIosArrowDropupCircle />
                ) : (
                  <IoIosArrowDropdownCircle />
                )}
              </button>

              {selectedService === index && (
                <ul className="absolute p-4 left-0 mt-2 w-52 border shadow-md rounded-md bg-background">
                  {service.options.map((subTopic, subIndex) => (
                    <li
                      key={subIndex}
                      className="px-2 py-1 mb-1 bg-primary hover:bg-background border border-light_gray rounded-md">
                      <Link
                        to={`/${subTopic.replace(/\s+/g, '-').toLowerCase()}`}>
                        <span className="">{subTopic}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Floating Services Button (Left) */}
      <div
        className="md:hidden fixed top-[14%] left-0 bg-primary text-background px-3 py-2 rounded-r-md cursor-pointer z-40 flex items-center gap-2"
        onClick={() => setShowServices(!showServices)}>
        Services
        {showServices ? (
          <IoIosArrowDropupCircle />
        ) : (
          <IoIosArrowDropdownCircle />
        )}
      </div>

      {/* Mobile Services Menu */}
      {showServices && (
        <div
          className="md:hidden fixed top-[20%] left-0 bg-white text-black p-3 rounded-r-md shadow-md w-full z-40"
          ref={servicesRef}>
          <ul className="flex flex-col gap-2">
            {services.map((service, index) => (
              <li key={index}>
                <button
                  onClick={() => handleServices(index)}
                  className="w-full text-left flex justify-between items-center py-2 border border-light_gray rounded-md px-3">
                  {service.service}
                  {selectedService === index ? (
                    <IoIosArrowDropupCircle />
                  ) : (
                    <IoIosArrowDropdownCircle />
                  )}
                </button>

                {selectedService === index && (
                  <ul className="pl-4 mt-1 space-y-1 text-vivid_blue">
                    {service.options.map((option, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={`/${option.replace(/\s+/g, '-').toLowerCase()}`}
                          className="block py-1 border bg-primary border-light_gray rounded-md px-3 hover:bg-primary hover:text-white">
                          {option}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar

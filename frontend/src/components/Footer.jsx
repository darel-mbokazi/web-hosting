import React, { useEffect, useState } from 'react'
import footerImg from '../assets/logo.png'
import {
  CiFacebook,
  CiYoutube,
  CiInstagram,
  CiTwitter,
  CiLinkedin,
} from 'react-icons/ci'
import { FaCcVisa, FaCcMastercard, FaStripe } from 'react-icons/fa'

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear())
    }
    updateYear()
  }, [])

  return (
    <footer className="bg-vivid_blue px-6 py-10 bottom-0">
      <div className="flex flex-col md:flex-col lg:flex-row justify-between gap-8 pb-10">
        <div className="w-fit">
          <img src={footerImg} alt="Web Hosting Logo" className="w-24 mb-4" />
          <p className="text-background">Global Sales and Support</p>
          <p className="text-primary font-medium">support@web-hosting.co.za</p>

          <div className="mt-4">
            <ul className="flex gap-3">
              <li className="text-primary text-2xl hover:text-background cursor-pointer">
                <CiFacebook />
              </li>
              <li className="text-primary text-2xl hover:text-background cursor-pointer">
                <CiInstagram />
              </li>
              <li className="text-primary text-2xl hover:text-background cursor-pointer">
                <CiTwitter />
              </li>
              <li className="text-primary text-2xl hover:text-background cursor-pointer">
                <CiLinkedin />
              </li>
              <li className="text-primary text-2xl hover:text-background cursor-pointer">
                <CiYoutube />
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg text-background font-semibold mb-6">
            Quick Links
          </h2>
          <p
            className="text-primary mb-3 hover:text-background cursor-pointer"
            onClick={() => (window.location.href = '/about-us')}>
            About
          </p>
          <p className="text-primary mb-3 hover:text-background cursor-pointer">
            Terms and Conditions
          </p>
          <p className="text-primary mb-3 hover:text-background cursor-pointer">
            Privacy Policy
          </p>
        </div>

        <div>
          <h2 className="text-lg text-background font-semibold mb-6">
            Services
          </h2>
          <p
            className="text-primary mb-3 hover:text-background cursor-pointer"
            onClick={() => (window.location.href = '/web-hosting')}>
            Web Hosting
          </p>
          <p
            className="text-primary mb-3 hover:text-background cursor-pointer"
            onClick={() => (window.location.href = '/addons')}>
            Addons Hosting
          </p>
          <p
            className="text-primary mb-3 hover:text-background cursor-pointer"
            onClick={() => (window.location.href = '/wordpress-hosting')}>
            Wordpress Hosting
          </p>
        </div>

        <div className="w-1/2 md:w-1/3 lg:w-1/4">
          <ul className="flex justify-between">
            <li className="text-5xl md:text-6xl lg:text-7xl text-background">
              <FaCcVisa />
            </li>
            <li className="text-5xl md:text-6xl lg:text-7xl text-background">
              <FaCcMastercard />
            </li>
            <li className="text-5xl md:text-6xl lg:text-7xl text-background">
              <FaStripe />
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-background text-sm md:text-base">
        <p className="mb-2">
          <span className="text-primary">&copy; {currentYear}</span>{' '}
          Web-Hosting. All rights reserved.
        </p>
        <p>
          Web-Hosting - Premium Web Hosting, Website Builder & Domain
          Registration Services.
        </p>
      </div>
    </footer>
  )
}

export default Footer

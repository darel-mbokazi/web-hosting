import React, { useState } from 'react'
import {
  CiFacebook,
  CiInstagram,
  CiTwitter,
  CiLinkedin,
  CiYoutube,
} from 'react-icons/ci'

const DomainReseller = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-background mt-10 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-vivid_blue mb-4">
          <span className="text-primary">Domain Reseller</span> Solution For
          Individuals and Businesses
        </h1>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Start Selling Domain Names
        </h3>
        <p className="text-text text-lg leading-relaxed mb-8">
          Expand your existing business services by offering domain registration
          to your clients. The Register Domain Reseller Service does not require
          you to make changes to your existing infrastructure. Simply sign-up
          and buy South African Domain Names from as little as
          <span className="font-bold text-vivid_blue"> R100 </span> per domain
          per year. Web designers, hosting providers, and many other businesses
          can make use of a reseller plan.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Domain Registration at discounted rates – Register, Transfer, Renew
          Domains like a Professional!
        </h2>

        <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 text-left">
          <h3 className="text-xl font-semibold text-vivid_blue mb-2">
            Apply to become a Domain Reseller
          </h3>
          <p className="text-gray-700 mb-4">
            To become a Domain Reseller, please contact our Sales Team. Your
            Application will be reviewed by our Provisioning Team. Once
            Approved, you will receive an invoice for
            <span className="font-semibold text-primary"> R199 </span> to set up
            the Reseller Account.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-vivid_blue transition duration-300">
            Contact Us
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              ✖
            </button>

            <h2 className="text-2xl font-bold text-vivid_blue mb-4 text-center">
              Contact Web-Hosting
            </h2>

            <p className="text-gray-700 text-center mb-2">
              📧 Email:{' '}
              <a href="mailto:help@web-hosting.co.za" className="text-primary">
                help@web-hosting.co.za
              </a>
            </p>
            <p className="text-gray-700 text-center mb-6">
              ☎ Phone:{' '}
              <a href="tel:+27123456789" className="text-primary">
                +27 12 345 6789
              </a>
            </p>

            {/* Social Icons */}
            <div className="mt-4 flex justify-center">
              <ul className="flex gap-4">
                <li className="text-primary text-2xl hover:text-vivid_blue cursor-pointer">
                  <CiFacebook />
                </li>
                <li className="text-primary text-2xl hover:text-vivid_blue cursor-pointer">
                  <CiInstagram />
                </li>
                <li className="text-primary text-2xl hover:text-vivid_blue cursor-pointer">
                  <CiTwitter />
                </li>
                <li className="text-primary text-2xl hover:text-vivid_blue cursor-pointer">
                  <CiLinkedin />
                </li>
                <li className="text-primary text-2xl hover:text-vivid_blue cursor-pointer">
                  <CiYoutube />
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DomainReseller

import React from 'react'
import { FaEnvelope, FaPhoneAlt, FaQuestionCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Help = () => {
  
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-vivid_blue mb-6 text-center">
          Help & Support
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Need assistance? Browse our FAQs below or reach out to our support
          team.
        </p>

        <div className="space-y-6 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <FaQuestionCircle /> How do I register a domain?
            </h3>
            <p className="text-gray-600 mt-2">
              You can search for your preferred domain in the search bar and add
              it to your cart if available.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <FaQuestionCircle /> How can I upgrade my hosting plan?
            </h3>
            <p className="text-gray-600 mt-2">
              Go to your hosting dashboard, select your current plan, and choose
              “Upgrade” to see available options.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <FaQuestionCircle /> What payment methods are supported?
            </h3>
            <p className="text-gray-600 mt-2">
              We support debit/credit cards, EFT, and PayPal for your
              convenience.
            </p>
          </div>
        </div>

        <button className="flex m-auto mb-10 bg-vivid_blue text-white px-6 py-3 rounded-full hover:bg-primary transition" onClick={() => navigate('/open-ticket')}>Open Ticket</button>

        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Contact our support team and we’ll get back to you shortly.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-vivid_blue text-xl" />
              <span>support@web-hosting.co.za</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-vivid_blue text-xl" />
              <span>+27 12 345 6789</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help

import React, { useState } from 'react'
import {
  FaSearch,
  FaGlobe,
  FaCalendarAlt,
  FaEnvelope,
  FaServer,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSync,
  FaShieldAlt
} from 'react-icons/fa'

const API_KEY = process.env.REACT_APP_WHOIS_API_KEY

const Whois = () => {
  const [domainName, setDomainName] = useState('')
  const [whoisData, setWhoisData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchWhoisData = () => {
    const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!domainPattern.test(domainName)) {
      setError('Please enter a valid domain name')
      setWhoisData(null)
      return
    }

    setLoading(true)
    setError(null)

    const myHeaders = new Headers()
    myHeaders.append('apikey', API_KEY)

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    }

    fetch(
      `https://api.apilayer.com/whois/query?domain=${domainName}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.result) {
          setWhoisData(result.result)
          setError(null)
        } else {
          setError('Domain information not found')
          setWhoisData(null)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        setError('Error fetching WHOIS data. Please try again.')
        setWhoisData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWhoisData()
    }
  }

  const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-center gap-3 py-2 ${className}`}>
      <Icon className="text-vivid_blue flex-shrink-0" />
      <span className="font-medium text-gray-700 min-w-[140px]">{label}:</span>
      <span className="text-gray-900 break-words">{value || 'N/A'}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-background mt-16 pb-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGlobe className="text-4xl text-vivid_blue" />
            <h1 className="text-3xl sm:text-4xl font-bold text-vivid_blue">
              WHOIS Domain Lookup
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Search for domain registration information and availability
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter domain name (e.g., google.com, facebook.com)"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vivid_blue"
              />
            </div>
            <button
              onClick={fetchWhoisData}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-vivid_blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors min-w-[120px]"
            >
              {loading ? <FaSync className="animate-spin" /> : <FaSearch />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="text-sm text-gray-500 flex items-center gap-2">
            <FaInfoCircle className="text-vivid_blue" />
            Examples: google.com, facebook.com, youtube.com
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <FaExclamationTriangle />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {whoisData && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-vivid_blue text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaGlobe />
                Domain Information for {whoisData.domain_name}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <InfoRow icon={FaGlobe} label="Domain Name" value={whoisData.domain_name} />
              <InfoRow icon={FaShieldAlt} label="Registrar" value={whoisData.registrar} />
              <InfoRow icon={FaCalendarAlt} label="Creation Date" value={whoisData.creation_date} />
              <InfoRow icon={FaCalendarAlt} label="Expiration Date" value={whoisData.expiration_date} />
              <InfoRow icon={FaEnvelope} label="Contact Email" value={whoisData.emails} />
              
              {whoisData.status && (
                <div className="flex items-start gap-3 py-2">
                  <FaShieldAlt className="text-vivid_blue mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {whoisData.status.map((status, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {status}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {whoisData.name_servers && (
                <div className="flex items-start gap-3 py-2">
                  <FaServer className="text-vivid_blue mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Name Servers:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
                      {whoisData.name_servers.map((server, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-mono">
                          {server}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Whois
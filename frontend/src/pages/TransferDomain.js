import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_KEY = process.env.REACT_APP_WHOIS_API_KEY
const WHOIS_CHECK_URL = 'https://api.apilayer.com/whois/check'

const TransferDomain = () => {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const validateDomainInput = (d) => {
    if (!d) return false
    const cleaned = d.trim().toLowerCase()
    return /\.[a-z]{2,}$/i.test(cleaned)
  }

  const handleCheck = async () => {
    const domainToCheck = domain.trim().toLowerCase()
    if (!validateDomainInput(domainToCheck)) {
      toast.error('Please enter a valid domain (e.g. example.com)')
      return
    }

    if (!API_KEY) {
      toast.error(
        'WHOIS API key not configured. Please set REACT_APP_WHOIS_API_KEY.'
      )
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const url = `${WHOIS_CHECK_URL}?domain=${encodeURIComponent(
        domainToCheck
      )}`
      const res = await fetch(url, {
        method: 'GET',
        headers: { apikey: API_KEY },
      })

      if (!res.ok) throw new Error(`API returned ${res.status}`)

      const json = await res.json()

      const status = json?.result

      const registered = status === 'registered'
      const available = status === 'available'

      setResult({
        domain: domainToCheck,
        registered,
        available,
        raw: json,
      })

      if (available) {
        toast.success(
          `${domainToCheck} is available — you cannot transfer an unregistered domain.`
        )
      } else if (registered) {
        toast.info(
          `${domainToCheck} is registered. You may initiate a transfer.`
        )
      } else {
        toast.warn(`Unknown status for ${domainToCheck}`)
      }
    } catch (error) {
      console.error('Whois check error', error)
      toast.error(`Whois API error: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFakeTransfer = () => {
    if (!result?.registered) {
      toast.error(
        'Domain is not registered — cannot transfer an unregistered domain.'
      )
      return
    }

    toast.success(`Transfer request for ${result.domain} submitted.`)
  }

  return (
    <div className="py-16 px-6 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3500} />

      <h1 className="text-4xl font-bold text-center text-vivid_blue mb-6">
        Transfer your domain names
      </h1>
      <p className="text-center text-text max-w-3xl mx-auto mb-10">
        Transfer your domain names to one of the largest domain providers in
        South Africa and get free domain parking, DNS hosting, nameserver
        management and many more features.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Domain Name To Transfer (e.g. example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border border-light_gray rounded-full px-5 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-primary text-background px-6 py-2 rounded-full hover:bg-vivid_blue transition disabled:opacity-60">
          {loading ? 'Checking...' : 'Check Transfer'}
        </button>
      </div>

      <h3 className="text-xl font-semibold text-center text-vivid_blue mb-4">
        Here are your availability results
      </h3>

      {result ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {result.domain}
              </h4>
              <p className="text-sm text-gray-500">
                {result.available && (
                  <>
                    Status:{' '}
                    <span className="text-green-600 font-semibold">
                      Available
                    </span>
                  </>
                )}
                {result.registered && (
                  <>
                    Status:{' '}
                    <span className="text-red-600 font-semibold">
                      Registered
                    </span>
                  </>
                )}
                {!result.available && !result.registered && (
                  <>
                    Status:{' '}
                    <span className="text-gray-600 font-semibold">Unknown</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-lg font-bold text-green-600">
                {result.registered ? '—' : ''}
              </p>
              <button
                onClick={handleFakeTransfer}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  result.registered
                    ? 'bg-primary text-white hover:bg-vivid_blue'
                    : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!result.registered}>
                Fake Transfer
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            {result.raw?.created_date && (
              <p>
                <strong>Created:</strong> {result.raw.created_date}
              </p>
            )}
            {result.raw?.expires && (
              <p>
                <strong>Expires:</strong> {result.raw.expires}
              </p>
            )}
            {result.raw?.registrar && (
              <p>
                <strong>Registrar:</strong> {result.raw.registrar}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-8">
          No lookup yet. Enter a domain and click "Check Transfer".
        </p>
      )}

      <h2 className="text-2xl font-bold text-center mb-10">
        Included FREE with your domain transfers
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            Domain Parking
          </h3>
          <p className="text-text">
            Not ready to launch a website just yet? No Problem! You can register
            your domain name with us, without it being associated with any
            services until you are ready to launch.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            DNS Hosting
          </h3>
          <p className="text-text">
            With every domain you get free DNS management and free DNS hosting
            on our geographically redundant nameserver, even if your website is
            hosted elsewhere.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            Nameserver Management
          </h3>
          <p className="text-text">
            Host your domain with us and point it to another provider’s
            nameservers or you can use our geographically redundant nameservers
            for free DNS hosting.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            URL Forwarding
          </h3>
          <p className="text-text">
            Use our free URL forwarding service, also called Domain Pointing, to
            easily point your domain name to another one of your existing
            websites.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            Domain Support
          </h3>
          <p className="text-text">
            With over 100+ years of cumulative domain experience in our Support
            department, we can assist you with any issues you may face.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            “Is It Up” Monitoring Tool
          </h3>
          <p className="text-text">
            Use our free “Is It Up” service to check if your domain or website
            is accessible from our systems on HTTP and HTTPS.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            1-Click DNSSEC
          </h3>
          <p className="text-text">
            DNSSEC protects your domain against various attacks. With our
            easy-to-use interface, you can enable DNSSEC protection on your
            domain with one click.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            Blacklist Checking
          </h3>
          <p className="text-text">
            Check your domain against 120+ well-known blacklists. If
            blacklisted, a delisting link to the RBL provider will be provided.
          </p>
        </div>

        <div className="p-6 border border-light_gray rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-vivid_blue mb-2">
            Easy & Intuitive Management
          </h3>
          <p className="text-text">
            Our intuitive portal provides a simple customer experience, making
            domain management quick and easy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransferDomain

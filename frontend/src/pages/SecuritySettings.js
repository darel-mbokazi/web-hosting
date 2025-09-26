import React, { useState } from 'react'

const SecuritySettings = () => {
  const [ssoEnabled, setSsoEnabled] = useState(false)

  const toggleSSO = () => {
    setSsoEnabled(!ssoEnabled)
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-4xl text-center font-bold text-vivid_blue mb-6">
          Security Settings
        </h1>

        <h2 className="text-2xl font-semibold mb-3">Single Sign-On</h2>
        <p className="bg-green-100 text-green-800 p-3 rounded-md mb-6">
          Third party applications leverage the Single Sign-On functionality to
          provide direct access to your billing account without you having to
          re-authenticate.
        </p>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={toggleSSO}
            className={`px-6 py-2 rounded-lg font-semibold ${
              ssoEnabled
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}>
            {ssoEnabled ? 'ON' : 'OFF'}
          </button>
          <p className="text-gray-700">
            Single Sign-On is currently{' '}
            <span className="font-bold">
              {ssoEnabled ? 'enabled' : 'disabled'}
            </span>{' '}
            for your account.
          </p>
        </div>

        <p className="text-gray-600 text-sm">
          You may wish to disable this functionality if you provide access to
          any of your third party applications to users who you do not wish to
          be able to access your billing account.
        </p>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-3">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-700 mb-4">
            Protect your account with an extra layer of security by enabling
            two-factor authentication (2FA).
          </p>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-vivid_blue">
            Configure 2FA
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings

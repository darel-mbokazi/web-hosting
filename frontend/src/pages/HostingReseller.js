import React from 'react'

const HostingReseller = () => {
  return (
    <div className="bg-background py-12 mt-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-vivid_blue mb-10">
          RESELLER HOSTING PLANS
        </h1>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Expert 24/7 Reseller Support
            </h3>
            <p className="text-text">
              Customer & technical support specialists are standing by 24/7 to
              ensure you are completely satisfied. Receive help via live chat,
              e-mail ticket, or telephone.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Advanced Security
            </h3>
            <p className="text-text">
              Your accounts will be secured against constant threats with our
              custom security rules, zero-day vulnerability and real-time 24/7
              security monitoring.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Super Fast Performance
            </h3>
            <p className="text-text">
              Your accounts will enjoy the latest speed technologies such as
              Solid State Drive RAID-10 Storage Arrays, PHP8, Caching, CDN &
              more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HostingReseller

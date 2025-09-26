import React from 'react'

const AboutUs = () => {
  return (
    <div className="bg-gray-50 mt-20 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-vivid_blue mb-6">
          The Story of Web Hosting
        </h1>
        <p className="text-text text-lg leading-relaxed mb-6">
          Web Hosting is named after our vision to support businesses and
          individuals across Africa. Too often, big multinational corporations
          undercut local businesses with low prices but provide even lower
          customer service. We at Web Hosting are fiercely committed to
          providing outstanding service to our customers. We uphold this
          standard of excellence because hospitals, medical companies, ecommerce
          businesses, financial institutions, and other essential businesses
          depend on us to operate uninterrupted at all times. This is a
          responsibility we take to heart.
        </p>

        <h2 className="text-2xl font-semibold text-primary mb-2">
          Founders Promise
        </h2>
        <p className="text-text text-lg leading-relaxed mb-2">
          "At Web-Hosting we're confident that you will be extremely happy with
          your green energy web hosting service, however if you are ever
          dissatisfied, simply reach out to our team and we will do everything
          we can to ensure your satisfaction. We look forward to your business
          and to serving your web hosting needs."
        </p>
        <p className="text-gray-600 font-medium mb-8">
          Trey Gardner, CEO / Web-Hosting
        </p>

        <h3 className="text-xl font-semibold text-vivid_blue mb-4">
          Our Management Team
        </h3>
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h4 className="text-lg font-bold text-primary mb-1">TREY GARDNER</h4>
          <h5 className="text-md font-medium text-gray-700 mb-2">
            Chief Executive Officer
          </h5>
          <p className="text-text text-base leading-relaxed">
            Trey has been in the web hosting business since 1999 and has worked
            for or helped build 8 web hosting companies including iPowerweb,
            iPage, StartLogic, Dot5Hosting, Globat, Lunarpages, Hostpapa and
            finally Web-Hosting. His expertise has been in the sales and
            marketing of the hosting services.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs

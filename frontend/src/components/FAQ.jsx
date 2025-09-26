import React, { useState } from 'react'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { MdQuestionAnswer } from 'react-icons/md'
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from 'react-icons/io'

const FAQ = () => {
  const [showAnswer, setShowAnswer] = useState(null)

  const handleAnswers = (i) => {
    setShowAnswer((prevShowAnswer) => (prevShowAnswer === i ? null : i))
  }

  const faq = [
    {
      id: 1,
      question: 'Which Web Hosting package is right for me?',
      answer:
        'If you are a home user wanting a personal website, or maybe you are thinking about starting a business, we recommend our Starter Web Hosting Package for your needs. If you are a small business looking to host your company website with email addresses, our Business and Business Plan Web Hosting Packages should be suitable for your business needs. If you are looking to host directories, e-commerce websites, forums, or simply just require more space and resources, then our Business Plus or Enterprise Web Hosting Packages should be suitable for your needs.',
    },
    {
      id: 2,
      question: 'What’s included with my Website Hosting Package?',
      answer:
        'The Website Hosting Package will give you everything you need to host your personal or company website. All packages include a free .co.za domain name, fast storage, unlimited traffic and free SSL certificates to help you secure your presence online. All hosting packages include the web hosting control panel called Direct Admin. Direct Admin will allow you to manage all aspects of your website hosting package from the creating of email accounts, managing databases, backing up your website and viewing of your website statistics. Our Web Hosting Knowledge Base is packed with informative step-by-step guides. Don’t worry if you get stuck, our support staff are always on hand to assist.',
    },
    {
      id: 3,
      question: 'Can I Upgrade or Downgrade my hosting package later?',
      answer:
        'Certainly, we allow you a great deal of flexibility. You can upgrade or downgrade your website hosting package at any time. You may simply do it yourself or call us if you require assistance. For cancellations, you’ll need to provide us with a calendar month’s notice',
    },
    {
      id: 4,
      question: 'What customer support do I get?',
      answer:
        'Web-Hosting is one of the few web hosting providers that offer multilingual support 24/7. You will get any kind of assistance you need – Web-Hosting’s Customer Success team consists of experts willing to go the extra mile to solve your issues as quickly as possible.So, if you need any help, don’t hesitate to reach out via live chat.What’s more, we have a rich database of Web-Hosting Tutorials covering website troubleshooting, search engine optimization, digital marketing best practices, and more. Alternatively, check out Web-Hosting Academy for easy-to-follow video tutorials.',
    },
    {
      id: 5,
      question: 'What Are the Differences Between Website Hosting and Domain?',
      answer:
        'Web hosting is a service that stores websites and makes them accessible on the internet. On the other hand, a domain name is essentially a website’s address, such as Web-Hosting.com. Both are crucial elements for building a fully functional website.Without a hosting plan, you need to transform your computer into a website server, which requires deep technical understanding and hefty maintenance costs. Without domains, users have to use an IP address to visit your website, which is harder to remember and simply unpractical.',
    },
    {
      id: 6,
      question: 'Can I Migrate My Existing Website to Web-Hosting?',
      answer:
        'Yes, we offer free unlimited website migration with no downtime. Before moving WordPress websites from other hosting companies to Web-Hosting, secure one of our managed WordPress hosting plans first. After that, access hPanel to submit a request for automatic website migration or manually transfer your website’s files. If you don’t use a typical CMS or need help along the way, our Customer Success team will guide you through the process at no additional cost.',
    },
    {
      id: 7,
      question: 'Does Shared Hosting Come With a Control Panel?',
      answer:
        'Yes, each shared hosting package comes with hPanel, our custom-built control panel. It helps you manage your hosting account, monitor resource usage, create email addresses, and install a content management system. A control panel is different from the admin panel of your website, which is created when installing a CMS. WordPress dashboard is one of the most popular examples of such panels.',
    },
  ]

  return (
    <div className="w-full px-5 py-20 md:py-16 bg-primary text-black">
      <h1 className="text-center text-2xl md:text-3xl font-bold mb-8">
        Frequently Asked Questions
      </h1>

      <div className="flex flex-col gap-4">
        {faq.map((que_ans, i) => (
          <div
            key={que_ans.id}
            className="w-full border border-light_gray rounded-lg p-4">
            <h3
              onClick={() => handleAnswers(i)}
              className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center gap-2 w-full md:w-3/4">
                <BsQuestionCircleFill className="text-lg" />
                <span className="font-medium">{que_ans.question}</span>
              </div>
              <span className="text-xl">
                {showAnswer === i ? (
                  <IoIosArrowDropdownCircle />
                ) : (
                  <IoIosArrowDropupCircle />
                )}
              </span>
            </h3>

            {showAnswer === i && (
              <p className="mt-3 p-3 bg-background rounded-xl text-sm md:text-base flex gap-2">
                <MdQuestionAnswer className="text-xl mt-1" />
                <span>{que_ans.answer}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ

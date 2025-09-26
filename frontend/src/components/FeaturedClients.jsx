import React from 'react'
import img1 from '../assets/pexels-andrea-piacquadio-712513.jpg'
import img2 from '../assets/pexels-nathan-cowley-1300402.jpg'
import img3 from '../assets/pexels-simon-robben-614810.jpg'
import { BsStar, BsStarFill } from 'react-icons/bs'

const FeaturedClients = () => {
  const featuredClients = [
    {
      id: 1,
      ratings: 5,
      story:
        'Ever since we have been with Web-Hosting, it has been amazing. We have not really had any issues at all and if we ever do have a question, their customer service is incredible...',
      image: img1,
      name: 'Andrea Piacquadio',
      occupation: 'Co-founder of Code LTS',
    },
    {
      id: 2,
      ratings: 4,
      story:
        'When I looked at Web-Hosting’s hPanel, I realized it was going to be the easiest to manage. Many developers may prefer other options, but for me personally, I like hPanel...',
      image: img2,
      name: 'Nathan Cowley',
      occupation: 'Senior Web Designer',
    },
    {
      id: 3,
      ratings: 5,
      story:
        'With Web-Hosting I can manage the hosting, domain name, and SSL certificate in one place, which is really refreshing. And setting up a website was easy - I did not need to talk to customer...',
      image: img3,
      name: 'Simon Robben',
      occupation: 'Founder of Coded Academy',
    },
  ]

  return (
    <div className="w-full py-20 bg-primary">
      <h1 className="text-center text-2xl md:text-3xl font-bold mb-20">
        Featured Client Stories
      </h1>

      <div className="flex flex-col md:flex-col lg:flex-row px-5 gap-6 lg:gap-10">
        {featuredClients.map((client) => (
          <div
            key={client.id}
            className="flex-1 border-2 bg-background border-light_gray rounded-xl p-6 shadow-sm">
            <p className="flex gap-1 text-vivid_blue mb-4">
              {[1, 2, 3, 4, 5].map((star) =>
                client.ratings >= star ? (
                  <BsStarFill key={star} />
                ) : (
                  <BsStar key={star} />
                )
              )}
            </p>

            <p className="mb-4 text-sm md:text-base">{client.story}</p>

            <p className="text-vivid_blue text-lg font-semibold cursor-pointer mb-6 hover:text-primary">
              Read the full story
            </p>

            <div className="flex items-center gap-4">
              <img
                src={client.image}
                alt={client.name}
                className="w-20 h-20 object-cover rounded-full"
              />
              <div>
                <h2 className="text-lg font-bold">{client.name}</h2>
                <p className="text-sm">{client.occupation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedClients

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import avatar1 from "../../assets/images/ava-1.jpg";
import avatar2 from "../../assets/images/ava-2.jpg";
import avatar3 from "../../assets/images/ava-3.jpg";

const Testimonials = () => {
  const testimonialsData = [
    {
      pic: avatar1,
      name: 'John Doe',
      description:
        "Our trip with VoyageIQ was nothing short of amazing! The attention to detail, friendly guides, and unforgettable experiences made it truly special. Can't wait for the next adventure!",
    },
    {
      pic: avatar2,
      name: 'Jane Smith',
      description:
        "VoyageIQ exceeded my expectations. From landscapes to encounters, every moment was a delight. The team's expertise and personalized service made the journey unforgettable.",
    },
    {
      pic: avatar3,
      name: 'Chris Johnson',
      description:
        "I've traveled with agencies, but VoyageIQ stands out. The seamless planning, knowledgeable, and unique destinations set them apart. An incredible way to explore the world!",
    },
    {
      pic: avatar1,
      name: 'Emily Davis',
      description:
        "VoyageIQ made our dream vacation a reality. The carefully crafted itinerary, diverse activities, and genuine hospitality created an experience we'll cherish forever. Highly recommended!",
    },
    {
      pic: avatar3,
      name: 'Alex Turner',
      description:
        "A big shoutout to the VoyageIQ team for an unforgettable journey. The blend of adventure and relaxation was perfect. I'll be booking my next trip with them without a doubt.",
    },
  ];

  if (!testimonialsData || testimonialsData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          No testimonials available at the moment.
        </p>
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500, // Smoother transition
    swipeToSlide: true,
    autoplaySpeed: 2500, // Slightly longer pause
    pauseOnHover: true, // Good UX addition
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 992, // Medium devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 576, // Small devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {testimonialsData.map((data, index) => (
        <div key={index} className="p-3 md:p-4 outline-none focus:outline-none">
          {' '}
          {/* Added padding for gutter between slides */}
          <figure className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 h-full flex flex-col">
            <blockquote className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
              <p className="italic text-base leading-relaxed">
                "{data.description}"
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <img
                src={data.pic}
                className="w-14 h-14 object-cover rounded-full border-2 border-blue-500 dark:border-blue-400"
                alt={`Photo of ${data.name}`}
              />
              <div>
                <h5 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {data.name}
                </h5>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Customer
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      ))}
    </Slider>
  );
};

export default Testimonials;

const LandingPage = () => {
  return (
    <div className="flex-grow flex flex-col justify-center items-center text-center text-white p-4">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight">
        Prep
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
            Wise
          </span>
          {/* Underline SVG */}
          <svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 250 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 10.1827C52.4824 3.96694 159.37 -2.33823 248 4.10237"
              stroke="url(#paint0_linear_4_5)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_4_5"
                x1="2"
                y1="5.5"
                x2="248"
                y2="5.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </h1>
      <p className="mt-8 max-w-xl text-lg text-gray-300">
        AI Interview Assistant for real-time support. Unlimited sessions, dual responses, and cutting-edge AI models.
      </p>
    </div>
  );
};

export default LandingPage;
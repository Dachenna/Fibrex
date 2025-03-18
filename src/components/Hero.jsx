import Apple from '../assets/apple.jpg';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const handleclick = () => {
    navigate('/signup');
  }
  return (

    <div className="container font-sans ">
      {/* Hero Section – Focus on Fiber Foods */}
      <section className="bg-green-100 py-12 rounded-xl">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Discover the Power of Fiber
          </h1>
          <p className="text-xl text-gray-700 mb-8 lg:text-center">
            Embrace a healthier lifestyle with fiber-rich foods that nourish your body and support overall wellness.
          </p>
          <div className="flex justify-center ">
            <img
              src={Apple}
              alt="Assorted Fiber Foods"
              className="w-full max-w-md rounded shadow-lg"
            />
          </div>
        </div>
        <button className="bg-primary text-white py-3 px-6 rounded-lg mt-8 mx-auto block
        hover:bg-primary-dark duration-200 transition-colors"
        onClick={handleclick}>
          Get Started
        </button>
      </section>

      {/* Education Hub Section – Content Derived from the Image */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 flex">
            Education Hub: All About Fiber
          </h2>
          <div className="max-w-3xl mx-auto">
            <article className="prose mx-auto">
              <h3>What is Fiber?</h3>
              <p>
                Fiber is an essential nutrient that plays a critical role in digestion, helps regulate blood sugar levels, and can aid in maintaining a healthy weight.
              </p>
              <h4>Recommended Daily Fiber Intake</h4>
              <ul>
                <li><strong>Men:</strong> 38 grams per day</li>
                <li><strong>Women:</strong> 25 grams per day</li>
              </ul>
              <h4>Key Benefits of Fiber</h4>
              <p>
                Consuming adequate fiber helps lower cholesterol levels, improves bowel regularity, and supports overall gut health.
              </p>
              <h4>Top Fiber Sources</h4>
              <p>
                Increase your intake with foods such as fruits, vegetables, whole grains, legumes, and nuts. Incorporating these foods into your diet can easily help you meet your daily fiber goals.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

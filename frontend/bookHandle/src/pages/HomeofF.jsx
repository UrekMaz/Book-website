import React from 'react';
import { Clock } from 'lucide-react';

export default function HomeofF() {
  // Sample product data based on the image
  const products = [
    { id: 1, name: 'Lotinariyel', category: 'Wedding Products', price: '₹300', image: '/Lotinariyel51.png' },
    { id: 2, name: 'Lotinariyel', category: 'Wedding Products', price: '₹350', image: '/Lotinariyel2 1.png' },
    { id: 3, name: 'Mahendi Tray', category: 'Wedding Products', price: '₹500', image: '/Chab1 1.png' },
    { id: 4, name: 'Haldi Tray', category: 'Wedding Products', price: '₹400', image: '/Chab2 1.png' },
  ];

  return (
    <div className="font-sans">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center">
          <span className="text-red-500 text-2xl font-bold mr-2">🔔</span>
          <span className="text-xl font-bold">PANCHMAHAL</span>
        </div>
        
        <div className="space-x-4">
          <a href="#" className="font-medium">Home</a>
          <a href="#" className="font-medium">Shop</a>
          <a href="#" className="font-medium">Cart</a>
        </div>
        
        <div className="flex space-x-4">
          <span>🔍</span>
          <span>🛒</span>
          <span>👤</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="p-10 bg-[#D6E5FB] flex justify-between">
        <div className="max-w-md">
          <p className="text-gray-700">Trending products in 2023</p>
          <h1 className="text-3xl font-bold my-4">Our Creations Match Your Imaginations</h1>
          <p className="text-gray-700 mb-6">
            Welcome to our Handicraft Shopping website! We are committed to providing high-quality products at affordable prices and ensuring that our customers are completely satisfied with their purchase. Shop now and discover the beauty of handmade crafts!
          </p>
          <button className="bg-black text-white px-6 py-2 rounded">SHOP NOW</button>
        </div>
        <div className="flex items-center">
          <img src="/MarriageProducts12.png" alt="Handicraft Products" className="rounded" />
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="flex justify-between p-4 gap-4">
        <div className="bg-gray-200 p-4 rounded flex-1 flex items-center">
          <div className="bg-gray-700 rounded-full p-2 text-white mr-3">📦</div>
          <div>
            <h3 className="font-bold">Free Shipping</h3>
            <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        
        <div className="bg-gray-200 p-4 rounded flex-1 flex items-center">
          <div className="bg-gray-700 rounded-full p-2 text-white mr-3">🔄</div>
          <div>
            <h3 className="font-bold">Easy Returns</h3>
            <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        
        <div className="bg-green-100 p-4 rounded flex-1 flex items-center">
          <div className="bg-gray-700 rounded-full p-2 text-white mr-3">🔒</div>
          <div>
            <h3 className="font-bold">Secure Payment</h3>
            <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        
        <div className="bg-blue-100 p-4 rounded flex-1 flex items-center">
          <div className="bg-gray-700 rounded-full p-2 text-white mr-3">✅</div>
          <div>
            <h3 className="font-bold">Back Guarantee</h3>
            <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
      </section>

      {/* Product Section: Trending Products */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Trending Products</h2>
        <div className="grid grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4" />
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">{product.price}</span>
                <button className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Section: Best Sales */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Best Sales</h2>
        <div className="grid grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4" />
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">{product.price}</span>
                <button className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limited Offers Section */}
      <section className="bg-blue-900 text-white p-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Limited Offers</h2>
          <p className="mb-4">Get exciting offers on Wedding Products!!</p>
          <div className="flex space-x-4 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">61</span>
              <span>:</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">1</span>
              <span>:</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">55</span>
              <span>:</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">4</span>
            </div>
          </div>
          <button className="bg-white text-blue-900 px-6 py-2">Visit Store</button>
        </div>
        <div>
          <img src="/ganesha 1.png" alt="Ganesha Statue" className="rounded" />
        </div>
      </section>

      {/* Product Section: New Arrivals */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">New Arrivals</h2>
        <div className="grid grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4" />
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">{product.price}</span>
                <button className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Section: Popular in Category */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Popular in Category</h2>
        <div className="grid grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4" />
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">{product.price}</span>
                <button className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white p-8">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div>
            <h3 className="font-bold mb-4">Pankaj Knitting Centre</h3>
            <p className="text-sm">
              Since 1995, Pankaj Knitting Centre is engaged in manufacturing as well as in retailing exclusive handicraft products in India. Stay tuned on our website for getting exciting offers.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Top Categories</h3>
            <ul className="text-sm space-y-2">
              <li>Wedding Products</li>
              <li>Toran</li>
              <li>Khatti</li>
              <li>Kanha Shringer</li>
              <li>Birthday Decoration</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Useful Links</h3>
            <ul className="text-sm space-y-2">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Youtube</li>
              <li>Twitter</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="text-sm space-y-2">
              <li>Pankaj Knitting Centre</li>
              <li>Malva Street,</li>
              <li>Nr. Deep Well,</li>
              <li>Jaipur - 360370</li>
              <li>+91 9375711444</li>
              <li>pankajknittingcentre@gmail.com</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-4 border-t border-blue-800">
          <p className="text-sm">Copyright 2023 developed by Pankaj Knitting Centre. All rights are reserved.</p>
        </div>
      </footer>
    </div>
  );
}
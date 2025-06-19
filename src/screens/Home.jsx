import React from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import { useProducts } from '../contexts/ProductsContext';
import { PlusIcon, MinusIcon, ShoppingCart, TrashIcon } from 'lucide-react';
import './Home.css'; // We'll add some basic styles
import { IS_ARGENTINA } from '@/constans/country';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Home = () => {
  const { products, isLoading, error } = useProducts();
  const { addToCart, cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const {
    scrollRef,
    snapPointIndexes
  } = useSnapCarousel({ axis: 'y' });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const showPrice = (price) => IS_ARGENTINA ? Math.floor(price).toLocaleString() : (price).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  // Calculate total quantity in cart
  const totalQuantity = cart.length

  // Helper to get product quantity in cart
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="tiktok-feed">
      {/* Cart icon at the top right */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
      }}>
        <Button
          onClick={() => navigate('/cart')}
          disabled={totalQuantity === 0}
          variant="outline"
          className={`cart-button flex items-center gap-2 sm:gap-3 p-5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-all duration-300 border-2 border-emerald-600 text-emerald-600 hover:scale-110 scale-110 ${totalQuantity > 5 ? 'animate-cart-pulse-flash' : totalQuantity > 3 ? 'animate-cart-pulse' : ''}`}
        >
          <ShoppingCart className="w-10 h-10" />
          <span className="text-base sm:text-lg font-semibold">{totalQuantity}</span>
        </Button>
      </div>
      <ul
        ref={scrollRef}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          scrollSnapType: 'y mandatory',
          width: '100%',
          height: '100vh',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {products.map((product, i) => (
          <li
            key={product.id}
            style={{
              width: '100vw',
              height: '100vh',
              flexShrink: 0,
              scrollSnapAlign: snapPointIndexes.has(i) ? 'start' : undefined,
            }}
          >
            <div className="deal-card" style={{ backgroundImage: `url(${product.image})`, position: 'relative' }}>
              <div className="deal-info">
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                <div className="flex flex-col gap-y-2 mb-4">
                  <span className="text-6xl font-bold">${showPrice(product.price)}</span>
                  {product.competitorPrices && product.competitorPrices.length > 0 && (
                    <div className="flex items-center gap-2 bg-black/60 rounded px-3 py-1 w-fit">
                      {product.competitorPrices[0].name !== "Mercadito" ? (<img
                        src={product.competitorPrices[0].logo}
                        alt={product.competitorPrices[0].name}
                        className="w-12 h-12 object-contain"
                      />): 
                      "Antes"}
                      <span className="text-red-600 font-bold text-4xl">
                         ${product.competitorPrices[0].price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Cart/quantity controls */}
              {getProductQuantity(product.id) === 0 ? (
                <button
                  onClick={() => addToCart(product)}
                  className="p-4 rounded-full bg-white shadow-[0_20px_80px_rgb(0,0,0,0.8)] border-[3px] border-emerald-600"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <ShoppingCart className="w-8 h-8 text-emerald-600" />
                </button>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  { getProductQuantity(product.id) >= product.max_units_per_delivery ?
                    (
                      <button
                        onClick={() => {}}
                        className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-[0_20px_80px_rgb(0,0,0,0.8)] border-[3px] border-gray-600 text-gray-600 text-lg font-bold"
                        disabled
                      >
                        MAX
                      </button>
                    ) :
                    (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-[0_20px_80px_rgb(0,0,0,0.8)] border-[3px] border-emerald-600"
                      >
                        <PlusIcon className="w-8 h-8 text-emerald-600" />
                      </button>
                    )
                  }
                  <span style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                    {getProductQuantity(product.id)}
                  </span>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className={'w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-[0_20px_80px_rgb(0,0,0,0.8)] border-[3px] border-red-600'}
                  >
                    {getProductQuantity(product.id) === 1 ? (
                      <TrashIcon className="w-8 h-8 text-red-600" />
                    ) : (
                      <MinusIcon className="w-8 h-8 text-red-600" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Perfume } from '../types';

interface ProductCardProps {
  perfume: Perfume;
  index: number;
  onAddToCart: (perfume: Perfume) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ perfume, index, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Discover ${perfume.name} by ${perfume.brand} at L'Essence. ${perfume.description}`;

  const handleShare = (platform: 'facebook' | 'twitter' | 'pinterest') => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(perfume.image)}&description=${encodeURIComponent(shareText)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(perfume);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative w-full h-[500px] overflow-hidden bg-[#1a1a1a] border border-[#333] hover:border-[#D4AF37] transition-colors duration-500"
      >
        {/* Image Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={perfume.image}
            alt={perfume.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-[#D4AF37] text-xs tracking-widest uppercase mb-2">{perfume.brand}</h3>
          <h2 className="text-3xl font-serif text-white mb-2">{perfume.name}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {perfume.notes.slice(0, 3).map((note, i) => (
              <span key={i} className="text-[10px] uppercase tracking-wider border border-white/20 px-2 py-1 rounded-full text-white/70">
                {note}
              </span>
            ))}
          </div>
          <div className="h-0 overflow-hidden group-hover:h-auto group-hover:overflow-visible transition-all duration-500">
             <p className="text-gray-300 text-sm italic mb-4 serif-text line-clamp-3">
            "{perfume.description}"
            </p>
            <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                <span className="text-2xl font-light text-white">${perfume.price}</span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="border border-white/20 text-white p-2 hover:bg-white hover:text-black transition-colors duration-300"
                        title="Quick View"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      className="bg-[#D4AF37] text-black px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors duration-300"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal Portal */}
      {isModalOpen && createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm md:p-4"
                onClick={() => setIsModalOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full h-full md:h-[80vh] md:max-w-5xl bg-[#121212] border-t md:border border-[#333] flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-[#D4AF37]/10"
                >
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 z-20 text-white bg-black/50 rounded-full p-2 md:bg-transparent md:text-white/50 hover:text-[#D4AF37] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 h-[40vh] md:h-full relative overflow-hidden flex-shrink-0">
                        <img 
                            src={perfume.image} 
                            alt={perfume.name} 
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80 md:hidden" />
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-1/2 h-full p-6 md:p-12 overflow-y-auto flex flex-col justify-start md:justify-center bg-[#121212]">
                        <div className="flex-1">
                            <span className="text-[#D4AF37] tracking-[0.3em] text-xs md:text-sm uppercase font-bold mb-2 block">{perfume.brand}</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 md:mb-6">{perfume.name}</h2>
                            
                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                <span className="text-2xl md:text-3xl font-light text-white">${perfume.price}</span>
                                <span className="text-xs md:text-sm text-green-400 uppercase tracking-wider border border-green-400/30 px-2 py-0.5 rounded">In Stock</span>
                            </div>

                            <p className="text-gray-300 text-base md:text-lg leading-relaxed serif-text italic mb-6 md:mb-8">
                                "{perfume.description}"
                            </p>

                            <div className="mb-6 md:mb-8">
                                <h4 className="text-white text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Olfactory Notes</h4>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {perfume.notes.map((note, idx) => (
                                        <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-gray-300">
                                            {note}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6 md:mb-8">
                                <h4 className="text-white text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Mood</h4>
                                <span className="text-[#D4AF37] font-serif text-lg">{perfume.mood}</span>
                            </div>
                        </div>

                        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col gap-4">
                            <div className="flex gap-4">
                                <button 
                                  onClick={() => onAddToCart(perfume)}
                                  className="flex-1 bg-[#D4AF37] text-black py-4 uppercase text-sm font-bold tracking-[0.2em] hover:bg-white transition-colors duration-300"
                                >
                                    Add to Cart
                                </button>
                                <button className="px-6 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
                            </div>
                        
                            {/* Social Share */}
                            <div className="flex items-center justify-center gap-6 pt-4">
                                <span className="text-xs uppercase tracking-widest text-white/30">Share</span>
                                <div className="flex gap-4 text-white/50">
                                    <button onClick={() => handleShare('facebook')} className="hover:text-[#D4AF37] transition-colors p-1">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleShare('twitter')} className="hover:text-[#D4AF37] transition-colors p-1">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleShare('pinterest')} className="hover:text-[#D4AF37] transition-colors p-1">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ProductCard;
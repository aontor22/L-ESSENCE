import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#121212] border-l border-[#333] z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#121212]">
              <h2 className="text-2xl font-serif text-[#D4AF37]">Your Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-white/20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.074.876 0 2.409-1.896 4.363-4.226 4.417H4.286c-2.33-.054-4.226-2.008-4.226-4.417 0-.296.005-.59.075-.876l1.262-5c.164-.648.74-1.077 1.39-1.077h13.25c.65 0 1.226.429 1.39 1.077z" />
                    </svg>
                    <p className="text-white/50 serif-text italic">Your cart is empty.</p>
                    <button onClick={onClose} className="text-[#D4AF37] text-sm uppercase tracking-widest hover:underline">Start Shopping</button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 bg-white/5 p-4 rounded-sm border border-white/5"
                  >
                    <div className="w-20 h-24 flex-shrink-0 bg-[#000]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg text-white">{item.name}</h3>
                          <button onClick={() => onRemove(item.id)} className="text-white/30 hover:text-red-400 transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-[#D4AF37] uppercase tracking-widest">{item.brand}</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-white/20 rounded-sm">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 py-1 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-2 text-sm text-white">{item.quantity}</span>
                          <button 
                             onClick={() => onUpdateQuantity(item.id, 1)}
                             className="px-2 py-1 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-white font-light">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#121212]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/60 uppercase text-xs tracking-widest">Subtotal</span>
                <span className="text-2xl font-serif text-[#D4AF37]">${total}</span>
              </div>
              <p className="text-xs text-white/30 mb-6 text-center italic">Shipping and taxes calculated at checkout.</p>
              <button 
                disabled={items.length === 0}
                className="w-full bg-[#D4AF37] text-black py-4 uppercase text-sm font-bold tracking-[0.2em] hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
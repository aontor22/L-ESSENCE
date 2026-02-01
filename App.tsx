import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import InteractiveLogo from './components/InteractiveLogo';
import ProductCard from './components/ProductCard';
import AiPerfumer from './components/AiPerfumer';
import CartDrawer from './components/CartDrawer';
import { Perfume, CartItem } from './types';

// Updated Data with High-Quality Studio Style Images
const perfumes: Perfume[] = [
  {
    id: '1',
    name: 'Nocturnal Bloom',
    brand: 'L\'Essence',
    price: 185,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80',
    notes: ['Black Orchid', 'Amber', 'Patchouli'],
    description: 'A dark, velvety fragrance that unfolds under the moonlight. Notes of rare orchid blend with smoky amber for an intoxicating finish.',
    mood: 'Mysterious'
  },
  {
    id: '2',
    name: 'Golden Hour',
    brand: 'L\'Essence',
    price: 160,
    image: 'https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=800&q=80',
    notes: ['Bergamot', 'Saffron', 'Honey'],
    description: 'Capturing the fleeting moment of sunset. Bright citrus opens into warm saffron threads and sweet honey drizzle.',
    mood: 'Warm'
  },
  {
    id: '3',
    name: 'Oceanic Drift',
    brand: 'L\'Essence',
    price: 145,
    image: 'https://images.unsplash.com/photo-1595425970339-27d2c1256924?auto=format&fit=crop&w=800&q=80',
    notes: ['Sea Salt', 'Driftwood', 'Sage'],
    description: 'The raw power of the Atlantic. Salty air meets weathered wood and aromatic sage in this crisp, refreshing scent.',
    mood: 'Fresh'
  },
  {
    id: '4',
    name: 'Velvet Rose',
    brand: 'L\'Essence',
    price: 210,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    notes: ['Damask Rose', 'Oud', 'Praline'],
    description: 'A sophisticated floral with a gourmand twist. Deep red roses layered over exotic oud wood.',
    mood: 'Romantic'
  },
  {
    id: '5',
    name: 'Forest Rain',
    brand: 'L\'Essence',
    price: 155,
    image: 'https://images.unsplash.com/photo-1592914610354-fd354ea45e48?auto=format&fit=crop&w=800&q=80',
    notes: ['Pine', 'Petrichor', 'Moss'],
    description: 'The scent of a pine forest after a heavy rain. Earthy, green, and profoundly grounding.',
    mood: 'Earthy'
  },
  {
    id: '6',
    name: 'Citrus Zest',
    brand: 'L\'Essence',
    price: 130,
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    notes: ['Yuzu', 'Basil', 'Vetiver'],
    description: 'An explosion of energy. Sparkling Japanese yuzu meets spicy basil for an invigorating wake-up call.',
    mood: 'Energetic'
  }
];

function App() {
  const heroRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  // Use scroll progress relative to the hero section for more precise control
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Cart Logic
  const addToCart = (perfume: Perfume) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === perfume.id);
      if (existing) {
        return prev.map(item => item.id === perfume.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...perfume, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filter Logic
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allNotes = useMemo(() => {
    const notes = new Set<string>();
    perfumes.forEach(p => p.notes.forEach(n => notes.add(n)));
    return Array.from(notes).sort();
  }, []);

  const filteredPerfumes = useMemo(() => {
    let result = perfumes;
    
    // Filter by Notes
    if (selectedNotes.length > 0) {
        result = result.filter(p => p.notes.some(n => selectedNotes.includes(n)));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query)
        );
    }
    
    return result;
  }, [selectedNotes, searchQuery]);

  const toggleNote = (note: string) => {
    setSelectedNotes(prev => 
      prev.includes(note) 
        ? prev.filter(n => n !== note)
        : [...prev, note]
    );
  };

  // Parallax transformations
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white overflow-hidden relative">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-8 py-6 flex justify-between items-center mix-blend-difference">
        <div 
            className="text-[#D4AF37] font-bold tracking-widest text-lg cursor-pointer z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            L'ESSENCE
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-white/80">
          <button onClick={() => scrollToSection('collection')} className="hover:text-[#D4AF37] transition-colors focus:outline-none">Collection</button>
          <button onClick={() => scrollToSection('maison')} className="hover:text-[#D4AF37] transition-colors focus:outline-none">Maison</button>
          <button onClick={() => scrollToSection('atelier')} className="hover:text-[#D4AF37] transition-colors focus:outline-none">Atelier</button>
          <button onClick={() => setIsCartOpen(true)} className="hover:text-[#D4AF37] transition-colors focus:outline-none">
            Cart ({cartCount})
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden z-50">
             <button onClick={() => setIsCartOpen(true)} className="text-white hover:text-[#D4AF37] focus:outline-none">
                <span className="sr-only">Cart</span>
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.074.876 0 2.409-1.896 4.363-4.226 4.417H4.286c-2.33-.054-4.226-2.008-4.226-4.417 0-.296.005-.59.075-.876l1.262-5c.164-.648.74-1.077 1.39-1.077h13.25c.65 0 1.226.429 1.39 1.077z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </div>
            </button>
            <button 
                className="text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
            {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            )}
            </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center space-y-8 md:hidden"
          >
             <button onClick={() => scrollToSection('collection')} className="text-2xl font-serif text-white hover:text-[#D4AF37] transition-colors">Collection</button>
             <button onClick={() => scrollToSection('maison')} className="text-2xl font-serif text-white hover:text-[#D4AF37] transition-colors">Maison</button>
             <button onClick={() => scrollToSection('atelier')} className="text-2xl font-serif text-white hover:text-[#D4AF37] transition-colors">Atelier</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header ref={heroRef} className="relative h-[110vh] md:h-[120vh] w-full flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Perfume Texture" 
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/80 via-transparent to-[#0f0f0f]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: textY }}
          className="relative z-10 flex flex-col items-center text-center px-6 md:px-4"
        >
          <div className="mb-8 md:mb-12">
            <InteractiveLogo />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-8xl font-serif text-white mb-6 leading-tight"
          >
            Scent of <span className="italic text-[#D4AF37]">Memory</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-base md:text-xl text-gray-400 max-w-xl md:max-w-2xl font-light serif-text italic"
          >
            Discover fragrances that transcend time. Crafted with rare ingredients for the modern soul.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8 md:mt-12"
          >
             <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto"></div>
          </motion.div>
        </motion.div>
      </header>

      {/* Collection Section */}
      <section id="collection" className="relative z-20 px-6 py-24 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16">
          <div className="mb-6 md:mb-0">
            <h2 className="text-sm text-[#D4AF37] tracking-[0.3em] uppercase mb-4">The Collection</h2>
            <h3 className="text-4xl md:text-5xl font-serif">Signature Scents</h3>
          </div>
          <p className="max-w-md text-gray-400 text-left md:text-right serif-text italic">
            "A perfume is like a piece of clothing, a message, a way of presenting oneself, a costume that differs according to the woman who wears it."
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-12 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
            <div className="flex-1 w-full">
                <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Filter by Notes</h4>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setSelectedNotes([])}
                        className={`px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all duration-300 ${
                            selectedNotes.length === 0
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-gray-500 border-gray-800 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                        }`}
                    >
                        All Notes
                    </button>
                    {allNotes.map(note => (
                        <button
                            key={note}
                            onClick={() => toggleNote(note)}
                            className={`px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest border transition-all duration-300 ${
                                selectedNotes.includes(note)
                                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                : 'bg-transparent text-gray-400 border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                            }`}
                        >
                            {note}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="w-full lg:w-72">
                <div className="relative group">
                    <input 
                        type="text" 
                        placeholder="Search collection..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-0 top-2 text-white/30 group-focus-within:text-[#D4AF37] transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
          <AnimatePresence mode='popLayout'>
            {filteredPerfumes.length > 0 ? (
                filteredPerfumes.map((perfume, index) => (
                    <ProductCard 
                      key={perfume.id} 
                      perfume={perfume} 
                      index={index} 
                      onAddToCart={addToCart}
                      isWishlisted={wishlist.includes(perfume.id)}
                      onToggleWishlist={() => toggleWishlist(perfume.id)}
                    />
                ))
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500"
                >
                    <p className="text-lg serif-text italic">No fragrances found matching your criteria.</p>
                    <button 
                        onClick={() => {setSelectedNotes([]); setSearchQuery('');}}
                        className="mt-4 text-[#D4AF37] hover:underline text-sm uppercase tracking-widest"
                    >
                        Clear All Filters
                    </button>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Philosophy Section (Maison) */}
      <section id="maison" className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden my-24 scroll-mt-24">
        <div className="absolute inset-0 bg-fixed bg-center bg-cover opacity-30 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610461888750-10bf69905581?auto=format&fit=crop&w=1920&q=80')" }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
           >
              <h2 className="text-3xl md:text-6xl font-serif mb-8 leading-tight">
                "Smell is a potent wizard that transports you across thousands of miles and all the years you have lived."
              </h2>
              <p className="text-[#D4AF37] uppercase tracking-widest text-sm md:text-base">— Helen Keller</p>
           </motion.div>
        </div>
      </section>

       {/* Footer (Atelier) */}
      <footer id="atelier" className="bg-[#050505] text-white/60 py-12 md:py-20 px-6 md:px-8 border-t border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="text-[#D4AF37] font-bold tracking-widest text-lg mb-6">L'ESSENCE</div>
            <p className="text-sm leading-loose">
              123 Avenue des Champs-Élysées<br />
              Paris, France 75008<br />
              +33 1 23 45 67 89
            </p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Gift Sets</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Discovery Kit</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">About</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Ingredients</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
             <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Newsletter</h4>
             <p className="text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
             <div className="flex border-b border-white/20 pb-2">
               <input type="email" placeholder="Enter your email" className="bg-transparent w-full focus:outline-none text-white placeholder-white/30" />
               <button className="text-[#D4AF37] uppercase text-xs font-bold hover:text-white">Join</button>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 md:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs text-white/40">
          <p>© 2024 L'Essence Parfumerie. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>

      <AiPerfumer />
    </div>
  );
}

export default App;
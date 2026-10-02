import React from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, ArrowRight, ShieldCheck, Truck, RefreshCcw, HeadphonesIcon } from "lucide-react";

export default function StoreHome() {
  const products = [
    {
      id: 1,
      name: "The Classic Bifold Wallet",
      price: "Rs 4,500",
      category: "Wallets",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Everyday Leather Belt",
      price: "Rs 3,200",
      category: "Belts",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Minimalist Chronograph",
      price: "Rs 12,500",
      category: "Watches",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Slim Card Holder",
      price: "Rs 2,100",
      category: "Wallets",
      image: "https://images.unsplash.com/photo-1606503153255-59d8b8b40819?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex-1 w-full bg-brand-ivory text-brand-charcoal">
      {/* Announcement Bar */}
      <div className="bg-brand-black text-brand-ivory text-xs text-center py-2 tracking-widest font-medium uppercase">
        Discover Everyday Luxury | Explore the MARCO MEN Collection
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-ivory/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Navigation (Left) */}
            <nav className="hidden md:flex space-x-8 w-1/3">
              <Link href="#" className="text-sm font-medium tracking-wide hover:text-brand-gold transition-colors">SHOP ALL</Link>
              <Link href="#" className="text-sm font-medium tracking-wide hover:text-brand-gold transition-colors">WALLETS</Link>
              <Link href="#" className="text-sm font-medium tracking-wide hover:text-brand-gold transition-colors">BELTS</Link>
              <Link href="#" className="text-sm font-medium tracking-wide hover:text-brand-gold transition-colors">WATCHES</Link>
            </nav>
            
            {/* Logo (Center) */}
            <div className="flex-shrink-0 flex items-center justify-center w-1/3">
              <span className="font-serif font-bold text-3xl tracking-widest text-brand-black">
                MARCO MEN
              </span>
            </div>

            {/* Icons (Right) */}
            <div className="flex items-center justify-end w-1/3 space-x-6">
              <button className="text-brand-charcoal hover:text-brand-gold transition-colors">
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button className="text-brand-charcoal hover:text-brand-gold transition-colors">
                <User className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button className="text-brand-charcoal hover:text-brand-gold transition-colors relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-brand-gold text-white text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] bg-brand-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2000&auto=format&fit=crop" 
            alt="Men's Fashion Accessories" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
        </div>
        <div className="relative text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6 tracking-wide font-light">
            THE ART OF <br/>EVERYDAY STYLE
          </h1>
          <p className="text-brand-ivory/80 text-lg md:text-xl font-light mb-10 tracking-wide max-w-xl">
            Refined essentials. Timeless design. Made for the modern man.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-brand-ivory text-brand-black px-10 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors">
              Shop The Collection
            </button>
            <button className="bg-transparent border border-brand-ivory text-brand-ivory px-10 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-brand-ivory/10 transition-colors">
              Explore Bestsellers
            </button>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1 */}
          <div className="group cursor-pointer">
            <div className="relative h-[450px] w-full mb-6 overflow-hidden bg-gray-100">
              <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop" alt="Wallets" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-2xl text-brand-black mb-2">Carry It Well</h3>
              <p className="text-brand-charcoal/70 font-light mb-4">Everyday essentials with refined design.</p>
              <button className="uppercase tracking-widest text-sm font-medium border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">Shop Wallets</button>
            </div>
          </div>
          {/* Category 2 */}
          <div className="group cursor-pointer">
            <div className="relative h-[450px] w-full mb-6 overflow-hidden bg-gray-100">
              <img src="https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop" alt="Belts" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-2xl text-brand-black mb-2">The Finishing Touch</h3>
              <p className="text-brand-charcoal/70 font-light mb-4">Classic details. Effortless sophistication.</p>
              <button className="uppercase tracking-widest text-sm font-medium border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">Shop Belts</button>
            </div>
          </div>
          {/* Category 3 */}
          <div className="group cursor-pointer">
            <div className="relative h-[450px] w-full mb-6 overflow-hidden bg-gray-100">
              <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop" alt="Watches" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-2xl text-brand-black mb-2">Make Every Second Count</h3>
              <p className="text-brand-charcoal/70 font-light mb-4">Timepieces that complement your style.</p>
              <button className="uppercase tracking-widest text-sm font-medium border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">Shop Watches</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products: THE MARCO EDIT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-black mb-4">THE MARCO EDIT</h2>
            <p className="text-brand-charcoal/70 font-light max-w-2xl mx-auto text-lg">
              Considered essentials for every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="relative h-[350px] w-full mb-4 overflow-hidden bg-[#f5f5f5] cursor-pointer">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-brand-black text-white py-3 uppercase tracking-widest text-xs font-semibold hover:bg-brand-charcoal transition-colors">
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-brand-charcoal/60 mb-1">{product.category}</p>
                  <h3 className="text-sm font-medium text-brand-black mb-2 cursor-pointer hover:text-brand-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-brand-charcoal">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
             <button className="border border-brand-black text-brand-black px-10 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-brand-black hover:text-white transition-colors">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-0 flex flex-col md:flex-row bg-brand-black text-brand-ivory">
        <div className="w-full md:w-1/2 h-[500px] md:h-auto relative">
          <img 
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover grayscale"
            alt="Brand Story"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-12 lg:p-24">
          <div className="max-w-lg">
            <h2 className="font-serif text-4xl mb-6">BUILT AROUND YOUR STYLE</h2>
            <p className="text-brand-ivory/70 font-light leading-relaxed mb-10 text-lg">
              MARCO MEN brings together everyday essentials designed to complement the modern man's personal style. From refined wallets to versatile belts and distinctive watches, discover accessories that fit naturally into your everyday life.
            </p>
            <button className="uppercase tracking-widest text-sm font-medium border-b border-brand-ivory pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <ShieldCheck className="w-8 h-8 stroke-[1] text-brand-gold mb-4" />
              <h4 className="uppercase tracking-widest text-xs font-bold mb-2">Secure Checkout</h4>
              <p className="text-sm text-brand-charcoal/60">100% secure payment processing</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <Search className="w-8 h-8 stroke-[1] text-brand-gold mb-4" />
              <h4 className="uppercase tracking-widest text-xs font-bold mb-2">Carefully Selected</h4>
              <p className="text-sm text-brand-charcoal/60">Premium quality accessories</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <HeadphonesIcon className="w-8 h-8 stroke-[1] text-brand-gold mb-4" />
              <h4 className="uppercase tracking-widest text-xs font-bold mb-2">Customer Support</h4>
              <p className="text-sm text-brand-charcoal/60">Available to assist you</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <Truck className="w-8 h-8 stroke-[1] text-brand-gold mb-4" />
              <h4 className="uppercase tracking-widest text-xs font-bold mb-2">Nationwide Delivery</h4>
              <p className="text-sm text-brand-charcoal/60">Shipping across Pakistan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-black text-brand-ivory py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <span className="font-serif font-bold text-2xl tracking-widest mb-6 block">
              MARCO MEN
            </span>
            <p className="text-brand-ivory/60 text-sm leading-relaxed mb-6">
              Elevating men's everyday style with premium accessories crafted with uncompromising quality and timeless design.
            </p>
            <div className="text-xs text-brand-ivory/60">
              PKR | Pakistan
            </div>
          </div>
          <div>
            <h4 className="uppercase tracking-widest text-xs font-bold mb-6 text-brand-gold">Shop</h4>
            <ul className="space-y-4 text-sm text-brand-ivory/70">
              <li><Link href="#" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Wallets</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Belts</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Watches</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="uppercase tracking-widest text-xs font-bold mb-6 text-brand-gold">Customer Care</h4>
            <ul className="space-y-4 text-sm text-brand-ivory/70">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="uppercase tracking-widest text-xs font-bold mb-6 text-brand-gold">About</h4>
            <ul className="space-y-4 text-sm text-brand-ivory/70">
              <li><Link href="#" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-brand-ivory/40">
          <p>&copy; {new Date().getFullYear()} MARCO MEN. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

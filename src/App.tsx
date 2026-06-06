import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  ChevronRight,
  Eye,
  Volume2,
  Tv,
  ChevronLeft,
  User as UserIcon,
  LogOut,
  Mail,
  Lock,
  Loader2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

import { supabase } from './supabaseClient';
import LiquidChrome from './components/LiquidChrome/LiquidChrome';
import DecayCard from './components/DecayCard/DecayCard';
import BlurText from './components/BlurText/BlurText';
import ShinyText from './components/ShinyText/ShinyText';
import SpotlightCard from './components/SpotlightCard/SpotlightCard';
import ClickSpark from './components/ClickSpark/ClickSpark';
import StarBorder from './components/StarBorder/StarBorder';
import GlassSurface from './components/GlassSurface/GlassSurface';

import './App.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
  specs: Record<string, string>;
}

const PRODUCTS: Product[] = [
  // wearables
  {
    id: 'lume-ring',
    name: 'Lume Smart Ring',
    category: 'wearables',
    price: 349,
    image: '/assets/products/lume_ring.png',
    badge: 'Flagship',
    description: 'Constructed from a single piece of tempered sapphire glass with embedded micro-circuitry. The Lume Ring tracks biometric data while projecting a subtle neon-cyan aura.',
    specs: {
      "Material": "Tempered Sapphire Glass",
      "Biometrics": "Heart, HRV, Sleep, SpO2",
      "Battery Life": "Up to 5 Days",
      "Aura Projection": "Neon Cyan OLED"
    }
  },
  {
    id: 'vesper-watch',
    name: 'Vesper Luminous Watch',
    category: 'wearables',
    price: 599,
    image: '/assets/products/vesper_watch.png',
    badge: 'Conceptual',
    description: 'A high-end luxury smartwatch. The entire watch chassis is made of transparent crystal, revealing the mechanical-digital hybrid movements that sweep with pink neon luminescence.',
    specs: {
      "Chassis": "Synthetic Sapphire Crystal",
      "Display Type": "Luminous Micro-LED Face",
      "Water Resistance": "5ATM (50 meters)",
      "Charging": "Magnetic Induction Rapid"
    }
  },
  // audio
  {
    id: 'aero-pods',
    name: 'Aero Sound Pods',
    category: 'audio',
    price: 299,
    image: '/assets/products/aero_pods.png',
    badge: 'Clear Sound',
    description: 'Housed in a transparent acrylic shell that displays the high-fidelity sound engines. Aero Pods feature intelligent active noise cancellation and a spatial audio soundstage.',
    specs: {
      "Driver": "11mm Custom Dynamic Driver",
      "ANC": "Up to 45dB Intelligent Cancellation",
      "Latency": "48ms Ultra-Low Latency",
      "Charging": "USB-C, Wireless Qi"
    }
  },
  {
    id: 'orbit-headphones',
    name: 'Orbit Glass Headphones',
    category: 'audio',
    price: 449,
    image: '/assets/products/orbit_headphones.png',
    badge: 'New Release',
    description: 'Luxury over-ear headphones made of transparent glass and polished chrome. Features glowing neon violet audio drivers inside clear earcups, delivering immersive high-res spatial audio.',
    specs: {
      "Structure": "Transparent Tempered Glass & Aluminum",
      "Driver Diameter": "40mm Custom Laminated",
      "Frequency Response": "5Hz - 40kHz High-Res",
      "ANC Mode": "Adaptive Hybrid ANC"
    }
  },
  {
    id: 'sonic-orb',
    name: 'Sonic Levitating Speaker',
    category: 'audio',
    price: 199,
    image: '/assets/products/sonic_orb.png',
    badge: 'Tech-Art',
    description: 'A spherical glass speaker levitating over a black glass dock with a circular glowing neon cyan base ring. Projects deep omnidirectional audio and syncs ambient light patterns with music.',
    specs: {
      "Chassis": "Acrylic & Chrome Sphere",
      "Acoustic Range": "360-Degree Omnidirectional Sound",
      "Levitation Height": "15mm Magnetic Suspension",
      "Sync Type": "Sound-to-Light Pulsing Grid"
    }
  },
  // displays
  {
    id: 'nova-glasses',
    name: 'Nova AR Eyewear',
    category: 'displays',
    price: 899,
    image: '/assets/products/nova_glasses.png',
    badge: 'New Tech',
    description: 'Sleek spatial computing smart eyewear. Features transparent curved lenses that project high-resolution AR interfaces directly onto your field of vision with zero latency.',
    specs: {
      "Display Tech": "Dual micro-OLED Waveguide",
      "Field of Vision": "52 Degrees",
      "Unit Weight": "68 Grams",
      "Wireless": "Wi-Fi 6E, Bluetooth 5.3"
    }
  },
  {
    id: 'prism-display',
    name: 'Prism Holographic Monitor',
    category: 'displays',
    price: 1299,
    image: '/assets/products/prism_display.png',
    badge: 'Volumetric',
    description: 'Sleek computer monitor display made of completely transparent glass. Projects a glowing, futuristic colorful neon UI screen directly in mid-air with volumetric holographic rendering.',
    specs: {
      "Optics Type": "Refractive Holographic Glass",
      "Display Width": "27-inch Volumetric Pane",
      "Peak Lumens": "1200 Nits",
      "Interface IO": "Thunderbolt 4, OpticLink"
    }
  },
  // objects
  {
    id: 'liquid-hourglass',
    name: 'Liquid Hourglass Timer',
    category: 'objects',
    price: 149,
    image: '/assets/products/liquid_hourglass.png',
    badge: 'Studio Art',
    description: 'Designer glass hourglass containing swirling black magnetic fluid (ferrofluid) droplets. Create stunning structural spikes and shifting fluid patterns on a dark metallic base.',
    specs: {
      "Vessel": "Borosilicate Glass Shell",
      "Medium": "High-Density Suspended Ferrofluid",
      "Base Support": "Neodymium Magnet Core Ring",
      "Chassis Finish": "Satin Anodized Aluminum"
    }
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('glas_cart');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse cart from localStorage:', e);
        }
      }
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Navigation View Switching
  const [currentView, setCurrentView] = useState<string>('home');
  
  // Scrolled nav effect
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('glas_cart', JSON.stringify(cart));
  }, [cart]);

  const mapDbItemsToCart = (dbItems: any[]): CartItem[] => {
    return dbItems
      .map(dbItem => {
        const product = PRODUCTS.find(p => p.id === dbItem.product_id);
        if (!product) return null;
        return {
          product,
          quantity: dbItem.quantity
        };
      })
      .filter((item): item is CartItem => item !== null);
  };

  // Supabase Auth States
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'verification-sent'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ text, type });
  };

  // Toast Auto-Dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Countdown timer for email verification resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Auto-close modal when logged in
  useEffect(() => {
    if (user && isAuthModalOpen) {
      setIsAuthModalOpen(false);
      showToast(`Welcome! You are logged in.`, 'success');
    }
  }, [user, isAuthModalOpen]);

  // Monitor Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync Cart with Supabase when user authentication state changes
  useEffect(() => {
    const syncCart = async () => {
      if (!user) return;

      try {
        // Fetch current database cart
        const { data: dbItems, error: fetchError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (fetchError) {
          console.warn('Error fetching cart from database (make sure the cart_items table is created):', fetchError.message);
          return;
        }

        // Check if there are local guest items in localStorage to merge
        const stored = localStorage.getItem('glas_cart');
        const guestItems: CartItem[] = stored ? JSON.parse(stored) : [];

        if (guestItems.length > 0) {
          // Merge guest items into the database
          for (const guestItem of guestItems) {
            const existingDbItem = dbItems?.find(item => item.product_id === guestItem.product.id);
            if (existingDbItem) {
              // Upsert with merged quantity
              await supabase
                .from('cart_items')
                .upsert({
                  user_id: user.id,
                  product_id: guestItem.product.id,
                  quantity: existingDbItem.quantity + guestItem.quantity
                }, { onConflict: 'user_id,product_id' });
            } else {
              // Insert new item
              await supabase
                .from('cart_items')
                .insert({
                  user_id: user.id,
                  product_id: guestItem.product.id,
                  quantity: guestItem.quantity
                });
            }
          }
          // Clear guest cart from localStorage now that it is merged
          localStorage.removeItem('glas_cart');

          // Fetch the final merged database cart
          const { data: mergedItems } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);
          
          setCart(mapDbItemsToCart(mergedItems || []));
        } else {
          // No guest items to merge: load standard DB cart
          setCart(mapDbItemsToCart(dbItems || []));
        }
      } catch (err) {
        console.error('Cart database sync error:', err);
      }
    };

    syncCart();
  }, [user]);

  // Resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      showToast('Please enter your email address first.', 'error');
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      showToast('Verification email resent successfully! Check your inbox.', 'success');
      setResendCountdown(60);
    } catch (err: any) {
      showToast(err.message || 'Failed to resend verification email.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Google OAuth Log In
  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthMessage(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Google Auth initiation failed.' });
      setAuthLoading(false);
    }
  };

  // Email Sign In / Sign Up
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setAuthLoading(true);
    setAuthMessage(null);

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthMessage({ type: 'success', text: 'Successfully logged in!' });
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setAuthMessage(null);
        }, 1200);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        setAuthMode('verification-sent');
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Authentication failed.' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileDropdownOpen(false);
    setCart([]);
    localStorage.removeItem('glas_cart');
  };

  // Cart operations
  const addToCart = async (product: Product) => {
    let newQty = 1;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        newQty = existing.quantity + 1;
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: product.id,
            quantity: newQty
          }, { onConflict: 'user_id,product_id' });
      } catch (err) {
        console.error('Error adding to database cart:', err);
      }
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    let newQty = 0;
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });

    if (user) {
      try {
        if (newQty > 0) {
          await supabase
            .from('cart_items')
            .upsert({
              user_id: user.id,
              product_id: productId,
              quantity: newQty
            }, { onConflict: 'user_id,product_id' });
        } else {
          await supabase
            .from('cart_items')
            .delete()
            .match({ user_id: user.id, product_id: productId });
        }
      } catch (err) {
        console.error('Error updating database cart:', err);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .match({ user_id: user.id, product_id: productId });
      } catch (err) {
        console.error('Error removing from database cart:', err);
      }
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const getFilteredProducts = (category: string) => {
    return PRODUCTS.filter(product => {
      const matchesCategory = product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const activeCategoryTheme = () => {
    switch (currentView) {
      case 'category-wearables':
        return {
          accent: 'var(--accent-cyan)',
          rgb: '0, 243, 255',
          label: 'HIGH-END DYNAMIC HARDWARE',
          title: 'BIOMETRIC WEARABLES',
          desc: 'Luxury smart rings and watches engineered from synthetic sapphire crystals and precise digital modules.'
        };
      case 'category-audio':
        return {
          accent: 'var(--accent-purple)',
          rgb: '179, 114, 255',
          label: 'ACOUSTIC PROPULSION ENGINES',
          title: 'AUDIO SOLUTIONS',
          desc: 'High-fidelity audio drivers, transparent sound chambers, and levitating soundboards designed for spatial acoustics.'
        };
      case 'category-displays':
        return {
          accent: 'var(--accent-pink)',
          rgb: '255, 46, 147',
          label: 'SPATIAL HOLOGRAPH OPTICS',
          title: 'DISPLAY HARDWARE',
          desc: 'Volumetric glass monitors and waveguide lenses engineered to project high-luminance computing environments.'
        };
      case 'category-objects':
        return {
          accent: 'var(--accent-emerald)',
          rgb: '0, 255, 170',
          label: 'THERMODYNAMIC FLUIDICS',
          title: 'KINETIC SCULPTURES',
          desc: 'Conceptual borosilicate glassware containing high-density ferrofluid suspenders responding to magnetic loops.'
        };
      default:
        return {
          accent: 'var(--accent-cyan)',
          rgb: '0, 243, 255',
          label: 'CONCEPTUAL HARDWARE STORE',
          title: 'THE GLAS COLLECTION',
          desc: ''
        };
    }
  };

  const theme = activeCategoryTheme();

  return (
    <ClickSpark sparkColor={theme.accent} sparkSize={10} sparkRadius={18} sparkCount={9} duration={400}>
      {/* Dynamic LiquidChrome Metallic Backdrop */}
      <div className="bg-canvas-container">
        <LiquidChrome 
          baseColor={
            currentView === 'category-audio' ? [0.03, 0.01, 0.06] : 
            currentView === 'category-displays' ? [0.06, 0.01, 0.03] : 
            currentView === 'category-objects' ? [0.01, 0.04, 0.02] : 
            [0.01, 0.02, 0.05]
          } 
          speed={0.12} 
          amplitude={0.55} 
          frequencyX={2.4} 
          frequencyY={1.8} 
          interactive={true} 
        />
      </div>

      {/* Sticky Navigation Header */}
      <header className={isScrolled ? 'header-active' : ''}>
        <GlassSurface
          width="100%"
          height={isScrolled ? 64 : 72}
          borderRadius={14}
          borderWidth={0.05}
          brightness={isScrolled ? 30 : 45}
          opacity={isScrolled ? 0.94 : 0.85}
          blur={isScrolled ? 20 : 10}
          displace={isScrolled ? 3 : 1}
          backgroundOpacity={isScrolled ? 0.25 : 0.08}
          saturation={1.6}
          distortionScale={-130}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          xChannel="R"
          yChannel="G"
          mixBlendMode="difference"
          style={{
            maxWidth: '1400px',
            width: '100%',
            pointerEvents: 'auto',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'visible'
          }}
        >
          <div className="container nav-wrapper">
            <a className="logo" onClick={() => setCurrentView('home')}>
              <Layers size={28} style={{ color: theme.accent }} />
              GLAS
            </a>

            <nav>
              <ul className="nav-links">
                <li><a className={currentView === 'home' ? 'active' : ''} onClick={() => setCurrentView('home')}>Home</a></li>
                <li><a className={currentView.startsWith('category-') ? 'active' : ''} onClick={() => {
                  const psec = document.getElementById('catalogue-section');
                  if (psec) psec.scrollIntoView({ behavior: 'smooth' });
                  else setCurrentView('category-wearables');
                }}>Catalogue</a></li>
                <li><a onClick={() => {
                  const sec = document.getElementById('about-section');
                  sec?.scrollIntoView({ behavior: 'smooth' });
                }}>Manifesto</a></li>
              </ul>
            </nav>

            <div className="nav-actions">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search specs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '20px',
                    padding: '0.4rem 1rem 0.4rem 2.2rem',
                    fontSize: '0.85rem',
                    color: 'white',
                    width: '180px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.accent;
                    e.target.style.width = '240px';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    if (!searchQuery) e.target.style.width = '180px';
                  }}
                />
                <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              </div>
              
              <button className="icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Open Cart">
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>

              {/* Profile / Account Control */}
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button 
                    className="icon-btn" 
                    onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                    style={{ border: `1px solid ${theme.accent}` }}
                    aria-label="Account Settings"
                  >
                    <UserIcon size={18} style={{ color: theme.accent }} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '3.2rem',
                      right: 0,
                      width: '260px',
                      background: 'rgba(10, 10, 12, 0.95)',
                      backdropFilter: 'blur(30px)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      zIndex: 100
                    }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>LOGGED IN AS</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.user_metadata?.full_name || user.email}
                        </p>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                      <button 
                        onClick={handleSignOut}
                        style={{
                          background: 'rgba(255, 46, 147, 0.1)',
                          border: '1px solid var(--accent-pink)',
                          color: 'var(--accent-pink)',
                          padding: '0.5rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthMessage(null);
                    setIsAuthModalOpen(true);
                  }}
                  style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '15px' }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </GlassSurface>
      </header>

      {/* Sub-Header Category Nav bar, sticky when category view is active */}
      {currentView.startsWith('category-') && (
        <ul className="category-indicator-bar" style={{ '--active-accent': theme.accent } as React.CSSProperties}>
          <li>
            <a 
              className={currentView === 'category-wearables' ? 'active' : ''} 
              onClick={() => setCurrentView('category-wearables')}
            >
              Wearables <span className="tab-badge">{PRODUCTS.filter(p => p.category === 'wearables').length}</span>
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'category-audio' ? 'active' : ''} 
              onClick={() => setCurrentView('category-audio')}
            >
              Audio <span className="tab-badge">{PRODUCTS.filter(p => p.category === 'audio').length}</span>
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'category-displays' ? 'active' : ''} 
              onClick={() => setCurrentView('category-displays')}
            >
              Displays <span className="tab-badge">{PRODUCTS.filter(p => p.category === 'displays').length}</span>
            </a>
          </li>
          <li>
            <a 
              className={currentView === 'category-objects' ? 'active' : ''} 
              onClick={() => setCurrentView('category-objects')}
            >
              Objects <span className="tab-badge">{PRODUCTS.filter(p => p.category === 'objects').length}</span>
            </a>
          </li>
        </ul>
      )}

      {/* MAIN HOMEPAGE VIEW */}
      {currentView === 'home' && (
        <>
          {/* Main Hero */}
          <section className="hero-sec">
            <div className="container hero-grid">
              <div className="hero-content">
                <div className="hero-subtitle">
                  <ShinyText text="PREMIUM CYBERNETIC STOREFRONT" speed={3} color="var(--accent-cyan)" shineColor="#ffffff" />
                </div>
                <div className="hero-title-container">
                  <BlurText 
                    text="LIQUID GLASS" 
                    delay={80}
                    animateBy="words"
                    direction="top"
                    className="hero-title-main"
                  />
                  <span className="hero-title-accent">HARDWARE CATALOGUE.</span>
                </div>
                
                <p className="hero-desc">
                  Explore a professional, high-fidelity portfolio of smart rings, waveguide AR eyewear, levitating speakers, and kinetic fluid containers synced with modern styling variables.
                </p>

                <div className="hero-cta">
                  <StarBorder color="var(--accent-cyan)" speed="5s" onClick={() => {
                    const sec = document.getElementById('catalogue-section');
                    sec?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Browse Catalogue
                    <ChevronRight size={16} />
                  </StarBorder>
                  {!user && (
                    <button className="btn-secondary" onClick={() => {
                      setAuthMode('signin');
                      setIsAuthModalOpen(true);
                    }}>
                      Create Account
                    </button>
                  )}
                </div>
              </div>

              <div className="hero-showcase">
                <div className="showcase-glow"></div>
                <DecayCard 
                  width={340} 
                  height={440} 
                  image="/assets/products/lume_ring.png" 
                  baseFrequency={0.012}
                  numOctaves={4}
                  seed={5}
                  maxDisplacement={350}
                  movementBound={60}
                >
                  <div style={{
                    color: 'white',
                    fontFamily: 'var(--heading)',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    lineHeight: '1.2'
                  }}>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--mono)', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.5rem', letterSpacing: '2px' }}>AETHER HARDWARE</span>
                    LUME<br />SMART RING
                  </div>
                </DecayCard>
              </div>
            </div>
          </section>

          {/* Partner marquee */}
          <section className="logo-marquee-sec">
            <div className="logo-marquee-wrapper">
              <div className="logo-marquee-track">
                <div className="marquee-item"><Cpu size={18} className="accent-cyan"/> SECURE CLOUD AUTH</div>
                <div className="marquee-item"><Layers size={18} className="accent-purple"/> SUPABASE DATABASE</div>
                <div className="marquee-item"><Sparkles size={18} className="accent-pink"/> ULTRA REFRACTIVE</div>
                <div className="marquee-item"><Volume2 size={18} className="accent-emerald"/> ACOUSTIC LAB</div>
                <div className="marquee-item"><Tv size={18} className="accent-cyan"/> WAVEGUIDE DISPLAY</div>
              </div>
              <div className="logo-marquee-track">
                <div className="marquee-item"><Cpu size={18} className="accent-cyan"/> SECURE CLOUD AUTH</div>
                <div className="marquee-item"><Layers size={18} className="accent-purple"/> SUPABASE DATABASE</div>
                <div className="marquee-item"><Sparkles size={18} className="accent-pink"/> ULTRA REFRACTIVE</div>
                <div className="marquee-item"><Volume2 size={18} className="accent-emerald"/> ACOUSTIC LAB</div>
                <div className="marquee-item"><Tv size={18} className="accent-cyan"/> WAVEGUIDE DISPLAY</div>
              </div>
            </div>
          </section>

          {/* Separated Categories Promo Section */}
          <section className="category-promo-section" id="catalogue-section">
            <div className="container">
              <div className="sec-header">
                <span className="hero-subtitle">CORE PRODUCTS CATALOGUE</span>
                <h2 className="sec-title">THE HARDWARE SEGMENTS</h2>
                <p className="sec-desc">Aesthetic, high-fidelity solutions backed by database syncing.</p>
              </div>

              <div className="category-cards-grid">
                <div 
                  className="category-promo-card" 
                  style={{ '--card-accent': 'var(--accent-cyan)', '--card-accent-rgb': '0, 243, 255' } as React.CSSProperties}
                  onClick={() => {
                    setCurrentView('category-wearables');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                >
                  <div className="cat-card-num">01 / GEAR</div>
                  <div>
                    <h3 className="cat-card-title">WEARABLES</h3>
                    <p className="cat-card-desc">Biometrics embedded in tempered crystal rings and luxury mechanical smartwatches.</p>
                  </div>
                  <div className="cat-card-action">
                    Open Suite <ChevronRight size={14} />
                  </div>
                </div>

                <div 
                  className="category-promo-card" 
                  style={{ '--card-accent': 'var(--accent-purple)', '--card-accent-rgb': '179, 114, 255' } as React.CSSProperties}
                  onClick={() => {
                    setCurrentView('category-audio');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                >
                  <div className="cat-card-num">02 / SOUND</div>
                  <div>
                    <h3 className="cat-card-title">AUDIO</h3>
                    <p className="cat-card-desc">Acrylic shell headphones and levitating acoustic spheres syncing soundwaves with neon light.</p>
                  </div>
                  <div className="cat-card-action">
                    Open Suite <ChevronRight size={14} />
                  </div>
                </div>

                <div 
                  className="category-promo-card" 
                  style={{ '--card-accent': 'var(--accent-pink)', '--card-accent-rgb': '255, 46, 147' } as React.CSSProperties}
                  onClick={() => {
                    setCurrentView('category-displays');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                >
                  <div className="cat-card-num">03 / DISPLAY</div>
                  <div>
                    <h3 className="cat-card-title">DISPLAYS</h3>
                    <p className="cat-card-desc">Holographic computer displays and smart AR eyewear with micro-OLED waveguides.</p>
                  </div>
                  <div className="cat-card-action">
                    Open Suite <ChevronRight size={14} />
                  </div>
                </div>

                <div 
                  className="category-promo-card" 
                  style={{ '--card-accent': 'var(--accent-emerald)', '--card-accent-rgb': '0, 255, 170' } as React.CSSProperties}
                  onClick={() => {
                    setCurrentView('category-objects');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                >
                  <div className="cat-card-num">04 / KINETIC</div>
                  <div>
                    <h3 className="cat-card-title">ART PIECES</h3>
                    <p className="cat-card-desc">Glass hourglasses holding magnetic ferrofluid droplets forming shifting visual structures.</p>
                  </div>
                  <div className="cat-card-action">
                    Open Suite <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* DEDICATED CATEGORY PAGES */}
      {currentView.startsWith('category-') && (
        <section className="category-hero-sec" style={{ '--active-accent': theme.accent, '--active-accent-rgb': theme.rgb } as React.CSSProperties}>
          <div className="container category-hero-grid">
            <div className="hero-content">
              <button 
                onClick={() => setCurrentView('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--mono)',
                  marginBottom: '1rem',
                  width: 'fit-content'
                }}
              >
                <ChevronLeft size={14} /> BACK TO HOME
              </button>
              
              <span className="hero-subtitle" style={{ color: theme.accent }}>{theme.label}</span>
              <h1 className="hero-title-main" style={{ textShadow: `0 0 40px rgba(${theme.rgb}, 0.1)` }}>{theme.title}</h1>
              
              <div className="category-desc-box" style={{ '--active-accent': theme.accent } as React.CSSProperties}>
                <p className="hero-desc" style={{ color: 'var(--text-main)' }}>{theme.desc}</p>
              </div>
            </div>

            {/* Custom Interactive Information Widgets instead of Hacker Glitches */}
            <div>
              {currentView === 'category-wearables' && (
                <div style={{
                  background: 'rgba(10, 10, 12, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  maxWidth: '380px',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>SPECIFICATION NOTE</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Tempered sapphire glass wearables require specialized sizing rings. We ship a calibration template box with every smart biometric order to ensure exact fitting.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'white' }}>CALIBRATION KIT</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>FREE WITH PURCHASE</span>
                  </div>
                </div>
              )}

              {currentView === 'category-audio' && (
                <div style={{
                  background: 'rgba(10, 10, 12, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  maxWidth: '380px',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>ACOUSTICS CALIBRATION</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Equipped with dynamic active noise profiling. Built-in micro-microphones scan auditory channels to calibrate equalizers for your unique canal shape.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'white' }}>LATENCY RATE</span>
                    <span style={{ color: 'var(--accent-purple)' }}>48ms DUAL-CHANNEL</span>
                  </div>
                </div>
              )}

              {currentView === 'category-displays' && (
                <div style={{
                  background: 'rgba(10, 10, 12, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  maxWidth: '380px',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>COMPATIBLE ENVIRONMENTS</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Volumetric glass sheets hook directly into macOS (Sonoma or newer) and Windows 11 spatial pipelines, casting window monitors into solid workspaces.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'white' }}>SPATIAL LINK</span>
                    <span style={{ color: 'var(--accent-pink)' }}>USB-C DISP & POWER</span>
                  </div>
                </div>
              )}

              {currentView === 'category-objects' && (
                <div style={{
                  background: 'rgba(10, 10, 12, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  maxWidth: '380px',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>MEDIUM SPECIFICS</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Hourglasses use high-density suspended colloidal ferrofluid in premium aqueous solution. Keep away from magnetic fields exceeding 2.5 Tesla.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'white' }}>CLEANING CARE</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>MICROFIBER WIPING ONLY</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Grid listing section for separate category pages */}
      {currentView.startsWith('category-') && (
        <section className="products-sec" style={{ background: 'var(--bg-darker)' }}>
          <div className="container">
            <div className="sec-header">
              <h2 className="sec-title">PRODUCTS IN THIS SUITE</h2>
              <p className="sec-desc">Aesthetic conceptual technology items listed under this category.</p>
            </div>

            <div className="products-grid">
              {getFilteredProducts(currentView.replace('category-', '')).map(product => (
                <div key={product.id} className="product-card-wrapper">
                  <SpotlightCard className="product-card-glass" spotlightColor={`rgba(${theme.rgb}, 0.15)`}>
                    {product.badge && (
                      <span className="product-badge" style={{ color: theme.accent, borderColor: theme.accent, background: `rgba(${theme.rgb}, 0.15)` }}>
                        {product.badge}
                      </span>
                    )}
                    
                    <div className="product-image-container" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                      <img src={product.image} alt={product.name} className="product-image" />
                    </div>

                    <div className="product-info">
                      <div className="product-title-row">
                        <span className="product-category" style={{ color: theme.accent }}>{product.category}</span>
                        <h3 className="product-name">{product.name}</h3>
                      </div>

                      <div className="product-footer">
                        <span className="product-price">${product.price}</span>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button 
                            className="add-cart-btn" 
                            onClick={() => setSelectedProduct(product)}
                            title="View Details"
                            aria-label="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="add-cart-btn" 
                            onClick={() => addToCart(product)}
                            title="Add to Cart"
                            aria-label="Add to Cart"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Concept / About Section */}
      <section className="products-sec" id="about-section" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="sec-header">
            <span className="hero-subtitle">OUR DESIGN MANIFESTO</span>
            <h2 className="sec-title">BENDING LIGHT, CAPTURING ACOUSTICS</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Cpu size={24} style={{ color: 'var(--accent-cyan)' }} />
              <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.2rem', fontWeight: 600 }}>SECURE CLOUD AUTH</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                All user accounts are authenticated directly using Supabase secure cryptography, sync'd with direct Google OAuth redirects.
              </p>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Layers size={24} style={{ color: 'var(--accent-purple)' }} />
              <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.2rem', fontWeight: 600 }}>GLASSMORPHIC FINISH</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Real-time refraction mapping, chromatic aberrations, and soft-focus frosted layers combine to create a digital interface that feels truly physical.
              </p>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Sparkles size={24} style={{ color: 'var(--accent-pink)' }} />
              <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.2rem', fontWeight: 600 }}>METALLIC BACKDROP</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Cursor-following spotlights, staggering header reveals, and liquid metallic flows simulate the natural, organic movement of fluid media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Cart Side Drawer */}
      <div className={`cart-drawer-backdrop ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h3 className="cart-title">YOUR BAG</h3>
            <button className="icon-btn" onClick={() => setIsCartOpen(false)} aria-label="Close Cart">
              <X size={18} />
            </button>
          </div>

          <div className="cart-items-list">
            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <ShoppingBag size={48} style={{ opacity: 0.2 }} />
                <p>Your bag is empty.</p>
                <button className="btn-secondary" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-image-wrapper">
                    <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                  </div>
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <span className="cart-item-price">${item.product.price}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div className="cart-item-controls">
                      <button className="cart-control-btn" onClick={() => updateQuantity(item.product.id, -1)}>
                        <Minus size={12} />
                      </button>
                      <span className="cart-item-qty">{item.quantity}</span>
                      <button className="cart-control-btn" onClick={() => updateQuantity(item.product.id, 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.product.id)} aria-label="Remove item">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Subtotal</span>
                <span className="cart-summary-value">${cartSubtotal}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Shipping and custom import taxes calculated at checkout. Real-time encryption active.
              </p>
              
              <StarBorder color={theme.accent} speed="5s" thickness={2} className="checkout-btn" onClick={() => showToast('Proceeding to conceptual secure checkout... Thank you for exploring GLAS!', 'success')}>
                Secure Checkout
                <ArrowRight size={16} />
              </StarBorder>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <div className={`modal-backdrop ${selectedProduct ? 'active' : ''}`} onClick={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="modal-content-glass" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn modal-close-btn" onClick={() => setSelectedProduct(null)} aria-label="Close details">
              <X size={18} />
            </button>

            <div className="modal-grid">
              <div className="modal-image-sec">
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxWidth: '80%', maxHeight: '320px', objectFit: 'contain' }} />
              </div>

              <div className="modal-info-sec">
                <div>
                  <span className="modal-category" style={{ color: theme.accent }}>{selectedProduct.category}</span>
                  <h3 className="modal-title">{selectedProduct.name}</h3>
                </div>
                
                <span className="modal-price">${selectedProduct.price}</span>
                
                <p className="modal-desc">{selectedProduct.description}</p>

                <div className="modal-spec-row">
                  {Object.entries(selectedProduct.specs).map(([label, val]) => (
                    <div className="modal-spec-item" key={label}>
                      <span className="modal-spec-label">{label}</span>
                      <span className="modal-spec-value">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="modal-action-row">
                  <StarBorder color={theme.accent} speed="4s" style={{ width: '100%' }} onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}>
                    Add to Bag
                    <ShoppingBag size={16} />
                  </StarBorder>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Authentication Dialog */}
      <div className={`modal-backdrop ${isAuthModalOpen ? 'active' : ''}`} onClick={() => setIsAuthModalOpen(false)}>
        <div className="modal-content-glass" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', minHeight: 'auto', padding: '2.5rem' }}>
          <button className="icon-btn modal-close-btn" onClick={() => setIsAuthModalOpen(false)} aria-label="Close authentication">
            <X size={18} />
          </button>

          {authMode === 'verification-sent' ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
              <div style={{
                position: 'relative',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.05)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                animation: 'pulseGlow 3s infinite ease-in-out'
              }}>
                <Mail size={32} style={{ color: theme.accent }} />
              </div>
              
              <div>
                <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.4rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>Confirm Your Email</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                  We have sent a verification link to <strong style={{ color: 'white' }}>{email}</strong>.
                </p>
              </div>

              {/* Awaiting Confirmation Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--mono)',
                color: 'var(--accent-cyan)',
                background: 'rgba(0, 240, 255, 0.05)',
                border: '1px solid rgba(0, 240, 255, 0.1)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                width: 'fit-content',
                margin: '0 auto'
              }}>
                <span className="pulse-dot" style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 8px var(--accent-cyan)',
                  display: 'inline-block',
                  animation: 'pulseGlow 1.5s infinite'
                }} />
                AWAITING CONFIRMATION
              </div>

              {/* Checklist */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.1rem',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                lineHeight: '1.5'
              }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ color: theme.accent, fontWeight: 'bold', fontFamily: 'var(--mono)' }}>01</span>
                  <span>Open your inbox and search for verification email from GLAS.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ color: theme.accent, fontWeight: 'bold', fontFamily: 'var(--mono)' }}>02</span>
                  <span>Click the confirmation link. (It will redirect you back here).</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ color: theme.accent, fontWeight: 'bold', fontFamily: 'var(--mono)' }}>03</span>
                  <span>Once confirmed, click <strong>Proceed to Login</strong> below.</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', borderRadius: '12px', fontWeight: 'bold' }}
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthMessage({ type: 'success', text: 'Email verified? Great! Please enter your password to sign in.' });
                  }}
                >
                  Proceed to Login
                  <ArrowRight size={16} />
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', fontSize: '0.8rem', justifyContent: 'center' }}
                    onClick={async () => {
                      setAuthLoading(true);
                      const { data: { session } } = await supabase.auth.getSession();
                      if (session) {
                        setUser(session.user);
                        setIsAuthModalOpen(false);
                        showToast('Welcome! Your email has been verified.', 'success');
                      } else {
                        showToast('Verification pending. Please verify your email first or check spam.', 'error');
                      }
                      setAuthLoading(false);
                    }}
                    disabled={authLoading}
                  >
                    {authLoading ? <Loader2 size={14} className="animate-spin" /> : "Check Status"}
                  </button>

                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', fontSize: '0.8rem', justifyContent: 'center' }}
                    onClick={handleResendVerification}
                    disabled={authLoading || resendCountdown > 0}
                  >
                    {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : 'Resend Email'}
                  </button>
                </div>

                <button 
                  type="button" 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginTop: '0.25rem'
                  }}
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthMessage(null);
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Layers size={36} style={{ color: theme.accent, margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontFamily: 'var(--heading)', fontSize: '1.75rem', fontWeight: 800 }}>
                  {authMode === 'signin' ? 'Sign In to GLAS' : 'Create Account'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Access saved profiles and track order deliveries.
                </p>
              </div>

              {/* Social Auth Trigger */}
              <button 
                type="button"
                className="btn-secondary"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  fontWeight: '600',
                  padding: '0.75rem',
                  borderRadius: '12px'
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-6.16-4.53z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <hr style={{ flexGrow: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>OR</span>
                <hr style={{ flexGrow: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
              </div>

              <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {authMode === 'signup' && (
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  </div>
                )}

                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                </div>

                <div style={{ position: 'relative' }}>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                </div>

                {authMessage && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{
                      background: authMessage.type === 'error' ? 'rgba(255, 46, 147, 0.1)' : 'rgba(0, 255, 170, 0.1)',
                      border: `1px solid ${authMessage.type === 'error' ? 'var(--accent-pink)' : 'var(--accent-emerald)'}`,
                      color: authMessage.type === 'error' ? 'var(--accent-pink)' : 'var(--accent-emerald)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {authMessage.type === 'success' ? <CheckCircle size={14} /> : <HelpCircle size={14} />}
                      <span>{authMessage.text}</span>
                    </div>
                    {authMessage.type === 'error' && authMessage.text.toLowerCase().includes('confirm') && (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={authLoading || resendCountdown > 0}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          color: theme.accent,
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {authLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                        {resendCountdown > 0 ? `Resend link in ${resendCountdown}s` : 'Resend Verification Link'}
                      </button>
                    )}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={authLoading}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '12px', marginTop: '0.5rem' }}
                >
                  {authLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : authMode === 'signin' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
                {authMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button 
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    setAuthMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.accent,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {authMode === 'signin' ? 'Register' : 'Log In'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="container">
        <footer>
          <a className="footer-logo" onClick={() => setCurrentView('home')}>GLAS</a>
          <ul className="footer-links">
            <li><a onClick={() => setCurrentView('home')}>Home</a></li>
            <li><a onClick={() => {
              setCurrentView('category-wearables');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>Catalogue</a></li>
            <li><a onClick={() => {
              const sec = document.getElementById('about-section');
              sec?.scrollIntoView({ behavior: 'smooth' });
            }}>Manifesto</a></li>
          </ul>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)' }} /> Secure Checkout
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: theme.accent }} /> Luminous Design
            </span>
          </div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} GLAS CONCEPT INC. ALL RIGHTS RESERVED. BENT IN LIGHT.
          </p>
        </footer>
      </div>

      {/* Premium Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'rgba(10, 10, 12, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${
            toast.type === 'success' 
              ? 'rgba(0, 255, 170, 0.3)' 
              : toast.type === 'error' 
                ? 'rgba(255, 46, 147, 0.3)' 
                : 'rgba(255, 255, 255, 0.15)'
          }`,
          borderRadius: '16px',
          padding: '0.85rem 1.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: 500,
          animation: 'slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          pointerEvents: 'none'
        }}>
          {toast.type === 'success' && <CheckCircle size={16} style={{ color: 'var(--accent-emerald)' }} />}
          {toast.type === 'error' && <HelpCircle size={16} style={{ color: 'var(--accent-pink)' }} />}
          {toast.type === 'info' && <Sparkles size={16} style={{ color: theme.accent }} />}
          <span>{toast.text}</span>
        </div>
      )}
    </ClickSpark>
  );
}

export default App;

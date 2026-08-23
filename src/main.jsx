import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, Filter, Heart, Menu, Minus, Plus,
  Search, ShoppingBag, Sparkles, Star, Trash2, Truck, X, Zap
} from "lucide-react";
import "./index.css";

const products = [
  {
    id: "fb-tee-001", name: "BLING SIGNATURE TEE", category: "T-shirts", price: 8500,
    sizes: ["S","M","L","XL","XXL"], badge: "BEST SELLER",
    description: "T-shirt premium en coton lourd, coupe streetwear et marquage FIRST BLING ton sur ton.",
    material: "100% coton premium 240 g/m²", color: "Noir / Or",
    image: "/products/signature-tee.svg"
  },
  {
    id: "fb-tee-002", name: "GOLD LINE TEE", category: "T-shirts", price: 7500,
    sizes: ["S","M","L","XL"], badge: "NEW",
    description: "Silhouette minimaliste avec détail doré sur la poitrine. Pensé pour un look propre et affirmé.",
    material: "100% coton 220 g/m²", color: "Noir / Or",
    image: "/products/gold-line-tee.svg"
  },
  {
    id: "fb-shirt-001", name: "BLING OVERSHIRT", category: "Chemises", price: 14500,
    sizes: ["M","L","XL","XXL"], badge: "LIMITED",
    description: "Surchemise structurée à porter ouverte ou fermée. Une pièce forte pour les sorties du soir.",
    material: "Coton twill premium", color: "Noir",
    image: "/products/overshirt.svg"
  },
  {
    id: "fb-hoodie-001", name: "FIRST HOODIE", category: "Sweats", price: 18000,
    sizes: ["S","M","L","XL","XXL"], badge: "ESSENTIAL",
    description: "Hoodie épais et confortable, finition brodée dorée et coupe légèrement oversize.",
    material: "Coton / polyester 380 g/m²", color: "Noir / Or",
    image: "/products/hoodie.svg"
  },
  {
    id: "fb-cap-001", name: "FB CROWN CAP", category: "Accessoires", price: 6500,
    sizes: ["Unique"], badge: "NEW",
    description: "Casquette 6 panneaux avec broderie FB. Réglable et facile à associer.",
    material: "Coton brossé", color: "Noir / Or",
    image: "/products/cap.svg"
  },
  {
    id: "fb-watch-001", name: "BLING TIME", category: "Montres", price: 25000,
    sizes: ["Unique"], badge: "SIGNATURE",
    description: "Montre au cadran noir et détails dorés, conçue comme la touche finale du look.",
    material: "Acier inoxydable", color: "Noir / Or",
    image: "/products/watch.svg"
  },
  {
    id: "fb-pants-001", name: "NIGHT CARGO", category: "Pantalons", price: 16000,
    sizes: ["S","M","L","XL"], badge: "DROP 01",
    description: "Cargo noir coupe droite, poches utilitaires et finition sobre pour une silhouette street.",
    material: "Coton ripstop", color: "Noir",
    image: "/products/cargo.svg"
  },
  {
    id: "fb-bag-001", name: "BLING CROSSBODY", category: "Accessoires", price: 9500,
    sizes: ["Unique"], badge: "HOT",
    description: "Sac crossbody compact avec détails métalliques dorés et plusieurs compartiments.",
    material: "Nylon balistique", color: "Noir / Or",
    image: "/products/bag.svg"
  }
];

const categories = ["Toutes", "T-shirts", "Chemises", "Sweats", "Pantalons", "Montres", "Accessoires"];

const formatPrice = (value) => new Intl.NumberFormat("fr-FR").format(value) + " FCFA";

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("first-bling-cart") || "[]"); }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem("first-bling-cart", JSON.stringify(items)), [items]);

  const add = (product, size = product.sizes[0]) => {
    setItems(current => {
      const found = current.find(x => x.id === product.id && x.size === size);
      if (found) return current.map(x => x === found ? { ...x, qty: x.qty + 1 } : x);
      return [...current, { ...product, size, qty: 1 }];
    });
  };
  const remove = (id, size) => setItems(current => current.filter(x => !(x.id === id && x.size === size)));
  const update = (id, size, delta) => setItems(current => current.map(x =>
    x.id === id && x.size === size ? { ...x, qty: Math.max(1, x.qty + delta) } : x
  ));
  const clear = () => setItems([]);
  const count = items.reduce((sum, x) => sum + x.qty, 0);
  const subtotal = items.reduce((sum, x) => sum + x.price * x.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 30000 ? 0 : 1500;

  return <CartContext.Provider value={{ items, add, remove, update, clear, count, subtotal, shipping, total: subtotal + shipping }}>
    {children}
  </CartContext.Provider>;
}

const useCart = () => useContext(CartContext);

function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-xl font-black tracking-[0.16em] sm:text-2xl">
          FIRST <span className="text-gold-gradient">BLING</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={({isActive}) => isActive ? "text-[#d4af37]" : "text-white/70 hover:text-white"}>Accueil</NavLink>
          <NavLink to="/shop" className={({isActive}) => isActive ? "text-[#d4af37]" : "text-white/70 hover:text-white"}>Shop</NavLink>
          <a href="#about" className="text-white/70 hover:text-white">La marque</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="rounded-full p-2 hover:bg-white/10" aria-label="Rechercher"><Search size={20}/></button>
          <button onClick={() => navigate("/cart")} className="relative rounded-full p-2 hover:bg-white/10" aria-label="Panier">
            <ShoppingBag size={20}/>
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#d4af37] px-1 text-[10px] font-black text-black">{count}</span>}
          </button>
        </div>
      </div>
      {searchOpen && (
        <form onSubmit={e => {e.preventDefault(); const q = new FormData(e.currentTarget).get("q"); navigate("/shop?search="+encodeURIComponent(q)); setSearchOpen(false);}} className="border-t border-white/10 px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Search size={18} className="text-white/40"/>
            <input name="q" autoFocus placeholder="Rechercher un article..." className="w-full bg-transparent py-3 outline-none placeholder:text-white/30"/>
          </div>
        </form>
      )}
      {open && (
        <nav className="border-t border-white/10 px-4 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/" className="font-bold">Accueil</Link>
            <Link to="/shop" className="font-bold">Shop</Link>
            <a href="/#about" className="font-bold">La marque</a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return <footer id="about" className="mt-20 border-t border-white/10 bg-[#080808]">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
      <div className="lg:col-span-2">
        <div className="text-2xl font-black tracking-[0.18em]">FIRST <span className="text-[#d4af37]">BLING</span></div>
        <p className="mt-4 max-w-md text-sm leading-6 text-white/50">Streetwear premium. Des pièces pensées pour ceux qui avancent avec leur propre signature.</p>
      </div>
      <div>
        <p className="mb-4 font-bold">Shop</p>
        <div className="flex flex-col gap-2 text-sm text-white/50">
          <Link to="/shop?category=T-shirts" className="hover:text-white">T-shirts</Link>
          <Link to="/shop?category=Chemises" className="hover:text-white">Chemises</Link>
          <Link to="/shop?category=Accessoires" className="hover:text-white">Accessoires</Link>
          <Link to="/shop?category=Montres" className="hover:text-white">Montres</Link>
        </div>
      </div>
      <div>
        <p className="mb-4 font-bold">Infos</p>
        <div className="flex flex-col gap-2 text-sm text-white/50">
          <span>Livraison à Abidjan</span>
          <span>Paiement à la livraison</span>
          <span>WhatsApp : +225 07 00 00 00 00</span>
          <span>© 2026 FIRST BLING</span>
        </div>
      </div>
    </div>
  </footer>;
}

function ProductCard({ product }) {
  return <Link to={"/product/" + product.id} className="group block">
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
      <img src={product.image} alt={product.name} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.035]"/>
      <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-black tracking-wider text-[#d4af37]">{product.badge}</span>
      <button onClick={(e) => e.preventDefault()} className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white/70 hover:text-[#d4af37]" aria-label="Ajouter aux favoris"><Heart size={16}/></button>
    </div>
    <div className="flex items-start justify-between gap-3 pt-3">
      <div>
        <h3 className="text-sm font-extrabold tracking-wide">{product.name}</h3>
        <p className="mt-1 text-xs text-white/40">{product.category}</p>
      </div>
      <strong className="whitespace-nowrap text-sm text-[#d4af37]">{formatPrice(product.price)}</strong>
    </div>
  </Link>;
}

function Home() {
  const featured = products.slice(0, 4);
  return <>
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(212,175,55,.16),transparent_30%)]"/>
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 px-3 py-1.5 text-xs font-bold text-[#d4af37]"><Sparkles size={14}/> DROP 01 — 2026</div>
            <h1 className="max-w-2xl text-5xl font-black leading-[.95] tracking-[-.05em] sm:text-7xl lg:text-8xl">WEAR<br/><span className="text-gold-gradient">THE BLING.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/55 sm:text-lg">Le streetwear qui mélange attitude, simplicité et détails premium. Pas besoin d'en faire trop.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="gold-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-black text-black">SHOP NOW <ArrowRight size={17}/></Link>
              <a href="#featured" className="inline-flex items-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold hover:bg-white/5">Découvrir</a>
            </div>
            <div className="mt-10 flex gap-8 text-xs text-white/45">
              <span><b className="block text-white">PREMIUM</b>Qualité sélectionnée</span>
              <span><b className="block text-white">ABIDJAN</b>Livraison locale</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 rounded-full bg-[#d4af37]/10 blur-3xl"/>
            <img src="/products/hero.svg" alt="Collection FIRST BLING" className="relative w-full rounded-[2rem] border border-[#d4af37]/20 shadow-2xl"/>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="text-xs font-black tracking-[.25em] text-[#d4af37]">CURATED DROP</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Les essentiels.</h2></div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-bold text-white/60 hover:text-white sm:flex">Tout voir <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">{featured.map(p => <ProductCard key={p.id} product={p}/>)}</div>
        <Link to="/shop" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3.5 text-sm font-bold sm:hidden">Voir toute la collection <ArrowRight size={16}/></Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
          <div className="grid items-center lg:grid-cols-2">
            <div className="p-7 sm:p-12">
              <p className="text-xs font-black tracking-[.25em] text-[#d4af37]">FIRST BLING</p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">Moins de bruit.<br/>Plus de présence.</h2>
              <p className="mt-5 max-w-lg leading-7 text-white/50">Chaque pièce est pensée pour construire une silhouette forte sans sacrifier le confort.</p>
              <Link to="/shop" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#d4af37]">EXPLORER LE DROP <ArrowRight size={17}/></Link>
            </div>
            <img src="/products/editorial.svg" alt="Éditorial FIRST BLING" className="h-full min-h-72 w-full object-cover"/>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>;
}

function Shop() {
  const params = new URLSearchParams(useLocation().search);
  const initialCategory = params.get("category") || "Toutes";
  const initialSearch = params.get("search") || "";
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [size, setSize] = useState("Toutes");
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => products.filter(p =>
    (category === "Toutes" || p.category === category) &&
    p.price <= maxPrice &&
    (size === "Toutes" || p.sizes.includes(size)) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [category, maxPrice, size, search]);

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div className="mb-8">
      <p className="text-xs font-black tracking-[.25em] text-[#d4af37]">COLLECTION 2026</p>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <h1 className="text-4xl font-black sm:text-6xl">SHOP.</h1>
        <div className="flex items-center gap-2 text-sm text-white/40">{filtered.length} articles</div>
      </div>
    </div>
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${category === c ? "border-[#d4af37] bg-[#d4af37] text-black" : "border-white/10 text-white/55 hover:border-white/25"}`}>{c}</button>)}
    </div>
    <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
      <aside className={`${mobileFilters ? "block" : "hidden"} rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 lg:block lg:h-fit lg:sticky lg:top-24`}>
        <div className="mb-5 flex items-center justify-between"><b>Filtres</b><button className="text-xs text-white/40" onClick={() => {setCategory("Toutes");setMaxPrice(30000);setSize("Toutes");setSearch("");}}>Réinitialiser</button></div>
        <label className="mb-2 block text-xs font-bold text-white/50">Recherche</label>
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 px-3"><Search size={15} className="text-white/35"/><input value={search} onChange={e=>setSearch(e.target.value)} className="w-full bg-transparent py-2.5 text-sm outline-none" placeholder="Nom du produit"/></div>
        <label className="mb-2 block text-xs font-bold text-white/50">Prix maximum</label>
        <input type="range" min="5000" max="30000" step="500" value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} className="w-full accent-[#d4af37]"/>
        <div className="mb-6 mt-2 text-sm font-bold text-[#d4af37]">{formatPrice(maxPrice)}</div>
        <label className="mb-2 block text-xs font-bold text-white/50">Taille</label>
        <select value={size} onChange={e=>setSize(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 py-2.5 text-sm outline-none">
          {["Toutes","S","M","L","XL","XXL","Unique"].map(s=><option key={s}>{s}</option>)}
        </select>
      </aside>
      <div>
        <button onClick={()=>setMobileFilters(!mobileFilters)} className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold lg:hidden"><Filter size={16}/> Filtres</button>
        {filtered.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-6">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div> :
          <div className="rounded-2xl border border-white/10 py-20 text-center"><p className="text-lg font-black">Aucun article trouvé.</p><p className="mt-2 text-sm text-white/40">Essaie de modifier tes filtres.</p></div>}
      </div>
    </div>
  </main>;
}

function ProductPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { add } = useCart();
  const navigate = useNavigate();
  const [size, setSize] = useState(product?.sizes[0] || "M");
  const [added, setAdded] = useState(false);

  if (!product) return <main className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="text-3xl font-black">Produit introuvable.</h1><Link className="mt-5 inline-block text-[#d4af37]" to="/shop">Retour au shop</Link></main>;

  const buy = () => { add(product, size); setAdded(true); setTimeout(()=>navigate("/cart"), 350); };

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <Link to="/shop" className="mb-7 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"><ArrowLeft size={16}/> Retour</Link>
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010]"><img src={product.image} alt={product.name} className="w-full"/></div>
      <div className="lg:py-8">
        <span className="text-xs font-black tracking-[.2em] text-[#d4af37]">{product.badge}</span>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-2xl font-black text-[#d4af37]">{formatPrice(product.price)}</p>
        <div className="my-7 h-px bg-white/10"/>
        <p className="leading-7 text-white/55">{product.description}</p>
        <div className="mt-7 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-white/10 p-4"><span className="text-white/35">Matière</span><b className="mt-1 block">{product.material}</b></div>
          <div className="rounded-xl border border-white/10 p-4"><span className="text-white/35">Couleur</span><b className="mt-1 block">{product.color}</b></div>
        </div>
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between"><b className="text-sm">Taille</b><span className="text-xs text-white/40">Guide des tailles</span></div>
          <div className="flex flex-wrap gap-2">{product.sizes.map(s=><button key={s} onClick={()=>setSize(s)} className={`min-w-12 rounded-xl border px-4 py-3 text-sm font-black ${size===s ? "border-[#d4af37] bg-[#d4af37] text-black" : "border-white/10 hover:border-white/30"}`}>{s}</button>)}</div>
        </div>
        <button onClick={buy} disabled={added} className="gold-gradient mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-black text-black disabled:opacity-70">
          {added ? <><Check size={18}/> AJOUTÉ AU PANIER</> : <><ShoppingBag size={18}/> AJOUTER AU PANIER</>}
        </button>
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 p-4 text-xs text-white/50"><Truck size={18} className="text-[#d4af37]"/> Livraison à Abidjan • offerte dès 30 000 FCFA</div>
      </div>
    </div>
  </main>;
}

function Cart() {
  const { items, update, remove, subtotal, shipping, total } = useCart();
  if (!items.length) return <main className="mx-auto max-w-3xl px-4 py-24 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/5"><ShoppingBag/></div><h1 className="mt-6 text-3xl font-black">Ton panier est vide.</h1><p className="mt-2 text-white/40">Ajoute une pièce FIRST BLING pour commencer.</p><Link to="/shop" className="gold-gradient mt-7 inline-flex rounded-full px-6 py-3 font-black text-black">CONTINUER LE SHOP</Link></main>;

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <h1 className="text-4xl font-black sm:text-5xl">PANIER.</h1>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">{items.map(item=><div key={item.id+item.size} className="flex gap-4 rounded-2xl border border-white/10 bg-[#0c0c0c] p-3 sm:p-4">
        <img src={item.image} alt={item.name} className="h-28 w-28 rounded-xl object-cover sm:h-36 sm:w-36"/>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3"><div><h2 className="text-sm font-black sm:text-base">{item.name}</h2><p className="mt-1 text-xs text-white/40">Taille : {item.size}</p></div><button onClick={()=>remove(item.id,item.size)} className="text-white/35 hover:text-red-400" aria-label="Supprimer"><Trash2 size={17}/></button></div>
          <p className="mt-3 font-black text-[#d4af37]">{formatPrice(item.price)}</p>
          <div className="mt-3 flex w-fit items-center rounded-lg border border-white/10"><button onClick={()=>update(item.id,item.size,-1)} className="p-2 hover:bg-white/5"><Minus size={14}/></button><span className="w-8 text-center text-sm">{item.qty}</span><button onClick={()=>update(item.id,item.size,1)} className="p-2 hover:bg-white/5"><Plus size={14}/></button></div>
        </div>
      </div>)}</div>
      <div className="h-fit rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-black">Résumé</h2>
        <div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-white/50"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-white/50"><span>Livraison</span><span>{shipping ? formatPrice(shipping) : "OFFERTE"}</span></div></div>
        <div className="my-5 h-px bg-white/10"/><div className="flex justify-between font-black"><span>Total</span><span className="text-[#d4af37]">{formatPrice(total)}</span></div>
        <Link to="/checkout" className="gold-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black text-black">PASSER LA COMMANDE <ArrowRight size={16}/></Link>
        <p className="mt-4 text-center text-[11px] text-white/30">Paiement simulé • aucune transaction réelle</p>
      </div>
    </div>
  </main>;
}

function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const [done, setDone] = useState(false);
  const [method, setMethod] = useState("Livraison");
  const navigate = useNavigate();

  if (!items.length && !done) return <main className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-black">Ton panier est vide.</h1><Link to="/shop" className="mt-5 inline-block text-[#d4af37]">Retour au shop</Link></main>;

  const submit = e => { e.preventDefault(); clear(); setDone(true); };

  if (done) return <main className="mx-auto max-w-xl px-4 py-24 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#d4af37] text-black"><Check size={38}/></div><p className="mt-7 text-xs font-black tracking-[.2em] text-[#d4af37]">COMMANDE CONFIRMÉE</p><h1 className="mt-2 text-4xl font-black">Merci pour ta confiance.</h1><p className="mt-4 leading-7 text-white/50">Ta commande FIRST BLING a été enregistrée en mode simulation. Tu peux revenir au shop pour continuer.</p><button onClick={()=>navigate("/shop")} className="gold-gradient mt-7 rounded-full px-6 py-3 font-black text-black">RETOUR AU SHOP</button></main>;

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div className="mb-8"><p className="text-xs font-black tracking-[.25em] text-[#d4af37]">CHECKOUT</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">FINALISER.</h1></div>
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 sm:p-7">
          <h2 className="text-lg font-black">1. Tes informations</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet" name="name" required/>
            <Field label="Téléphone" name="phone" type="tel" required/>
            <Field label="Commune" name="city" required/>
            <Field label="Adresse / repère" name="address" required/>
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 sm:p-7">
          <h2 className="text-lg font-black">2. Mode de paiement</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Livraison","Mobile Money"].map(m=><button type="button" key={m} onClick={()=>setMethod(m)} className={`rounded-xl border p-4 text-left ${method===m ? "border-[#d4af37] bg-[#d4af37]/5" : "border-white/10"}`}><b>{m}</b><span className="mt-1 block text-xs text-white/40">{m==="Livraison" ? "Payer à la réception" : "Simulation de paiement"}</span></button>)}
          </div>
          {method==="Mobile Money" && <div className="mt-4"><Field label="Numéro Mobile Money" name="momo" type="tel" required/></div>}
        </section>
      </div>
      <aside className="h-fit rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 lg:sticky lg:top-24">
        <h2 className="font-black">Ta commande</h2>
        <div className="mt-5 space-y-3">{items.map(x=><div key={x.id+x.size} className="flex justify-between gap-3 text-xs"><span className="text-white/50">{x.name} × {x.qty}</span><span>{formatPrice(x.price*x.qty)}</span></div>)}</div>
        <div className="my-5 h-px bg-white/10"/>
        <div className="space-y-3 text-sm"><div className="flex justify-between text-white/50"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-white/50"><span>Livraison</span><span>{shipping ? formatPrice(shipping) : "OFFERTE"}</span></div><div className="flex justify-between pt-2 text-lg font-black"><span>Total</span><span className="text-[#d4af37]">{formatPrice(total)}</span></div></div>
        <button type="submit" className="gold-gradient mt-6 w-full rounded-xl py-3.5 text-sm font-black text-black">CONFIRMER LA COMMANDE</button>
        <p className="mt-3 text-center text-[11px] text-white/30">Simulation uniquement — aucun débit réel.</p>
      </aside>
    </form>
  </main>;
}

function Field({label, name, type="text", required=false}) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-white/50">{label}</span><input name={name} type={type} required={required} className="w-full rounded-xl border border-white/10 bg-black px-3.5 py-3 outline-none transition focus:border-[#d4af37]" /></label>;
}

function App() {
  return <CartProvider><Header/><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/shop" element={<Shop/>}/>
    <Route path="/product/:id" element={<ProductPage/>}/>
    <Route path="/cart" element={<Cart/>}/>
    <Route path="/checkout" element={<Checkout/>}/>
    <Route path="*" element={<main className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-5xl font-black">404</h1><p className="mt-3 text-white/40">Cette page n'existe pas.</p><Link to="/" className="mt-5 inline-block text-[#d4af37]">Retour à l'accueil</Link></main>}/>
  </Routes></CartProvider>;
}

createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);

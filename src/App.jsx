import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { initUtmTracking } from './services/utmManager'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ExitIntentPopup from './components/ExitIntentPopup'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import PromoKits from './pages/PromoKits'
import NativaSpa from './pages/NativaSpa'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Rastreio from './pages/Rastreio'
import SearchResults from './pages/SearchResults'
import MyOrders from './pages/MyOrders'
import MyOrdersNew from './pages/MyOrdersNew'
import ExemploPix from './pages/ExemploPix'
import ExemploPago from './pages/ExemploPago'
import ExemploEnviando from './pages/ExemploEnviando'
import Sucesso from './pages/Sucesso'
import Settings from './pages/Settings'
import Admin from './pages/Admin'

function App() {
  // Inicializa tracking de UTMs quando o app carrega
  useEffect(() => {
    initUtmTracking()
  }, [])

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/busca" element={<SearchResults />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido-confirmado" element={<OrderSuccess />} />
              <Route path="/sucesso" element={<Sucesso />} />
              <Route path="/meus-pedidos" element={<MyOrders />} />
              <Route path="/area-cliente" element={<MyOrdersNew />} />
              <Route path="/exemplo-pix" element={<ExemploPix />} />
              <Route path="/exemplo-pago" element={<ExemploPago />} />
              <Route path="/exemplo-enviando" element={<ExemploEnviando />} />
              <Route path="/settings/integrations" element={<Settings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/rastreio" element={<Rastreio />} />
              <Route path="/rastrear-pedido" element={<Rastreio />} />
              <Route path="/kits" element={<PromoKits />} />
              <Route path="/nativaspa" element={<NativaSpa />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/contato" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <ExitIntentPopup />
          <WhatsAppButton />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProducts, getProduct, getSettings, type Product } from '../services/api';
import Countdown from '../components/Countdown';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [maxInstallments, setMaxInstallments] = useState(2);

  useEffect(() => {
    loadProducts();
    loadSettings();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      const productsList = response.data.results || [];
      setProducts(productsList);
      
      // Set event date from first product
      if (productsList.length > 0 && productsList[0].event_date) {
        setEventDate(new Date(productsList[0].event_date));
      }
      
      // Get first product details with active batch
      if (productsList.length > 0) {
        const detailResponse = await getProduct(productsList[0].id);
        setProducts([detailResponse.data]);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await getSettings();
      setMaxInstallments(response.data.max_installments);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      // Keep default value of 6 if API fails
    }
  };

  // Get the first (and only) product
  const product = products[0];
  const activeBatch = product?.active_batch;
  
  // Use actual values from the product - now with separate prices for each payment method
  const pixCashPrice = activeBatch?.price 
    ? parseFloat(String(activeBatch.price)) 
    : 900;
  const pixInstallmentPrice = activeBatch?.pix_installment_price 
    ? parseFloat(String(activeBatch.pix_installment_price))
    : 1000;
  const creditCardPrice = activeBatch?.credit_card_price 
    ? parseFloat(String(activeBatch.credit_card_price))
    : 1100;
  const pixInstallmentValue = (pixInstallmentPrice / maxInstallments).toFixed(2);
  const creditCardInstallmentValue = (creditCardPrice / maxInstallments).toFixed(2);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Header with Auth */}
      <div className="fixed top-0 left-0 right-0 p-3 md:p-4 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2 md:gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-white text-sm md:text-base flex items-center gap-2 order-1 md:order-1">
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.first_name || user?.email}</span>
              </span>
              <div className="flex items-center gap-2 md:gap-3 order-2 md:order-2 flex-wrap justify-end">
                <button
                  onClick={() => navigate('/minhas-inscricoes')}
                  className="text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  Minhas Inscrições
                </button>
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-lg transition-colors font-medium"
                    style={{ backgroundColor: '#E3C276', color: '#1A1A1A' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8C9A0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E3C276'}
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => navigate('/login')}
                className="text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: '#AB3933', color: '#ffffff' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C85A54'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#AB3933'}
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative text-white py-20 pt-24 md:pt-32 min-h-[60vh] md:min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/BACKGROUND%20SITE%20REFINARIA%202026.png)',
          backgroundColor: '#AB3933',
        }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="tracking-wider" style={{ fontFamily: "'Oswald', 'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 20vw, 14rem)', marginBottom: '-0.5rem', letterSpacing: '0.05em', fontWeight: 500 }}>
              REFINARIA
            </h1>
            <p className="text-lg md:text-2xl mb-8" style={{ color: '#E3C276' }}>
              
            </p>
            
            {/* Countdown */}
            {eventDate && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                  Faltam apenas:
                </h2>
                <Countdown targetDate={eventDate} />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <button 
                onClick={() => navigate('/inscricao')} 
                className="font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg border-2"
                style={{
                  backgroundColor: '#1A1A1A',
                  color: '#E3C276',
                  borderColor: '#E3C276'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E3C276';
                  e.currentTarget.style.color = '#1A1A1A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1A1A1A';
                  e.currentTarget.style.color = '#E3C276';
                }}
              >
                Fazer Inscrição
              </button>
              <a href="#detalhes" className="btn-secondary inline-block">
                Ver Detalhes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="detalhes" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Data */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: '#AB3933' }}>
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1" style={{ color: '#AB3933' }}>Data</h3>
                  <p className="text-2xl font-bold text-gray-900">07, 08 e 09 de maio</p>
                  <p className="text-sm text-gray-600 mt-1"></p>
                </div>
              </div>

              {/* Local */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: '#AB3933' }}>
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1" style={{ color: '#AB3933' }}>Local</h3>
                  <p className="text-2xl font-bold text-gray-900">El Rancho | Corumbá</p>
                  <p className="text-sm text-gray-600 mt-1"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              REFINARIA 2026
            </h2>
            
            <div className="space-y-6 text-left">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Mais informações sobre a programação em breve.
              </p>
              
              <p className="text-xl text-center font-bold mt-8" style={{ color: '#AB3933' }}>
                Garanta sua inscrição!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="inscricao" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Valores e Inscrição
            </h2>
            <p className="text-lg text-gray-600">
              Escolha a melhor forma de pagamento para você
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* PIX à Vista */}
            <div className="card border-2 hover:shadow-2xl transition-all duration-300" style={{ borderColor: '#AB3933' }}>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">PIX à Vista</h3>
                <div className="text-4xl font-bold mb-4" style={{ color: '#AB3933' }}>
                  R$ {pixCashPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-gray-600 mb-6">Pagamento único via PIX</p>
                <button onClick={() => navigate('/inscricao')} className="btn-primary w-full">
                  Inscrever-se
                </button>
              </div>
            </div>

            {/* Cartão de Crédito */}
            <div className="card border-2 hover:shadow-2xl transition-all duration-300" style={{ borderColor: '#AB3933' }}>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Cartão de Crédito</h3>
                <div className="text-4xl font-bold mb-4" style={{ color: '#AB3933' }}>
                  R$ {creditCardPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-gray-600 mb-6">
                  À vista ou até {maxInstallments}x de R$ {creditCardInstallmentValue}<br/>
                  no cartão
                </p>
                <button onClick={() => navigate('/inscricao')} className="btn-primary w-full">
                  Inscrever-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Refinaria | Farol Treinamentos
          </p>
        </div>
      </footer>
    </div>
  );
}

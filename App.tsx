
import React, { useState, useEffect } from 'react';
import { DESTINATIONS } from './constants';
import { Destination, Review } from './types';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import { getAITravelTip } from './services/geminiService';

const App: React.FC = () => {
  const [activeDestinationId, setActiveDestinationId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Persistence (Mock)
  useEffect(() => {
    const saved = localStorage.getItem('cao_bang_reviews');
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (Object.keys(reviews).length > 0) {
      localStorage.setItem('cao_bang_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  const activeDest = DESTINATIONS.find(d => d.id === activeDestinationId);

  const fetchAiTip = async (locationName: string) => {
    setLoadingAi(true);
    const tip = await getAITravelTip(locationName);
    setAiTip(tip);
    setLoadingAi(false);
  };

  const handleSelectDestination = (id: string) => {
    setActiveDestinationId(id);
    const dest = DESTINATIONS.find(d => d.id === id);
    if (dest) {
      fetchAiTip(dest.name);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    if (!activeDestinationId) return;
    
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };

    setReviews(prev => ({
      ...prev,
      [activeDestinationId]: [...(prev[activeDestinationId] || []), newReview]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setActiveDestinationId(null)}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white mr-3 transition-transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 012.5 2.5V17m-12.5-6h1.5a2 2 0 012 2v.5a2 2 0 01-2 2h-1.5a2.25 2.25 0 00-2.25 2.25v.5a2 2 0 01-2 2h-.5V13a5.75 5.75 0 015.75-5.75z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Cao Bằng <span className="text-emerald-600">Travel</span></h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => setActiveDestinationId(null)} className="text-gray-600 hover:text-emerald-600 font-medium transition">Trang chủ</button>
            <button onClick={() => handleSelectDestination('thac-ban-gioc')} className="text-gray-600 hover:text-emerald-600 font-medium transition">Bản Giốc</button>
            <button onClick={() => handleSelectDestination('chua-truc-lam')} className="text-gray-600 hover:text-emerald-600 font-medium transition">Chùa Trúc Lâm</button>
            <button onClick={() => handleSelectDestination('pac-bo')} className="text-gray-600 hover:text-emerald-600 font-medium transition">Pắc Bó</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {!activeDest ? (
          /* Landing Page */
          <>
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
              <img 
                src="https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Falbums%2F6540%2Fe4086f7c1f488564ec526b2e84eda072.jpg&w=1920&q=75"
                className="absolute inset-0 w-full h-full object-cover brightness-50"
              />
              <div className="relative z-10 text-center px-4">
                <h2 className="text-5xl md:text-7xl text-white font-bold mb-6 drop-shadow-lg">Cao Bằng</h2>
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 font-light italic">
                  "Vùng đất của những thác nước hùng vĩ và di tích lịch sử linh thiêng"
                </p>
                <button 
                  onClick={() => handleSelectDestination('thac-ban-gioc')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl"
                >
                  Khám phá ngay
                </button>
              </div>
            </section>

            <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Địa danh tiêu biểu</h3>
                <div className="w-20 h-1 bg-emerald-500 mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {DESTINATIONS.map((dest) => (
                  <div 
                    key={dest.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={dest.imageUrl}
                        alt={dest.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Phổ biến
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">{dest.name}</h4>
                      <p className="text-gray-600 mb-4 line-clamp-3">{dest.description}</p>
                      <button 
                        onClick={() => handleSelectDestination(dest.id)}
                        className="flex items-center text-emerald-600 font-bold hover:text-emerald-700 group"
                      >
                        Chi tiết & Nhận xét
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-emerald-900 py-20">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <h3 className="text-4xl font-bold text-white mb-6">Trải nghiệm Cao Bằng chân thực nhất</h3>
                  <p className="text-emerald-100/80 text-lg mb-8 leading-relaxed">
                    Đến với Cao Bằng, bạn không chỉ được chiêm ngưỡng những cảnh đẹp thiên nhiên hùng vĩ mà còn được hòa mình vào nhịp sống chậm rãi, mộc mạc của đồng bào dân tộc thiểu số và khám phá những trang sử hào hùng của dân tộc.
                  </p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">50+</p>
                      <p className="text-emerald-400 text-sm">Điểm đến</p>
                    </div>
                    <div className="w-[1px] h-12 bg-emerald-700"></div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">100k+</p>
                      <p className="text-emerald-400 text-sm">Khách/Năm</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1599708153386-62e2d36d8335?auto=format&fit=crop&q=80&w=400&h=400" className="rounded-xl shadow-lg" alt="Culture" />
                  <img src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=400&h=400" className="rounded-xl shadow-lg mt-8" alt="Food" />
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Detail Page */
          <div className="animate-in fade-in duration-500">
            <div className="h-[50vh] relative">
              <img src={activeDest.imageUrl} alt={activeDest.name} className="w-full h-full object-cover brightness-75" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl md:text-6xl text-white font-bold mb-4 drop-shadow-md">{activeDest.name}</h2>
                  <p className="text-emerald-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {activeDest.coordinates}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveDestinationId(null)}
                className="absolute top-8 left-8 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <section className="prose prose-lg max-w-none mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Giới thiệu</h3>
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {activeDest.fullDescription}
                  </p>
                </section>

                <section id="reviews">
                  <ReviewForm onSubmit={handleAddReview} />
                  <ReviewList reviews={reviews[activeDestinationId!] || []} />
                </section>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* AI Tip Box */}
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-emerald-800">Lời khuyên từ AI Guide</h4>
                    </div>
                    {loadingAi ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      </div>
                    ) : (
                      <div className="text-emerald-700 text-sm leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl italic">
                        {aiTip}
                      </div>
                    )}
                  </div>

                  {/* Quick Info Box */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Thông tin tham quan</h4>
                    <ul className="space-y-4 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-500">Giờ mở cửa:</span>
                        <span className="font-medium">07:30 - 17:30</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Giá vé dự kiến:</span>
                        <span className="font-medium text-emerald-600">45.000 VNĐ</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Thời điểm đẹp nhất:</span>
                        <span className="font-medium">Tháng 8 - Tháng 11</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h5 className="text-2xl font-bold mb-4">Cao Bằng Travel</h5>
            <p className="text-gray-400 max-w-sm mb-6">
              Nền tảng cung cấp thông tin du lịch chính thống và kết nối cộng đồng yêu mến vẻ đẹp vùng cao phía Bắc.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
            </div>
          </div>
          <div>
            <h6 className="font-bold mb-4 uppercase tracking-wider text-sm">Điểm đến</h6>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => handleSelectDestination('thac-ban-gioc')} className="hover:text-white transition">Thác Bản Giốc</button></li>
              <li><button onClick={() => handleSelectDestination('chua-truc-lam')} className="hover:text-white transition">Chùa Trúc Lâm</button></li>
              <li><button onClick={() => handleSelectDestination('pac-bo')} className="hover:text-white transition">Khu Di Tích Pắc Bó</button></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4 uppercase tracking-wider text-sm">Liên hệ</h6>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: info@caobangtravel.vn</li>
              <li>Hotline: 1900 1234</li>
              <li>Địa chỉ: TP. Cao Bằng, Tỉnh Cao Bằng</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Cao Bang Travel. Phát triển bởi AI Guide.
        </div>
      </footer>
    </div>
  );
};

export default App;

import React from 'react';
import { MapPin, Phone, MessageCircle, Instagram, Facebook,  } from 'lucide-react';

const Contact: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281234567890?text=Halo, saya ingin reservasi meja di Uncle Bagonk', '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark mb-4">Kunjungi Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan lokasi kami dan hubungi untuk reservasi atau informasi lebih lanjut
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-secondary rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-dark mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white p-3 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">Alamat</h4>
                    <p className="text-gray-600">
                      Jl. Kopi Nikmat No. 123<br />
                      Kelurahan Aroma, Kecamatan Sedap<br />
                      Kota Bahagia, 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white p-3 rounded-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">Telepon</h4>
                    <p className="text-gray-600">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white p-3 rounded-lg">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">WhatsApp RSVP</h4>
                    <button
                      onClick={handleWhatsAppClick}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Klik untuk reservasi via WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-300">
                <h4 className="font-semibold text-dark mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/uncle_bagonk" target='_blank'
                    className="bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-2xl p-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5103.3095655043635!2d110.82087467500276!3d-7.581927092432492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a17216c38fa15%3A0xfc7872a76a6e5536!2sKedai%20Kopi%20Uncle%20Bagonk!5e1!3m2!1sid!2sid!4v1750465538541!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
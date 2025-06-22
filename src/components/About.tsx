import React from 'react';
import { Heart, Award, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-dark">Tentang Uncle Bagonk</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Kedai Kopi Uncle Bagonk hadir untuk memberikan pengalaman kopi terbaik 
              dengan suasana yang hangat dan ramah. Kami menggunakan biji kopi pilihan 
              dan teknik brewing yang tepat untuk menghadirkan cita rasa yang sempurna 
              di setiap cangkir.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Tidak hanya kopi, kami juga menyajikan berbagai makanan ringan dan 
              dessert yang cocok menemani waktu santai Anda bersama keluarga dan teman.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-dark">Dibuat dengan Cinta</h3>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-dark">Kualitas Premium</h3>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-dark">Komunitas Hangat</h3>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://lxhnhzgibgzutbrffgon.supabase.co/storage/v1/object/public/blog-images/public/1.jpeg"
                alt="Coffee brewing"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="https://lxhnhzgibgzutbrffgon.supabase.co/storage/v1/object/public/blog-images/public/2.jpg"
                alt="Coffee shop interior"
                className="w-full h-48 object-cover rounded-lg mt-8"
              />
              <img
                src="https://lxhnhzgibgzutbrffgon.supabase.co/storage/v1/object/public/blog-images/public/3.jpg"
                alt="Coffee and pastry"
                className="w-full h-48 object-cover rounded-lg -mt-8"
              />
              <img
                src="https://lxhnhzgibgzutbrffgon.supabase.co/storage/v1/object/public/blog-images/public/4.jpg"
                alt="Barista at work"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
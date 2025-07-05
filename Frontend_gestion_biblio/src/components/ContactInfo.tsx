
import React from 'react';
import { Mail, Linkedin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section id="contact-info" className="bg-gradient-to-b from-white to-black text-white relative py-[15px] md:py-[25px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block mb-3 px-3 py-1 bg-white text-black rounded-full text-sm font-medium">
            Contactez-nous
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            E-Library 2iE
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Vous avez des questions sur nos services ou besoin d'aide pour vos recherches ? Notre équipe est là pour vous accompagner dans votre parcours académique et scientifique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bibliothécaire en Chef */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face"
                alt="Dr. Salimata Sawadogo"
                className="w-32 h-32 rounded-full mb-4 object-cover filter grayscale"
              />
              <h3 className="text-xl font-bold text-gray-900">Dr. Salimata Sawadogo</h3>
              <p className="text-gray-600 mb-4">Bibliothécaire en Chef</p>
              <div className="flex flex-col space-y-3">
                <a href="mailto:s.sawadogo@2ie-edu.org" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Mail className="w-5 h-5 mr-2" />
                  s.sawadogo@2ie-edu.org
                </a>
                <a 
                  href="https://www.linkedin.com/in/salimata-sawadogo-2ie/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  Profil LinkedIn
                </a>
                <a href="tel:+22625492701" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Phone className="w-5 h-5 mr-2" />
                  +226 25 49 27 01
                </a>
              </div>
            </div>
          </div>

          {/* Coordinateur Documentation Numérique */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                alt="Issouf Ouédraogo"
                className="w-32 h-32 rounded-full mb-4 object-cover filter grayscale"
              />
              <h3 className="text-xl font-bold text-gray-900">Issouf Ouédraogo</h3>
              <p className="text-gray-600 mb-4">Coordinateur Documentation Numérique</p>
              <div className="flex flex-col space-y-3">
                <a href="mailto:i.ouedraogo@2ie-edu.org" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Mail className="w-5 h-5 mr-2" />
                  i.ouedraogo@2ie-edu.org
                </a>
                <a 
                  href="https://www.linkedin.com/in/issouf-ouedraogo-2ie/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  Profil LinkedIn
                </a>
                <a href="tel:+22625492702" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Phone className="w-5 h-5 mr-2" />
                  +226 25 49 27 02
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;

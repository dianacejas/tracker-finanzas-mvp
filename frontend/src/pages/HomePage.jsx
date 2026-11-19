import React, { useState } from 'react';
import { useDisclosure } from "@heroui/react";
import { useTheme } from '../context/ThemeContext';
import HomeNavbar from '../components/home/HomeNavbar';
import HomeHero from '../components/home/HomeHero';
import HomeBentoGrid from '../components/home/HomeBentoGrid';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeSecurity from '../components/home/HomeSecurity';
import HomePreFooterCta from '../components/home/HomePreFooterCta';
import HomeFooter from '../components/home/HomeFooter';
import LegalModal from '../components/home/LegalModal';

export default function HomePage() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));

  // Estados interactivos
  const [activeMockupTab, setActiveMockupTab] = useState('balance');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalType, setModalType] = useState('terms');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOpenModal = (type) => {
    setModalType(type);
    onOpen();
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div id="inicio" className="min-h-screen bg-[#faf8f6] dark:bg-[#242038] text-[#242038] dark:text-[#f7ece1] font-sans transition-colors duration-300 relative overflow-x-clip selection:bg-[#9067c6]/20 scroll-smooth">
      
      {/* Resplandor ambiental multicapa de fondo (SaaS Glows vivos) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] sm:w-[950px] h-[480px] bg-gradient-to-b from-[#9067c6]/25 via-[#8d86c9]/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[850px] -right-24 w-[450px] sm:w-[650px] h-[550px] bg-gradient-to-tr from-[#9067c6]/15 via-[#8d86c9]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10 opacity-80" />
      <div className="absolute bottom-[400px] -left-20 w-[400px] sm:w-[550px] h-[450px] bg-gradient-to-br from-[#8d86c9]/15 to-transparent blur-[130px] rounded-full pointer-events-none -z-10 opacity-70" />

      {/* Navbar Pública */}
      <HomeNavbar
        isDark={isDark}
        toggleMode={toggleMode}
        isAuthenticated={isAuthenticated}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleSmoothScroll={handleSmoothScroll}
      />

      {/* Hero Section */}
      <HomeHero
        isAuthenticated={isAuthenticated}
        activeMockupTab={activeMockupTab}
        setActiveMockupTab={setActiveMockupTab}
      />

      {/* Bento Grid de Características */}
      <HomeBentoGrid />

      {/* Sección Pasos (Cómo funciona) */}
      <HomeHowItWorks />

      {/* Sección de Seguridad y Privacidad */}
      <HomeSecurity />

      {/* Pre-footer Call to Action */}
      <HomePreFooterCta
        isAuthenticated={isAuthenticated}
      />

      {/* Footer Completo */}
      <HomeFooter
        handleSmoothScroll={handleSmoothScroll}
        onOpenModal={handleOpenModal}
      />

      {/* Modal Informativo de Términos / Privacidad */}
      <LegalModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modalType={modalType}
      />

    </div>
  );
}

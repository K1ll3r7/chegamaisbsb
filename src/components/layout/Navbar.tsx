import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // Só a home tem hero escuro; as demais páginas têm fundo claro e navbar com texto escuro.
  const isTransparentPage = useRouterState({ select: (s) => s.location.pathname === "/" });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine text color based on scroll state and page
  const textColor = isScrolled || !isTransparentPage ? "text-[#1A1A1A]" : "text-white";
  const bgColor = isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent";

  return (
    <nav
      aria-label="Navegação principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 py-4 ${bgColor}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group" aria-label="Chega Mais BSB, ir para o início">
          <img
            src="/imagens/logo_purple.jpg"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full transition-transform duration-500 group-hover:rotate-12"
          />
          <span className={`font-serif text-xl font-bold transition-colors ${textColor} hidden sm:block`}>
            Chega Mais BSB
          </span>
        </Link>

        <div className={`hidden sm:flex items-center gap-8 font-bold text-sm uppercase tracking-widest ${textColor}`}>
          <Link to="/" className="hover:text-[#7A3FF2] transition-colors">Sobre</Link>
          <Link to="/experiencias" className="hover:text-[#7A3FF2] transition-colors">Experiências</Link>
        </div>

        <Link
          to="/experiencias"
          className={`px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
            isScrolled || !isTransparentPage
              ? "bg-[#7A3FF2] text-white hover:bg-[#5E2CCF]"
              : "bg-white text-[#7A3FF2] hover:bg-opacity-90"
          }`}
        >
          Participar
        </Link>
      </div>
    </nav>
  );
}

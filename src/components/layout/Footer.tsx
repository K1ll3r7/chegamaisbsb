const WHATSAPP_URL =
  "https://wa.me/5561993736767?text=" +
  encodeURIComponent("Olá, vim do site da Chega Mais BSB e gostaria de fazer um orçamento");

export function Footer() {
  return (
    <footer className="py-20 bg-[#FAF9F8] text-center border-t border-black/5">
      <div className="flex items-center justify-center gap-2 mb-6">
        <img src="/imagens/logo_purple.jpg" alt="Logo do Chega Mais BSB" width={40} height={40} loading="lazy" decoding="async" className="w-10 h-10 rounded-full" />
        <span className="font-serif text-xl font-bold">Chega Mais BSB</span>
      </div>
      <p className="text-[#5E5E5E] text-sm font-medium">© 2026 • Feito com amor em Brasília</p>
      <p className="text-[#5E5E5E]/50 text-xs mt-3">
        Site por{" "}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#7A3FF2] transition-colors"
        >
          MSOne Studio
        </a>
      </p>
    </footer>
  );
}

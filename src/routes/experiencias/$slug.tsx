import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getEventBySlug, getUpcomingEvents, type SheetEvent as Event } from "@/services/eventsService";
import { Calendar, MapPin, Check, Camera, ArrowRight, Sparkles, HelpCircle, ChevronDown } from "lucide-react";

import { motion } from "framer-motion";

export const Route = createFileRoute("/experiencias/$slug")({
  loader: async ({ params }) => {
    const event = (await getEventBySlug(params.slug)) ?? null;
    const others = event
      ? (await getUpcomingEvents()).filter((e) => e.slug !== params.slug).slice(0, 3)
      : [];
    return { event, others };
  },
  head: ({ loaderData }) => {
    const event = loaderData?.event;
    if (!event) return { meta: [{ title: "Experiência | Chega Mais BSB" }] };
    const title = `${event.title} | Chega Mais BSB`;
    const description = event.shortDescription || event.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        ...(event.image.startsWith("https://") ? [{ property: "og:image", content: event.image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ExperienciaIndividual,
});


function ExperienciaIndividual() {
  const { event: loaded, others } = Route.useLoaderData();
  const event: Event | undefined = loaded ?? undefined;

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] text-[#1A1A1A] font-sans">
        <Navbar />
        <main id="conteudo" className="pt-40 pb-20 px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Experiência não encontrada</h1>
          <Link to="/experiencias" className="text-[#7A3FF2] font-bold hover:underline">
            Voltar para experiências
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const registrationEnabled = event.status === 'aberto' && !!event.formUrl;
  // Evento aberto mas sem link de inscrição na planilha ainda: não mostrar como "encerrado"
  const closedLabel = event.status === 'aberto' ? 'Inscrições em breve' : 'Inscrições Encerradas';
  const spotsLabel = /^\d+$/.test(event.spots) ? `${event.spots} ${event.spots === '1' ? 'vaga' : 'vagas'}` : event.spots;

  const handleRegister = () => {
    if (!registrationEnabled) return;
    window.open(event.formUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#1A1A1A] font-sans">
      <Navbar />

      <main id="conteudo">
      {/* Hero — a foto e o cabeçalho entram em uma sequência única */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-32 pb-20 px-8"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative h-[50vh] rounded-[3rem] overflow-hidden mb-12 shadow-2xl"
          >
            <img src={event.image} alt={event.title} fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight">{event.title}</h1>
              <div className="flex flex-wrap gap-6 text-[#5E5E5E] font-bold uppercase tracking-widest text-sm">
                <span className="flex items-center gap-2"><Calendar size={18} className="text-[#7A3FF2]" /> {event.date}, {event.time}</span>
                {event.mapsUrl ? (
                  <a 
                    href={event.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 hover:text-[#7A3FF2] transition-colors"
                  >
                    <MapPin size={18} className="text-[#7A3FF2]" /> {event.location}
                  </a>
                ) : (
                  <span className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#7A3FF2]" /> {event.location}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={handleRegister}
              disabled={!registrationEnabled}
              className={`mt-8 md:mt-0 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl ${
                registrationEnabled
                  ? "bg-[#7A3FF2] text-white hover:bg-[#5E2CCF] active:scale-[0.97]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              }`}
            >
              {registrationEnabled ? "Participar" : closedLabel}
            </button>
          </div>

          <div className="prose prose-lg max-w-none text-[#5E5E5E]">
            <h2 className="text-3xl font-serif text-[#1A1A1A] mb-6">Sobre a experiência</h2>
            <p className="leading-relaxed text-xl text-[#1A1A1A] mb-12">{event.description}</p>
            
            {(event.price || event.spots) && (
              <div className="bg-white p-12 rounded-[2.5rem] border border-black/5 mb-20 grid sm:grid-cols-2 gap-10">
                {event.price && (
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-4 italic">Investimento</h3>
                    <p className="text-[#1A1A1A] text-lg">{event.price}</p>
                  </div>
                )}
                {event.spots && (
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-4 italic">Vagas</h3>
                    <p className="text-[#1A1A1A] text-lg">{spotsLabel}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Galeria - Cinematic Highlight from Sheets */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center tracking-tight">Experiência Chega Mais</h2>
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto h-[60vh] rounded-[3rem] overflow-hidden shadow-2xl"
          >
             <img src={event.image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>


      {/* Outras experiências */}
      {others.length > 0 && (
        <section className="py-24 px-8 bg-[#FAF9F8]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center tracking-tight">Você também pode gostar</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {others.map((o, i) => (
                <motion.div
                  key={o.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                >
                  <Link
                    to="/experiencias/$slug"
                    params={{ slug: o.slug }}
                    className="block bg-white rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-xl transition-all border border-black/5"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={o.image} alt={o.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase text-[#7A3FF2] tracking-widest">{o.category}</div>
                      {o.price && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#7A3FF2] text-white rounded-full text-xs font-bold">{o.price}</div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="flex items-center gap-1 text-xs font-bold text-[#5E5E5E] mb-3 uppercase tracking-widest"><Calendar size={12} /> {o.date}</span>
                      <h3 className="text-xl font-serif font-bold mb-3">{o.title}</h3>
                      <span className="flex items-center gap-1 text-sm font-bold text-[#7A3FF2] group-hover:gap-2 transition-all">Ver experiência <ArrowRight size={14} /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-32 px-8 bg-white text-center"
      >
        <div className="max-w-4xl mx-auto">
          <Sparkles className="text-[#7A3FF2] mx-auto mb-10" size={48} />
          <h2 className="text-5xl font-serif font-bold mb-10 tracking-tight">Sua próxima amizade pode começar aqui.</h2>
          <button
            onClick={handleRegister}
            disabled={!registrationEnabled}
            className={`px-12 py-5 rounded-full font-bold text-xl transition-all shadow-2xl ${
              registrationEnabled
                ? "bg-[#7A3FF2] text-white hover:bg-[#5E2CCF] active:scale-[0.97]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            }`}
          >
            {registrationEnabled ? "Quero Participar" : closedLabel}
          </button>
        </div>
      </motion.section>
      </main>

      <Footer />
    </div>
  );
}

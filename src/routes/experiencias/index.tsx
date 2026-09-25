import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { getUpcomingEvents, type SheetEvent as Event } from "@/services/eventsService";

import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/experiencias/")({
  head: () => ({
    meta: [
      { title: "Próximas Experiências | Chega Mais BSB" },
      { name: "description", content: "Confira as próximas experiências da comunidade Chega Mais em Brasília. Conheça pessoas novas e viva momentos únicos." },
      { property: "og:title", content: "Próximas Experiências | Chega Mais BSB" },
      { property: "og:description", content: "Confira as próximas experiências da comunidade Chega Mais em Brasília. Conheça pessoas novas e viva momentos únicos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getUpcomingEvents(),
  component: Experiencias,
});


function Experiencias() {
  const activeEvents: Event[] = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#1A1A1A] font-sans">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-20 px-8 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">Próximas Experiências</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-[#5E5E5E] max-w-2xl mx-auto">
          Cada encontro é uma oportunidade de conhecer pessoas, viver algo novo e criar conexões reais.
        </motion.p>
      </section>

      {/* Grid */}
      <section className="pb-32 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {activeEvents.map((e, i) => (
            <motion.div 
              key={e.slug} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }} 
              className="bg-white rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all border border-black/5"
            >
              <div className="h-72 overflow-hidden relative">
                <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase text-[#7A3FF2] tracking-widest">{e.category}</div>
                  {e.featured && (
                    <div className="px-4 py-1.5 bg-[#7A3FF2] text-white rounded-full text-xs font-bold uppercase tracking-widest">✨ Destaque</div>
                  )}
                </div>
              </div>
              <div className="p-10">
                <div className="flex gap-4 text-xs font-bold text-[#5E5E5E] mb-6 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {e.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {e.location}</span>
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4">{e.title}</h3>
                <p className="text-[#5E5E5E] mb-10 h-12">{e.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#5E5E5E]">{e.status === 'aberto' ? "Inscrições Abertas" : "Encerrado"}</span>
                  <Link 
                    to="/experiencias/$slug" params={{ slug: e.slug }} 
                    className="flex items-center gap-2 px-6 py-3 bg-[#7A3FF2] text-white rounded-full font-bold text-sm hover:bg-[#5E2CCF] transition-all"
                  >
                    Ver experiência <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

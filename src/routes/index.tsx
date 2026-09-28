import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { Sparkles, Heart, Users, Calendar, ArrowRight, Star, Quote, MapPin, Coffee, Camera, ChevronRight, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { getActiveEvents, type SheetEvent as Event } from "@/services/eventsService";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chega Mais BSB | Comunidade Feminina em Brasília" },
      { name: "description", content: "O Chega Mais é uma comunidade para mulheres que buscam amizades reais, experiências únicas e acolhimento em Brasília. Venha como você é." },
      { property: "og:title", content: "Chega Mais BSB | Comunidade Feminina em Brasília" },
      { property: "og:description", content: "O Chega Mais é uma comunidade para mulheres que buscam amizades reais, experiências únicas e acolhimento em Brasília. Venha como você é." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getActiveEvents(),
  component: Index,
});



function Index() {
  const activeEvents: Event[] = Route.useLoaderData();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#1A1A1A] font-sans selection:bg-[#7A3FF2] selection:text-white overflow-x-hidden">
      <Navbar />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#7A3FF2] origin-left z-[60]" style={{ scaleX }} />

      <main id="conteudo">
      {/* Hero */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center px-4 overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }} className="absolute inset-0 z-0">
          <img src="/imagens/community_group.jpg" alt="Grupo de mulheres da comunidade Chega Mais reunidas" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[4px]" />
        </motion.div>
        
        <div className="relative z-10 text-center max-w-5xl text-white px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8">
            <Sparkles size={14} /> CHEGA MAIS, VEM COM A GENTE!
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-6xl md:text-9xl font-serif font-bold mb-10 leading-[0.85] tracking-tighter">
            Você não precisa viver Brasília sozinha.
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/experiencias" className="px-10 py-4 bg-[#7A3FF2] text-white rounded-full font-bold text-lg hover:bg-[#5E2CCF] transition-all text-center">Quero participar</Link>
            <Link to="/experiencias" className="px-10 py-4 border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center">Conhecer experiências</Link>

          </motion.div>
        </div>
      </section>

      {/* Seção Você Já Sentiu Isso? */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-semibold mb-20 text-center tracking-tight">Você já sentiu isso?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Querer sair mas não ter companhia.",
              "Querer conhecer pessoas novas e não saber por onde começar.",
              "Sentir que a rotina ficou pequena demais.",
              "Querer viver algo novo mas acabar adiando.",
              "Procurar um lugar onde possa simplesmente ser você."
            ].map((text, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-4 p-6 bg-[#FAF9F8] rounded-2xl">
                <Check className="text-[#7A3FF2]" size={24} />
                <p className="text-lg font-medium">{text}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-2xl font-serif text-center mt-16 font-semibold italic">Se sim, talvez você esteja no lugar certo.</p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-32 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl font-serif font-semibold mb-8 tracking-tight">Por trás do Chega Mais existem mulheres.</h2>
          <p className="text-lg leading-relaxed text-[#5E5E5E] mb-6 italic border-l-4 border-[#7A3FF2]/20 pl-6">Somos quatro mulheres diferentes, com personalidades, sonhos e rotinas únicas. Mas acreditamos na mesma coisa: ninguém deveria precisar viver tudo sozinha.</p>
          <p className="text-lg leading-relaxed text-[#5E5E5E] mb-8">O Chega Mais nasceu para ser um lugar onde mulheres possam chegar exatamente como são.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative">
          <img src="/imagens/group_portrait.jpg" alt="As quatro fundadoras do Chega Mais" width={1364} height={908} loading="lazy" decoding="async" className="rounded-3xl shadow-2xl transition-all duration-700 hover:scale-[1.02]" />
        </motion.div>
      </section>

      {/* Fundadoras Premium */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-semibold text-center mb-20 tracking-tight">As Fundadoras</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Ana Lu", role: "Idealizadora", bio: "Acredita na força dos encontros reais.", quote: "O\u00A0Chega Mais nasceu porque ninguém deveria viver Brasília sozinha.", image: "/imagens/ana_lu.jpg" },
              { name: "Brenda", role: "IDEALIZADORA", bio: "Focada em criar ambientes acolhedores.", quote: "Acolhimento é o nosso maior pilar.", image: "/imagens/brenda.jpg" },
              { name: "Clara", role: "IDEALIZADORA", bio: "Curadora de momentos inesquecíveis.", quote: "Cada detalhe importa na nossa conexão.", image: "/imagens/clara.jpg" },
              { name: "Hannah", role: "IDEALIZADORA", bio: "Garante que tudo aconteça com fluidez.", quote: "Chegue como você é, o resto a gente faz.", image: "/imagens/hannah.jpg" }
            ].map((f, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="group">
                <div className="h-80 rounded-2xl overflow-hidden mb-6 bg-[#FAF9F8]">
                  <img src={f.image} alt={`Foto de ${f.name}`} width={1080} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <h3 className="text-xl font-serif font-bold">{f.name}</h3>
                <p className="text-[#7A3FF2] text-sm font-bold uppercase mb-2">{f.role}</p>
                <p className="text-[#5E5E5E] text-sm mb-4">{f.bio}</p>
                <p className="text-sm italic font-medium">"{f.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Momentos Chega Mais (Masonry) */}
      <section className="py-32 px-8 bg-[#FAF9F8]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-semibold text-center mb-20 tracking-tight">Momentos Chega Mais</h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {["workshop_table.jpg", "group_smiling.jpg", "group_portrait.jpg", "community_group.jpg", "workshop_table.jpg", "group_smiling.jpg"].map((imgName, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.02 }} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-lg">
                <img src={`/imagens/${imgName}`} alt="Momento de um encontro do Chega Mais" loading="lazy" decoding="async" className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="text-white" size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Números da Comunidade */}
      <section className="py-32 px-8 bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "eventos realizados", value: "+20" },
            { label: "mulheres participantes", value: "+300" },
            { label: "conexões criadas", value: "+1000" },
            { label: "experiências compartilhadas", value: "+50" }
          ].map((n, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="text-5xl font-serif font-bold text-[#7A3FF2] mb-2">{n.value}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-[#5E5E5E]">{n.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Depoimentos Carousel Style */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-semibold text-center mb-20 tracking-tight">O que elas dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Mariana", text: "O Chega Mais mudou minha percepção de Brasília. Encontrei mulheres incríveis que hoje são minhas melhores amigas." },
              { name: "Beatriz", text: "Eu tinha medo de ir sozinha, mas fui acolhida desde o primeiro minuto. É um ambiente realmente seguro e leve." },
              { name: "Letícia", text: "Cada experiência é única. Não é apenas uma oficina, é um momento de reconexão comigo mesma e com as outras." }
            ].map((t, i) => (
              <motion.div key={i} className="p-10 bg-[#FAF9F8] rounded-3xl relative group">
                <Quote className="absolute top-8 right-8 text-[#7A3FF2]/10" size={48} />
                <div className="flex gap-1 mb-6 text-[#7A3FF2]">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg italic mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#7A3FF2] text-white rounded-full flex items-center justify-center font-bold">{t.name[0]}</div>
                  <span className="font-bold">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-32 px-8 bg-[#FAF9F8] overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-semibold mb-20 tracking-tight">Como chegar mais</h2>
          <div className="grid lg:grid-cols-4 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#7A3FF2]/10 hidden lg:block -translate-y-1/2" />
            {[
              { step: "01", title: "Escolha uma experiência", icon: Coffee },
              { step: "02", title: "Garanta seu lugar", icon: Star },
              { step: "03", title: "Chegue como você é", icon: Heart },
              { step: "04", title: "Viva a conexão", icon: Sparkles }
            ].map((s, i) => (
              <motion.div key={i} className="relative z-10 flex flex-col items-center group">
                <div className="w-20 h-20 bg-white border-2 border-[#7A3FF2] text-[#7A3FF2] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#7A3FF2] group-hover:text-white transition-all shadow-xl">
                  <s.icon size={28} />
                </div>
                <span className="text-xs font-bold text-[#7A3FF2] uppercase tracking-widest mb-2">{s.step}</span>
                <h3 className="text-xl font-serif font-bold">{s.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiências */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-semibold tracking-tight">Próximas Experiências</h2>
            <Link to="/experiencias" className="flex items-center gap-2 text-[#7A3FF2] font-bold border-b-2 border-[#7A3FF2]/20 pb-2 hover:border-[#7A3FF2] transition-all">
              Ver calendário <ArrowRight size={20} />
            </Link>

          </div>
          {activeEvents.length === 0 && (
            <p className="text-center text-xl text-[#5E5E5E] font-serif italic py-12">
              Ainda não temos experiências com inscrições abertas. Volte em breve, novidades vêm aí. 💜
            </p>
          )}
          <div className="grid md:grid-cols-3 gap-10">
            {activeEvents.map((e, i) => (
              <motion.div key={e.slug} whileHover={{ y: -10 }} className="bg-[#FAF9F8] rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all">
                <div className="h-72 overflow-hidden relative">
                  <img src={e.image} alt={e.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <div className="px-4 py-1.5 bg-white/90 rounded-full text-xs font-bold uppercase text-[#7A3FF2]">{e.category}</div>
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
                  <div className="flex justify-between items-center mt-10">
                    <span className="text-sm font-bold text-[#5E5E5E]">
                      {e.status === 'aberto' ? "Participar" : "Inscrições Encerradas"}
                    </span>
                    <Link to="/experiencias/$slug" params={{ slug: e.slug }} className="px-6 py-3 bg-[#7A3FF2] text-white rounded-full font-bold text-sm hover:bg-[#5E2CCF] transition-all">
                      {e.status === 'aberto' ? "Participar" : "Ver Detalhes"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Emocional Impacto */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/imagens/community_group.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10 text-center text-white px-8 max-w-5xl">
          <h2 className="text-4xl md:text-7xl font-serif font-bold italic mb-10 leading-tight">Não é sobre o evento.<br/>É sobre o que acontece depois dele.</h2>
          <p className="text-2xl font-serif italic opacity-80">As melhores amizades geralmente começam quando alguém aceita um convite.</p>
        </motion.div>
      </section>

      {/* CTA Final */}
      <section className="py-48 px-8 bg-white text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto relative z-10">
          <Sparkles className="text-[#7A3FF2] mx-auto mb-10" size={48} />
          <h2 className="text-5xl md:text-8xl font-serif font-bold mb-10 tracking-tighter leading-[0.9]">Talvez sua próxima amizade esteja a uma inscrição de distância.</h2>
          <p className="text-xl md:text-2xl font-serif italic mb-16 text-[#5E5E5E]">Você não precisa chegar acompanhada.<br/>Você só precisa chegar.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/experiencias" className="px-12 py-5 bg-[#7A3FF2] text-white rounded-full font-bold text-xl hover:bg-[#5E2CCF] transition-all shadow-2xl text-center">Quero participar</Link>
            <Link to="/experiencias" className="px-12 py-5 border border-black/10 rounded-full font-bold text-xl hover:bg-black/5 transition-all text-center">Conhecer experiências</Link>

          </div>
        </motion.div>
      </section>
      </main>

      <footer className="py-20 bg-[#FAF9F8] text-center border-t border-black/5">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/imagens/logo_purple.jpg" alt="Logo do Chega Mais BSB" width={40} height={40} loading="lazy" decoding="async" className="w-10 h-10 rounded-full" />
          <span className="font-serif text-xl font-bold">Chega Mais BSB</span>
        </div>
        <p className="text-[#5E5E5E] text-sm font-medium">© 2026 • Feito com amor em Brasília</p>
      </footer>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ClipboardList, CalendarCheck, MessageCircleHeart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const FORM_URL = "https://forms.gle/jc4RnnfNuUXriV1UA";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade | Chega Mais BSB" },
      { name: "description", content: "Entre gratuitamente para a comunidade Chega Mais BSB e fique por dentro de tudo que rola por aqui." },
      { property: "og:title", content: "Comunidade | Chega Mais BSB" },
      { property: "og:description", content: "Entre gratuitamente para a comunidade Chega Mais BSB e fique por dentro de tudo que rola por aqui." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Comunidade,
});

const steps = [
  { step: "01", title: "Preencha o formulário", desc: "Leva menos de dois minutos, é só contar um pouco sobre você.", icon: ClipboardList },
  { step: "02", title: "Aguarde a aprovação", desc: "As entradas são aprovadas toda segunda-feira, então pode levar alguns dias.", icon: CalendarCheck },
  { step: "03", title: "Entre no grupo", desc: "No final do formulário tem o link do grupo. É só clicar e você já está dentro.", icon: MessageCircleHeart },
];

function Comunidade() {
  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#1A1A1A] font-sans">
      <Navbar />

      <main id="conteudo">
        <section className="pt-40 pb-20 px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-[#7A3FF2]/10 text-[#7A3FF2] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Heart size={14} /> Gratuito
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-8 tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Faça parte da comunidade Chega Mais
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-xl text-[#5E5E5E] max-w-2xl mx-auto mb-10"
          >
            Nosso grupo é onde combinamos os próximos encontros, trocamos ideias e ficamos sabendo de tudo antes de todo mundo. Entrar é de graça.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#7A3FF2] text-white rounded-full font-bold text-lg hover:bg-[#5E2CCF] active:scale-[0.97] transition-all"
            >
              Quero entrar na comunidade
            </a>
          </motion.div>
        </section>

        {/* Como funciona */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-16 tracking-tight">Como funciona</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-[#F5F0FF] text-[#7A3FF2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <s.icon size={26} />
                  </div>
                  <span className="text-xs font-bold text-[#7A3FF2] uppercase tracking-widest">{s.step}</span>
                  <h3 className="text-xl font-serif font-bold mt-2 mb-3">{s.title}</h3>
                  <p className="text-[#5E5E5E]">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Diferença para as oficinas */}
        <section className="py-24 px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-[#5E5E5E]">
              A comunidade é gratuita e é só o começo. Quando quiser participar de uma oficina ou experiência específica, cada uma tem seu próprio formulário de inscrição — dá uma olhada nas{" "}
              <Link to="/experiencias" className="text-[#7A3FF2] font-bold hover:underline">
                próximas experiências
              </Link>
              .
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

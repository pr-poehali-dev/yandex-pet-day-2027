import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type TooltipData = { x: number; y: number; color: string; size: string; weight: string; tag: string };

function toHex(color: string): string {
  const rgb = color.match(/\d+/g);
  if (rgb && rgb.length >= 3) {
    return "#" + [rgb[0], rgb[1], rgb[2]]
      .map((v) => parseInt(v).toString(16).padStart(2, "0"))
      .join("").toUpperCase();
  }
  return color;
}

function weightLabel(w: string): string {
  const n = parseInt(w);
  if (n <= 300) return "Light";
  if (n <= 400) return "Regular";
  if (n <= 500) return "Medium";
  if (n <= 600) return "SemiBold";
  if (n <= 700) return "Bold";
  return "ExtraBold";
}

function headingTag(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  if (["h1","h2","h3","h4","h5","h6"].includes(tag)) return tag.toUpperCase();
  const closest = el.closest("h1,h2,h3,h4,h5,h6");
  if (closest) return closest.tagName.toUpperCase();
  return "";
}

function StyleTooltip() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el) return;
      const skip = ["HTML", "BODY", "SCRIPT", "STYLE", "SVG", "PATH"];
      if (skip.includes(el.tagName)) { setTooltip(null); return; }

      const style = window.getComputedStyle(el);
      const hex = toHex(style.color);
      const size = Math.round(parseFloat(style.fontSize)) + "px";
      const weight = weightLabel(style.fontWeight);
      const tag = headingTag(el);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setTooltip({ x: e.clientX, y: e.clientY, color: hex, size, weight, tag });
      }, 80);
    };

    const handleLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTooltip(null);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const popupBase: React.CSSProperties = {
    background: "#1A1A1A",
    border: "1px solid #2A2A2A",
    borderRadius: 6,
    boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: 11,
    whiteSpace: "nowrap",
  };

  return (
    <>
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltip.x + 14, top: tooltip.y - 44 }}
        >
          <div style={{ ...popupBase, padding: "6px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            {tooltip.tag && (
              <>
                <span style={{ color: "#FF0000", fontWeight: 600 }}>{tooltip.tag}</span>
                <span style={{ color: "#3A3A3A" }}>|</span>
              </>
            )}
            <span style={{ width: 12, height: 12, borderRadius: 2, background: tooltip.color, border: "1px solid #3A3A3A", flexShrink: 0 }} />
            <span style={{ color: "#F5F5F5" }}>{tooltip.color}</span>
            <span style={{ color: "#6B6B6B" }}>·</span>
            <span style={{ color: "#A0A0A0" }}>{tooltip.size}</span>
            <span style={{ color: "#6B6B6B" }}>·</span>
            <span style={{ color: "#A0A0A0" }}>{tooltip.weight}</span>
          </div>
        </div>
      )}
    </>
  );
}

const SPEAKERS = [
  {
    name: "Андрей Неколов",
    role: "Head of Product Design",
    company: "Яндекс",
    topic: "Комплексное зрение в ветеринарии",
    time: "11:30–12:10",
    photo: "https://cdn.poehali.dev/projects/3ac2745d-af97-4a39-aa81-e735cc455f9e/files/888dc4ca-0655-4093-9725-7f9562b838a3.jpg",
  },
  {
    name: "Мария Подольская",
    role: "Head of AI",
    company: "Лаборатория инноваций",
    topic: "Внедрение ИИ в ежедневные практики",
    time: "12:10–12:50",
    photo: "https://cdn.poehali.dev/projects/3ac2745d-af97-4a39-aa81-e735cc455f9e/files/acbbb1d2-f12e-4622-821d-3f031060121f.jpg",
  },
  {
    name: "Павел Сидоров",
    role: "CEO",
    company: "Маркетплейс «Топ-Паркет»",
    topic: "От стартапа до маркетплейса",
    time: "13:10–13:40",
    photo: "https://cdn.poehali.dev/projects/3ac2745d-af97-4a39-aa81-e735cc455f9e/files/caaa49ce-44a2-4f5b-b72d-eb2e6699162c.jpg",
  },
];

const SCHEDULE = [
  { time: "10:00–10:30", title: "Приветственный кофе", note: "только офлайн", speaker: null },
  { time: "11:00–11:30", title: "Вводное слово", note: null, speaker: null },
  { time: "11:30–12:10", title: "Комплексное зрение в ветеринарии", note: null, speaker: "Андрей Неколов" },
  { time: "12:10–12:50", title: "Внедрение ИИ в ежедневные практики", note: null, speaker: "Мария Подольская" },
  { time: "12:50–13:10", title: "Перерыв", note: null, speaker: null },
  { time: "13:10–13:40", title: "От стартапа до маркетплейса: опыт «Топ-Паркет»", note: null, speaker: "Павел Сидоров" },
  { time: "13:40–15:00", title: "Дискуссия «Инвестиции в pet-технологии»", note: null, speaker: null },
  { time: "15:00–16:30", title: "Нетворкинг", note: "только офлайн", speaker: null },
];

const AUDIENCE = [
  { icon: "Briefcase", label: "Владельцы pet-бизнесов" },
  { icon: "Cpu", label: "Digital-продюсеры" },
  { icon: "Palette", label: "Дизайнеры и разработчики" },
  { icon: "TrendingUp", label: "Маркетологи и AI-специалисты" },
  { icon: "Stethoscope", label: "Ветеринарные эксперты" },
  { icon: "BarChart2", label: "Инвесторы" },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FaqContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-2 py-4">
        <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">Отправлено</span>
        <p className="text-ypd-white font-medium">Спасибо! Ответим в течение 24 часов.</p>
      </div>
    );
  }

  const inputCls = "w-full bg-ypd-black border border-ypd-border rounded-lg px-4 py-3 text-sm text-ypd-white placeholder:text-ypd-dim focus:outline-none focus:border-ypd-muted transition-colors duration-200";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          required
          type="text"
          placeholder="Имя"
          className={inputCls}
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Почта"
          className={inputCls}
          value={fields.email}
          onChange={(e) => setFields({ ...fields, email: e.target.value })}
        />
      </div>
      <textarea
        required
        rows={4}
        placeholder="Опишите ваш вопрос"
        className={inputCls + " resize-none"}
        value={fields.message}
        onChange={(e) => setFields({ ...fields, message: e.target.value })}
      />
      <button
        type="submit"
        className="self-start px-6 py-3 bg-ypd-red text-ypd-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity duration-200"
      >
        Отправить
      </button>
    </form>
  );
}

function FaqItem({ index, question, answer }: { index: number; question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-ypd-border rounded-xl overflow-hidden bg-ypd-dark cursor-pointer hover:border-ypd-muted transition-colors duration-200"
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-ypd-red w-5 shrink-0">{String(index).padStart(2, "0")}</span>
          <span className="text-sm font-medium text-ypd-white leading-snug">{question}</span>
        </div>
        <span
          className="text-ypd-muted shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </div>
      {open && (
        <div className="px-6 pb-5 pt-0">
          <div className="border-t border-ypd-border pt-4">
            <p className="text-sm text-ypd-dim leading-relaxed whitespace-pre-line">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", format: "offline" });
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Регистрация:", form);
    setSubmitted(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "О конференции", id: "about" },
    { label: "Спикеры", id: "speakers" },
    { label: "Программа", id: "schedule" },
    { label: "Участие", id: "formats" },
  ];

  return (
    <div className="font-ibm bg-ypd-black text-ypd-white min-h-screen">
      <StyleTooltip />

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ypd-black/95 backdrop-blur-md border-b border-ypd-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-ypd-red rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">Y</span>
              </div>
              <span className="font-semibold text-sm tracking-wide text-ypd-white">
                Pet Day
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-ypd-border" />
            <span className="hidden sm:block font-mono text-xs text-ypd-muted">
              20.06.2025
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm text-ypd-dim hover:text-ypd-white transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setForm((f) => ({ ...f, format: "online" }));
                scrollTo("register");
              }}
              className="hidden sm:block text-sm text-ypd-dim hover:text-ypd-white border border-ypd-border hover:border-ypd-muted px-4 py-2 rounded transition-all duration-200"
            >
              Смотреть онлайн
            </button>
            <button
              onClick={() => {
                setForm((f) => ({ ...f, format: "offline" }));
                scrollTo("register");
              }}
              className="text-sm bg-ypd-red hover:bg-ypd-red-hover text-white px-4 py-2 rounded font-medium transition-colors duration-200"
            >
              Регистрация
            </button>
            <button
              className="md:hidden text-ypd-dim hover:text-ypd-white p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-ypd-dark border-t border-ypd-border px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm text-ypd-dim hover:text-ypd-white text-left transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,0,0,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #2A2A2A 30%, #2A2A2A 70%, transparent)",
            }}
          />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-ypd-border/20"
              style={{ left: `${20 * (i + 1)}%`, top: 0, bottom: 0 }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 border border-ypd-border bg-ypd-dark px-4 py-2 rounded-full mb-8"
              style={{ animation: "fade-up 0.6s ease forwards" }}
            >
              <span className="w-2 h-2 bg-ypd-red rounded-full animate-pulse" />
              <span className="font-mono text-xs text-ypd-dim tracking-widest uppercase">
                Гибридное мероприятие · Москва + Онлайн
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight mb-6"
              style={{ animation: "fade-up 0.7s ease 0.1s both" }}
            >
              Yandex
              <br />
              <span className="text-ypd-red">Pet Day</span>
            </h1>

            <p
              className="text-lg sm:text-xl text-ypd-dim max-w-xl mb-4 leading-relaxed"
              style={{ animation: "fade-up 0.7s ease 0.2s both" }}
            >
              Конференция для создателей pet-проектов, дизайнеров
              и digital-продюсеров
            </p>
            <p
              className="text-base text-ypd-muted max-w-lg mb-10 leading-relaxed"
              style={{ animation: "fade-up 0.7s ease 0.3s both" }}
            >
              Digital-продукты, дизайн, AI и тренды — всё, что формирует
              будущее индустрии для питомцев
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{ animation: "fade-up 0.7s ease 0.4s both" }}
            >
              <button
                onClick={() => {
                  setForm((f) => ({ ...f, format: "offline" }));
                  scrollTo("register");
                }}
                className="bg-ypd-red hover:bg-ypd-red-hover text-white font-semibold px-8 py-4 rounded transition-colors duration-200 text-base"
              >
                Участвовать
              </button>
              <button
                onClick={() => scrollTo("schedule")}
                className="border border-ypd-border hover:border-ypd-muted text-ypd-dim hover:text-ypd-white px-8 py-4 rounded transition-all duration-200 text-base"
              >
                Посмотреть программу
              </button>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-6 mt-12 pt-10 border-t border-ypd-border"
              style={{ animation: "fade-up 0.7s ease 0.5s both" }}
            >
              {[
                { label: "Дата", value: "20 июня 2025" },
                { label: "Начало", value: "11:00 МСК" },
                { label: "Место", value: "ЦДП «Новатор»" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-xs text-ypd-muted uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="font-semibold text-ypd-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 border-t border-ypd-border">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">
              О конференции
            </span>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-16 mt-8">
            <Reveal delay={100}>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-ypd-white">
                Экосистема для питомцев и их владельцев — создаём вместе
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-ypd-dim leading-relaxed text-lg mt-2">
                Конференция для тех, кто создаёт экосистему для питомцев и их
                владельцев. Дизайн, AI, маркетинг, инвестиции — всё, что нужно
                для роста pet-проектов.
              </p>
              <p className="text-ypd-dim leading-relaxed mt-4">
                Если вы живёте в Москве или Санкт-Петербурге — приходите лично.
                Офлайн-участники получат бейдж, кофе-брейк и уникальный
                нетворкинг с лидерами индустрии.
              </p>
              <div className="flex gap-4 mt-8">
                <div className="border border-ypd-border rounded-lg p-5 flex-1 text-center">
                  <p className="font-mono text-xs text-ypd-muted uppercase tracking-widest mb-2">
                    Офлайн
                  </p>
                  <p className="text-sm text-ypd-white font-medium">Москва</p>
                  <p className="text-xs text-ypd-muted mt-1">ЦДП «Новатор»</p>
                </div>
                <div className="border border-ypd-border rounded-lg p-5 flex-1 text-center">
                  <p className="font-mono text-xs text-ypd-muted uppercase tracking-widest mb-2">
                    Онлайн
                  </p>
                  <p className="text-sm text-ypd-white font-medium">
                    Прямая трансляция
                  </p>
                  <p className="text-xs text-ypd-muted mt-1">+ запись докладов</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section id="speakers" className="py-24 border-t border-ypd-border bg-ypd-dark">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">
              Спикеры
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-12">Кто выступает</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPEAKERS.map((s, i) => (
              <Reveal key={s.name} delay={i * 120}>
                <div className="group border border-ypd-border hover:border-ypd-muted bg-ypd-card rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] overflow-hidden bg-ypd-border">
                    <img
                      src={s.photo}
                      alt={s.name}
                      className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-semibold text-ypd-white text-lg">{s.name}</p>
                    <p className="text-ypd-dim text-sm mt-1">{s.role}</p>
                    <p className="text-ypd-muted text-xs mb-4">{s.company}</p>
                    <div className="border-t border-ypd-border pt-4">
                      <p className="font-mono text-xs text-ypd-red mb-1">{s.time}</p>
                      <p className="text-sm text-ypd-white leading-snug">«{s.topic}»</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="py-24 border-t border-ypd-border">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">
              Программа
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-12">
              Расписание 20 июня
            </h2>
          </Reveal>
          <div className="max-w-3xl">
            {SCHEDULE.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div
                  className={`flex gap-6 sm:gap-10 py-5 border-b border-ypd-border/60 ${
                    item.speaker
                      ? "hover:bg-ypd-dark/50 -mx-4 px-4 rounded-lg transition-colors"
                      : ""
                  }`}
                >
                  <div className="min-w-[110px]">
                    <span className="font-mono text-xs text-ypd-red">{item.time}</span>
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        item.note ? "text-ypd-muted" : "text-ypd-white"
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.speaker && (
                      <p className="text-sm text-ypd-dim mt-0.5">{item.speaker}</p>
                    )}
                    {item.note && (
                      <span className="inline-block mt-1 text-xs font-mono text-ypd-muted border border-ypd-border/50 px-2 py-0.5 rounded-full">
                        {item.note}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section id="formats" className="py-24 border-t border-ypd-border bg-ypd-dark">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">
              Форматы участия
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-12">
              Выберите удобный формат
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <Reveal delay={100}>
              <div className="border border-ypd-red/40 bg-ypd-card rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ypd-red/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-ypd-red/15 rounded-lg flex items-center justify-center">
                    <Icon name="MapPin" size={20} className="text-ypd-red" />
                  </div>
                  <div>
                    <p className="font-semibold text-ypd-white">Офлайн</p>
                    <p className="text-xs text-ypd-muted">Мест ограничено</p>
                  </div>
                </div>
                <p className="text-ypd-dim text-sm mb-6 leading-relaxed">
                  Москва, Цифровое деловое пространство «Новатор»
                </p>
                <ul className="space-y-3">
                  {[
                    "Персональный бейдж участника",
                    "Кофе-брейки и обед",
                    "Нетворкинг 15:00–16:30",
                    "Доступ ко всем сессиям",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ypd-dim">
                      <Icon name="Check" size={14} className="text-ypd-red flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setForm((f) => ({ ...f, format: "offline" }));
                    scrollTo("register");
                  }}
                  className="mt-8 w-full bg-ypd-red hover:bg-ypd-red-hover text-white font-semibold py-3 rounded transition-colors"
                >
                  Зарегистрироваться офлайн
                </button>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="border border-ypd-border bg-ypd-card rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-ypd-border rounded-lg flex items-center justify-center">
                    <Icon name="Monitor" size={20} className="text-ypd-dim" />
                  </div>
                  <div>
                    <p className="font-semibold text-ypd-white">Онлайн</p>
                    <p className="text-xs text-ypd-muted">Прямая трансляция</p>
                  </div>
                </div>
                <p className="text-ypd-dim text-sm mb-6 leading-relaxed">
                  Смотрите конференцию из любого места — прямой эфир со всеми
                  докладами и дискуссиями
                </p>
                <ul className="space-y-3">
                  {[
                    "Прямая трансляция всех докладов",
                    "Запись выступлений",
                    "Доступ к презентациям",
                    "Онлайн Q&A со спикерами",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ypd-dim">
                      <Icon name="Check" size={14} className="text-ypd-dim flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setForm((f) => ({ ...f, format: "online" }));
                    scrollTo("register");
                  }}
                  className="mt-8 w-full border border-ypd-border hover:border-ypd-muted text-ypd-dim hover:text-ypd-white py-3 rounded transition-all"
                >
                  Смотреть онлайн
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="py-24 border-t border-ypd-border">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">
              Для кого
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-12">
              Аудитория конференции
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {AUDIENCE.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="border border-ypd-border bg-ypd-dark rounded-xl p-5 text-center hover:border-ypd-muted transition-colors duration-200 h-full">
                  <Icon
                    name={item.icon}
                    size={24}
                    className="text-ypd-red mx-auto mb-3"
                  />
                  <p className="text-xs text-ypd-dim leading-snug">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-ypd-border">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-12">Часто задаваемые вопросы</h2>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-4">
            {[
              {
                q: "Нужно ли платить за участие?",
                a: "Участие в конференции бесплатное. Требуется только предварительная регистрация.",
              },
              {
                q: "Где будет проходить конференция?",
                a: "Мероприятие проходит в гибридном формате:\n— Офлайн: Москва, Цифровое деловое пространство «Новатор»\n— Онлайн: прямая трансляция (ссылка придёт на почту после регистрации)",
              },
              {
                q: "Нужна ли предварительная регистрация на офлайн?",
                a: "Да, количество мест ограничено. После регистрации вы получите подтверждение на email.",
              },
              {
                q: "Будет ли запись выступлений?",
                a: "Да. Онлайн-участники получат доступ к записи всех докладов после конференции. Офлайн-участники — тоже.",
              },
              {
                q: "Можно ли сменить формат участия (офлайн → онлайн)?",
                a: "Да, но не позднее чем за 3 дня до конференции. Для этого нужно написать на почту организаторам.",
              },
              {
                q: "Будут ли раздаточные материалы?",
                a: "Офлайн-участникам — бейджи, кофе-брейк и нетворкинг. Электронные презентации спикеров получат все зарегистрированные участники.",
              },
              {
                q: "Подходит ли конференция для новичков в pet-индустрии?",
                a: "Да. Программа рассчитана как на экспертов, так и на тех, кто только начинает путь в pet-технологиях, дизайне и digital-продуктах.",
              },
              {
                q: "Будут ли спикеры отвечать на вопросы?",
                a: "Да. После каждого доклада предусмотрено время для Q&A. Также можно задать вопросы в чате онлайн-трансляции.",
              },
              {
                q: "Как получить ссылку на трансляцию?",
                a: "После регистрации придёт письмо с подтверждением. За день до конференции мы вышлем персональную ссылку на онлайн-трансляцию.",
              },
              {
                q: "Есть вопрос, которого нет в списке. Куда написать?",
                a: "Напишите нам: petday@yandex.ru — ответим в течение 24 часов.",
              },
            ].map((item, i) => (
              <FaqItem key={i} index={i + 1} question={item.q} answer={item.a} />
            ))}
          </div>

          <Reveal>
            <div className="mt-16 border border-ypd-border rounded-2xl bg-ypd-dark p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">Поддержка</span>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-3 mb-3">Остались вопросы?</h3>
                  <p className="text-ypd-dim text-sm leading-relaxed">Напишите нам — ответим в течение 24 часов.</p>
                </div>
                <FaqContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REGISTER */}
      <section id="register" className="py-24 border-t border-ypd-border bg-ypd-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <span className="font-mono text-xs text-ypd-red uppercase tracking-widest">
                Регистрация
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
                Забронируйте место
              </h2>
              <p className="text-ypd-dim leading-relaxed mb-8">
                Количество офлайн-мест ограничено. Зарегистрируйтесь сейчас,
                чтобы гарантировать своё присутствие на мероприятии.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "Calendar", text: "20 июня 2025, начало в 11:00" },
                  { icon: "MapPin", text: "ЦДП «Новатор», Москва" },
                  { icon: "Globe", text: "Онлайн-трансляция для всех участников" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 text-sm text-ypd-dim"
                  >
                    <Icon
                      name={item.icon}
                      size={16}
                      className="text-ypd-red flex-shrink-0"
                    />
                    {item.text}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={150}>
              {submitted ? (
                <div className="border border-ypd-border rounded-xl p-10 text-center bg-ypd-card">
                  <div className="w-16 h-16 bg-ypd-red/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="CheckCircle" size={32} className="text-ypd-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-ypd-white mb-3">
                    Заявка принята!
                  </h3>
                  <p className="text-ypd-dim">
                    Мы свяжемся с вами для подтверждения участия. Ждём вас 20
                    июня!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-ypd-muted hover:text-ypd-dim transition-colors"
                  >
                    Подать ещё одну заявку
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="border border-ypd-border rounded-xl p-8 bg-ypd-card space-y-5"
                >
                  <div>
                    <label className="block text-xs font-mono text-ypd-muted uppercase tracking-widest mb-2">
                      ФИО *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="w-full bg-ypd-black border border-ypd-border rounded-lg px-4 py-3 text-ypd-white placeholder:text-ypd-muted text-sm focus:outline-none focus:border-ypd-muted transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-ypd-muted uppercase tracking-widest mb-2">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ivan@company.ru"
                      className="w-full bg-ypd-black border border-ypd-border rounded-lg px-4 py-3 text-ypd-white placeholder:text-ypd-muted text-sm focus:outline-none focus:border-ypd-muted transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-ypd-muted uppercase tracking-widest mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full bg-ypd-black border border-ypd-border rounded-lg px-4 py-3 text-ypd-white placeholder:text-ypd-muted text-sm focus:outline-none focus:border-ypd-muted transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-ypd-muted uppercase tracking-widest mb-2">
                      Компания
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      placeholder="Название компании"
                      className="w-full bg-ypd-black border border-ypd-border rounded-lg px-4 py-3 text-ypd-white placeholder:text-ypd-muted text-sm focus:outline-none focus:border-ypd-muted transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-ypd-muted uppercase tracking-widest mb-2">
                      Формат участия *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["offline", "online"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setForm({ ...form, format: f })}
                          className={`py-3 rounded-lg text-sm font-medium transition-all border ${
                            form.format === f
                              ? "bg-ypd-red border-ypd-red text-white"
                              : "border-ypd-border text-ypd-dim hover:border-ypd-muted"
                          }`}
                        >
                          {f === "offline" ? "Офлайн" : "Онлайн"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-ypd-red hover:bg-ypd-red-hover text-white font-semibold py-4 rounded-lg transition-colors mt-2"
                  >
                    Зарегистрироваться
                  </button>
                  <p className="text-xs text-ypd-muted text-center leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с{" "}
                    <a
                      href="#"
                      className="text-ypd-dim hover:text-ypd-white underline underline-offset-2 transition-colors"
                    >
                      политикой конфиденциальности
                    </a>
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ypd-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-ypd-red rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Y</span>
                </div>
                <span className="font-semibold text-sm text-ypd-white">
                  Yandex Pet Day
                </span>
              </div>
              <p className="text-xs text-ypd-muted">Организатор: Яндекс</p>
              <a
                href="mailto:petday@yandex.ru"
                className="text-xs text-ypd-dim hover:text-ypd-white transition-colors mt-1 block"
              >
                petday@yandex.ru
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 text-xs">
              <div>
                <p className="text-ypd-dim font-medium mb-2">Навигация</p>
                {navLinks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="block text-ypd-muted hover:text-ypd-dim transition-colors mt-1"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-ypd-dim font-medium mb-2">Участие</p>
                <button
                  onClick={() => {
                    setForm((f) => ({ ...f, format: "offline" }));
                    scrollTo("register");
                  }}
                  className="block text-ypd-muted hover:text-ypd-dim transition-colors mt-1"
                >
                  Регистрация офлайн
                </button>
                <button
                  onClick={() => {
                    setForm((f) => ({ ...f, format: "online" }));
                    scrollTo("register");
                  }}
                  className="block text-ypd-muted hover:text-ypd-dim transition-colors mt-1"
                >
                  Смотреть онлайн
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-ypd-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ypd-muted">
              © Yandex Pet Day, 2025. Все права защищены.
            </p>
            <a
              href="#"
              className="text-xs text-ypd-muted hover:text-ypd-dim transition-colors underline underline-offset-2"
            >
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
import Link from "next/link";
import { 
  Laptop, 
  CalendarDays, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-slate-100 font-sans antialiased selection:bg-brand/30 selection:text-brand relative overflow-hidden">
      
      <div className="absolute inset-0 max-w-7xl mx-auto -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] h-[550px] w-[550px] rounded-full bg-purple-accent/15 blur-[140px] animate-aurora-first" />
        <div className="absolute top-[15%] right-[5%] h-[500px] w-[500px] rounded-full bg-brand/15 blur-[140px] animate-aurora-second" />
        
                <div className="absolute bottom-[-20%] left-[20%] h-[600px] w-[600px] rounded-full bg-purple-accent/10 blur-[160px] animate-aurora-first" />
      </div>

      <section className="relative overflow-hidden py-24 sm:py-36 border-b border-dark-border/50">
        <div className="mx-auto max-w-4xl px-4 text-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_#ec4899] animate-pulse" />
            Открытый коворкинг FlexDesk v2.0
          </div>
          
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl bg-gradient-to-r from-white via-slate-200 to-purple-accent bg-clip-text text-transparent">
            Пространство для вашей продуктивности
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed text-balance">
            Почасовая аренда рабочих мест в технологичном пространстве. Выбирайте свободный стол, бронируйте за 2 клика и приступайте к работе.
          </p>
          
          <div className="mt-10 flex items-center justify-center">
            <Link
               href="/desks"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-purple-accent px-8 py-4 text-base font-bold text-white shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Начать бронирование
                  <ArrowRight className="h-5 w-5" />
              </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 border-b border-dark-border/30">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Простой гостевой доступ
            </h2>
            <p className="mt-3 text-slate-400">
              Никаких долгих регистраций и подтверждений почты — бронируйте сразу
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="relative rounded-2xl border border-dark-border bg-dark-card/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-purple-accent/40 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-accent/10 text-purple-accent mb-6 group-hover:bg-purple-accent/20 transition-colors">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Кликните на таймлайн</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Интерактивная сетка показывает доступность мест в реальном времени. Первым кликом выберите начало, вторым — конец интервала.
              </p>
            </div>

            <div className="relative rounded-2xl border border-dark-border bg-dark-card/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-brand/40 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-6 group-hover:bg-brand/20 transition-colors">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Введите контакты</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Система не требует паролей. Достаточно ввести ваше Имя и Телефон для подтверждения брони прямо перед отправкой.
              </p>
            </div>

            <div className="relative rounded-2xl border border-dark-border bg-dark-card/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-purple-accent/40 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-accent/10 text-purple-accent mb-6 group-hover:bg-purple-accent/20 transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Мгновенная бронь</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Транзакции СУБД на уровне защиты <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs text-brand font-mono font-bold">Serializable</code> гарантируют: ваше время останется за вами.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border-l-4 border-brand border-y border-r border-dark-border bg-dark-card/40 p-8 sm:p-12 backdrop-blur-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <CalendarDays className="h-6 w-6 text-brand" />
              <h2 className="text-2xl font-bold text-white">Правила нашего коворкинга</h2>
            </div>
            <ul className="space-y-5 text-slate-300 text-sm sm:text-base">
              <li className="flex items-start gap-3.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-accent mt-0.5" />
                <span>Рабочее время коворкинга: ежедневно с 08:00 до 22:00.</span>
              </li>
              <li className="flex items-start gap-3.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-accent mt-0.5" />
                <span>При отмене бронирования более чем за 1 час до начала, средства сохраняются на вашем балансе.</span>
              </li>
              <li className="flex items-start gap-3.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-accent mt-0.5" />
                <span>В зонах <span className="text-white font-semibold">Quiet Zone</span> запрещены громкие разговоры и звонки без гарнитуры.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="mt-auto py-8 bg-dark-card/20 border-t border-dark-border/20 text-center text-xs text-slate-500 relative z-10">
        &copy; {new Date().getFullYear()} FlexDesk Shared Space. Все права защищены.
      </footer>
    </div>
  );
}
export const dynamic = "force-dynamic";

import Link from "next/link";
import { CheckCircle2, Calendar, Armchair, Wallet, ArrowRight, User, Phone, MapPin, Clock } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{
    name?: string;
    phone?: string;
    desk?: string;
    area?: string;
    hours?: string;
    timeRange?: string;
    total?: string;
    date?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-dark-bg text-slate-200 relative overflow-hidden flex items-center justify-center px-4 py-12 w-full box-border">
      
      <div className="absolute inset-0 max-w-7xl mx-auto -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[25%] left-[20%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <div className="w-full max-w-md flex flex-col gap-6 animate-fade-in relative z-10 min-w-0">
        
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)] border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-white mt-1 tracking-tight">Место зарезервировано!</h1>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Электронный посадочный билет. Покажите его администратору при входе.</p>
        </div>

        <div className="relative bg-dark-card border border-dark-border rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden w-full box-border min-w-0">
          
          <div className="p-5 sm:p-6 flex flex-col gap-4 border-b border-dashed border-dark-border relative w-full box-border">
            
            <div className="absolute bottom-[-10px] left-[-9px] h-5 w-[18px] bg-dark-bg border border-dark-border rounded-full" />
            <div className="absolute bottom-[-10px] right-[-9px] h-5 w-[18px] bg-dark-bg border border-dark-border rounded-full" />

            <div className="flex justify-between items-start gap-4 w-full">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Гостевой доступ</span>
                <h2 className="text-xl font-black text-white mt-2 tracking-tight truncate">{params.desk || "Рабочее место"}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
                  <MapPin className="h-3.5 w-3.5 text-purple-accent shrink-0" />
                  Зона: <span className="text-slate-200 font-semibold">{params.area || "Open Space"}</span>
                </p>
              </div>
              <Armchair className="h-7 w-7 text-brand drop-shadow-[0_0_10px_#ec4899] shrink-0 mt-1" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 border-t border-dark-border/40 pt-4 text-[11px] sm:text-xs w-full box-border">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider truncate">Дата визита</span>
                <span className="text-white font-bold flex items-center gap-1 truncate">
                  <Calendar className="h-3.5 w-3.5 text-brand shrink-0" />
                  {params.date || "Сегодня"}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider truncate">Время аренды</span>
                <span className="text-white font-bold flex items-center gap-1 truncate font-mono text-[10px] sm:text-xs">
                  <Clock className="h-3.5 w-3.5 text-purple-accent shrink-0" />
                  {params.timeRange || "08:00–09:00"}
                </span>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider truncate">Длительность</span>
                <span className="text-white font-bold flex items-center gap-1 truncate">
                  <span className="text-slate-400 font-normal shrink-0">~ </span>
                  {params.hours || "1"} {params.hours === "1" ? "час" : Number(params.hours || 0) < 5 ? "часа" : "часов"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-slate-950/30 flex flex-col gap-4 w-full box-border">
            <div className="flex flex-col gap-1.5 text-xs w-full min-w-0">
              <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider">Зарегистрированный гость</span>
              <div className="flex items-center justify-between gap-4 text-slate-300 w-full min-w-0">
                <span className="flex items-center gap-1.5 font-bold text-white truncate min-w-0">
                  <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{params.name || "Гость коворкинга"}</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                  <Phone className="h-3 w-3 text-slate-500" />
                  {params.phone || "—"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-dark-border/30 pt-4 mt-1 w-full gap-4">
              <div className="flex flex-col shrink-0">
                <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider">К оплате на месте</span>
                <span className="text-white font-black text-xl tracking-tight mt-0.5 flex items-center gap-1">
                  <Wallet className="h-4 w-4 text-emerald-400" />
                  {params.total ? Number(params.total).toLocaleString("ru-RU") : "0"} ₽
                </span>
              </div>
              
              <div className="flex flex-col items-center gap-0.5 opacity-30 select-none shrink-0">
                <div className="h-7 w-20 sm:w-24 bg-gradient-to-r from-white via-slate-400 to-white [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_10%,rgba(0,0,0,1)_20%,rgba(0,0,0,1)_40%,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_50%,rgba(0,0,0,1)_60%,rgba(0,0,0,1)_90%,rgba(0,0,0,0)_100%)]" />
                <span className="text-[7px] font-mono tracking-widest text-slate-600">FLX-DSK-2026</span>
              </div>
            </div>

          </div>
        </div>

        <Link 
          href="/desks"
          className="flex items-center justify-center gap-2 rounded-xl bg-dark-card border border-dark-border px-5 py-3.5 text-sm font-black uppercase tracking-wider text-slate-200 transition-all hover:border-brand/40 hover:text-white cursor-pointer w-full box-border shadow-md"
        >
          Вернуться к схеме столов
          <ArrowRight className="h-4 w-4 text-brand" />
        </Link>

      </div>
    </main>
  );
}
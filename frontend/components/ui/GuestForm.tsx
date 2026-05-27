"use client";

import { memo, ChangeEvent } from "react";
import { User, Phone } from "lucide-react";

export interface GuestFormProps {
  show: boolean;
  name: string;
  phone: string;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
}

export const GuestForm = memo(function GuestForm({
  show,
  name,
  phone,
  onNameChange,
  onPhoneChange,
}: GuestFormProps) {
  if (!show) return null;

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    
    if (digits.length === 0) return "";

    let cleanNum = digits;
    if (digits.startsWith("7") || digits.startsWith("8")) {
      cleanNum = digits.substring(1);
    }

    cleanNum = cleanNum.slice(0, 10);

    if (cleanNum.length === 0) return "+7 (";
    if (cleanNum.length <= 3) return `+7 (${cleanNum}`;
    if (cleanNum.length <= 6) return `+7 (${cleanNum.slice(0, 3)}) ${cleanNum.slice(3)}`;
    if (cleanNum.length <= 8) return `+7 (${cleanNum.slice(0, 3)}) ${cleanNum.slice(3, 6)}-${cleanNum.slice(6)}`;
    return `+7 (${cleanNum.slice(0, 3)}) ${cleanNum.slice(3, 6)}-${cleanNum.slice(6, 8)}-${cleanNum.slice(8, 10)}`;
  };

  const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    if (input === "" || input === "+7" || input === "+7 (") {
      onPhoneChange("");
      return;
    }

    const formattedValue = formatPhoneNumber(input);
    onPhoneChange(formattedValue);
  };

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-dark-card/30 p-4 sm:p-5 rounded-xl border border-dark-border w-full box-border min-w-0 shadow-inner">
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 select-none">
          <User className="h-3.5 w-3.5 text-brand shrink-0" aria-hidden="true" />
          Ваше Имя
        </label>
        <input
          type="text"
          placeholder="Иван"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="rounded-lg border border-dark-border bg-dark-card px-3.5 py-2.5 text-sm text-white placeholder:text-slate-700 focus:border-brand focus:outline-none w-full box-border min-w-0 transition-all"
        />
      </div>
      
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 select-none">
          <Phone className="h-3.5 w-3.5 text-purple-accent shrink-0" aria-hidden="true" />
          Телефон
        </label>
        <input
          type="tel"
          placeholder="+7 (999) 000-00-00"
          value={phone}
          onChange={handlePhoneInput}
          className="rounded-lg border border-dark-border bg-dark-card px-3.5 py-2.5 text-sm text-white placeholder:text-slate-700 focus:border-brand focus:outline-none w-full box-border min-w-0 transition-all font-mono"
        />
      </div>
    </div>
  );
});
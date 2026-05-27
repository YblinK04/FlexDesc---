export const dynamic = "force-dynamic"; 

import { DesksInteractiveMap } from "@/components/booking/DesksInteractiveMap";

export default function DesksMapPage() {
  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 max-w-7xl mx-auto -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-accent/10 blur-[150px] animate-aurora-first" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[550px] w-[550px] rounded-full bg-brand/10 blur-[140px] animate-aurora-second" />
      </div>

      <DesksInteractiveMap />
    </div>
  );
}
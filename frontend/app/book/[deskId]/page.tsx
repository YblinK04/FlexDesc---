export const dynamic = "force-dynamic";

import { DeskBookingView } from "@/components/booking/DeskBookingView";

interface BookDeskPageProps {
  params: Promise<{
    deskId: string;
  }>;
}

export default async function BookDeskPage({ params }: BookDeskPageProps) {
  const resolvedParams = await params;
  const { deskId } = resolvedParams;

  return (
    <main className="min-h-screen bg-dark-bg relative overflow-hidden mx-auto px-2 sm:px-4 py-4 sm:py-8 w-full box-border">
      
      <div className="absolute inset-0 max-w-7xl mx-auto -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-purple-accent/10 blur-[130px] animate-aurora-first" />
        <div className="absolute bottom-[5%] right-[-5%] h-[450px] w-[450px] rounded-full bg-brand/10 blur-[120px] animate-aurora-second" />
      </div>

      <div className="mx-auto max-w-4xl w-full box-border">
        <DeskBookingView deskId={deskId} />
      </div>
    </main>
  );
}
import VehicleSelector from "@/components/shared/VehicleSelector";
import { Toaster } from "sonner";


export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <VehicleSelector />
      </main>
      <Toaster richColors/>
    </>
  );
}

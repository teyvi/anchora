import './App.css'
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter} from "react-router-dom";
import AppRoutes from './layout/appLayout';
import { AuthProvider } from './context/authContext';


const queryClient = new QueryClient();
const  App = () =>  {
  return (
    <>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
       <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
    </>
  )
}

export default App

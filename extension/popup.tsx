import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import Index from '@/pages/Index';
import '@/index.css';
import './popup.css';

const PopupApp = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <TooltipProvider>
      <div className="flowmodoro-popup">
        <Index />
      </div>
    </TooltipProvider>
  </ThemeProvider>
);

createRoot(document.getElementById('root')!).render(<PopupApp />);

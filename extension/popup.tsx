import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
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
        <div className="popup-theme-toggle">
          <ThemeToggle />
        </div>
        <Index />
      </div>
    </TooltipProvider>
  </ThemeProvider>
);

createRoot(document.getElementById('root')!).render(<PopupApp />);

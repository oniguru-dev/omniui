import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { Alert, AlertTitle, AlertDescription } from '@/components/Alert';
import type { ComponentChildren } from 'preact';

interface AlertItem {
  id: string; variant: 'default' | 'warning' | 'danger' | 'success';
  title: string; description: string; time?: number;
}

interface AlertContextType {
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
}

const AlertContext = createContext<AlertContextType>({
  addAlert: () => {}
});

export interface AlertProviderProps {
  children: ComponentChildren;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = (alert: Omit<AlertItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const max = window.innerWidth < 768 ? 2 : 6;
    setAlerts(prev => [{ ...alert, id }, ...prev].slice(0, max));
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ addAlert }}> {children}
      {alerts.length > 0 && (
        <div class="fixed top-24 right-5 md:right-10 z-100 max-w-sm w-[calc(100%-2.5rem)] flex flex-col gap-3 pointer-events-none">
          {alerts.map(alert => (
            <Alert
              key={alert.id} variant={alert.variant} time={alert.time}
              onClose={() => removeAlert(alert.id)}
            >
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
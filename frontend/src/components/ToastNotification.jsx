import React from 'react';
import { useMachine } from '../context/MachineContext';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export const ToastNotification = () => {
  const { toastMessage } = useMachine();

  if (!toastMessage) return null;

  const getIcon = () => {
    if (toastMessage.type === 'success') return <CheckCircle2 className="w-5 h-5 text-statusGreen" />;
    if (toastMessage.type === 'warning') return <AlertTriangle className="w-5 h-5 text-statusAmber" />;
    if (toastMessage.type === 'error') return <AlertOctagon className="w-5 h-5 text-statusRed" />;
    return <Info className="w-5 h-5 text-cyanAccent" />;
  };

  const getBorder = () => {
    if (toastMessage.type === 'success') return 'border-statusGreen text-textPrimary shadow-glow-green';
    if (toastMessage.type === 'warning') return 'border-statusAmber text-textPrimary shadow-glow-amber';
    if (toastMessage.type === 'error') return 'border-statusRed text-textPrimary shadow-glow-red';
    return 'border-cyanAccent text-textPrimary shadow-glow-cyan';
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-cardBg border ${getBorder()} flex items-center gap-3 backdrop-blur shadow-2xl animate-in fade-in slide-in-from-bottom-5 font-medium text-xs`}>
      {getIcon()}
      <span>{toastMessage.message}</span>
    </div>
  );
};

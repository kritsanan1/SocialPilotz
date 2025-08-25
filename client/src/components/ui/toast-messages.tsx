
import { toast } from '@/hooks/use-toast';

export const showSuccessToast = (message: string) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
  });
};

export const showErrorToast = (message: string) => {
  toast({
    title: "Error", 
    description: message,
    variant: "destructive",
  });
};

export const showWarningToast = (message: string) => {
  toast({
    title: "Warning",
    description: message,
    variant: "default",
  });
};

export const showInfoToast = (message: string) => {
  toast({
    title: "Info",
    description: message,
    variant: "default",
  });
};

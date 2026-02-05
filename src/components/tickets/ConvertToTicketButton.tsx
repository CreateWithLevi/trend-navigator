import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon, Check } from 'lucide-react';
import { useTickets } from '@/contexts/TicketContext';
import { PrioritizedAction } from '@/types/prioritization';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ConvertToTicketButtonProps {
  action: PrioritizedAction;
}

export const ConvertToTicketButton = ({ action }: ConvertToTicketButtonProps) => {
  const { tickets, convertActionToTicket } = useTickets();
  const [isConverted, setIsConverted] = useState(() =>
    tickets.some((t) => t.sourceActionId === action.id)
  );

  const handleConvert = () => {
    if (isConverted) return;

    convertActionToTicket(action);
    setIsConverted(true);
    toast({
      title: 'Ticket Created',
      description: `"${action.title}" has been added to your Action Board.`,
    });
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant={isConverted ? 'secondary' : 'outline'}
        size="sm"
        onClick={handleConvert}
        disabled={isConverted}
        className={
          isConverted
            ? 'bg-primary/20 text-primary border-primary/50'
            : 'hover:bg-primary/10 hover:border-primary/50'
        }
      >
        {isConverted ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Added to Board
          </>
        ) : (
          <>
            <TicketIcon className="w-4 h-4 mr-1" />
            Convert to Ticket
          </>
        )}
      </Button>
    </motion.div>
  );
};

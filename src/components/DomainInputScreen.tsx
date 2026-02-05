import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Globe, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DomainInputScreenProps {
  onDomainSubmit: (domain: string) => void;
}

const suggestedDomains = [
  'DeFi investment tools',
  'AI productivity',
  'Creator monetization',
  'SaaS automation',
  'Web3 gaming',
  'Climate tech',
];

export const DomainInputScreen = ({ onDomainSubmit }: DomainInputScreenProps) => {
  const [domain, setDomain] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onDomainSubmit(domain.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDomain(suggestion);
    onDomainSubmit(suggestion);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo and title */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <Globe className="w-12 h-12 text-primary" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold gradient-text">Opportunity Radar</h1>
        </motion.div>

        <motion.p
          className="text-muted-foreground text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Discover global opportunities in your domain through AI-powered event intelligence
        </motion.p>

        {/* AI Question */}
        <motion.div
          className="glass-panel p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-foreground text-left text-lg">
              Which domain or industry are you currently interested in?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="e.g., DeFi investment tools, AI productivity, SaaS automation..."
                className="h-14 text-lg bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 pr-14"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!domain.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Suggested domains */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Popular domains:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedDomains.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 text-sm rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features preview */}
        <motion.div
          className="grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { icon: Globe, label: 'Global Events' },
            { icon: TrendingUp, label: 'Heat Metrics' },
            { icon: Sparkles, label: 'AI Insights' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-muted-foreground">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

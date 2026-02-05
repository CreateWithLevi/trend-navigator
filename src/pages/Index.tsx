import { useState } from 'react';
import { DomainInputScreen } from '@/components/DomainInputScreen';
import { GlobalEventHeatmapScreen } from '@/components/GlobalEventHeatmapScreen';

const Index = () => {
  const [userDomain, setUserDomain] = useState<string | null>(null);

  const handleDomainSubmit = (domain: string) => {
    setUserDomain(domain);
  };

  const handleReset = () => {
    setUserDomain(null);
  };

  if (!userDomain) {
    return <DomainInputScreen onDomainSubmit={handleDomainSubmit} />;
  }

  return <GlobalEventHeatmapScreen domain={userDomain} onReset={handleReset} />;
};

export default Index;


import { useState } from 'react';

type ProfileTab = 'activity' | 'stats' | 'matches' | 'achievements' | 'edit';

export function useProfileTabs() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('activity');
  
  return {
    activeTab,
    setActiveTab,
  };
}

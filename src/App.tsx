import { useEffect, useState } from 'react';
import { initializeThemeListener } from '@/store/useThemeStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useSecondOrderStore } from '@/store/useSecondOrderStore';
import { usePidStore } from '@/store/usePidStore';
import { useDCMotorStore } from '@/store/useDCMotorStore';
import { useChallengeStore } from '@/store/useChallengeStore';
import { useTranslation } from '@/store/useLocaleStore';
import { HapticService } from '@/services/haptics/HapticService';
import type { Project } from '@/services/storage/db';

import HomeScreen from '@/features/home/HomeScreen';
import ProjectsScreen from '@/features/projects/ProjectsScreen';
import SettingsScreen from '@/features/settings/SettingsScreen';

import FirstOrderLab from '@/features/labs/FirstOrderLab';
import SecondOrderLab from '@/features/labs/SecondOrderLab';
import PidLab from '@/features/labs/PidLab';
import DCMotorLab from '@/features/labs/DCMotorLab';

import { Home, FlaskConical, Folder, Settings } from 'lucide-react';

type AppView = 'HOME' | 'LABS' | 'PROJECTS' | 'SETTINGS';
type LabType = 'FIRST_ORDER' | 'SECOND_ORDER' | 'PID' | 'DC_MOTOR';

function App() {
  const { loadProjects } = useProjectStore();
  const { clearChallenge } = useChallengeStore();
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [activeTab, setActiveTab] = useState<LabType>('PID');

  useEffect(() => {
    const cleanup = initializeThemeListener();
    return cleanup;
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleNavigateToLab = (labType: LabType) => {
    setActiveTab(labType);
    setCurrentView('LABS');
  };

  const handleSwitchTab = (labType: LabType) => {
    HapticService.triggerSelection();
    clearChallenge();
    setActiveTab(labType);
  };

  const handleSwitchView = (view: AppView) => {
    HapticService.triggerSelection();
    if (view !== 'LABS') clearChallenge();
    setCurrentView(view);
  };

  const handleLoadProject = (project: Project) => {
    const p = project.parameters as any;
    switch (project.labType) {
      case 'FIRST_ORDER':
        useFirstOrderStore.getState().setParameters(p.K, p.tau);
        break;
      case 'SECOND_ORDER':
        useSecondOrderStore.getState().setParameters(p.K, p.zeta, p.wn);
        break;
      case 'PID':
        usePidStore.getState().setParameters(p.Kp, p.Ki, p.Kd, p.setpoint);
        break;
      case 'DC_MOTOR':
        useDCMotorStore.getState().setParameters(p.Kp, p.Kd, p.setpoint);
        break;
    }
    handleNavigateToLab(project.labType as LabType);
  };

  return (
    <div className="min-h-screen bg-background-base text-text-primary flex flex-col items-center p-4 md:p-8 transition-colors duration-200">
      
      {currentView === 'HOME' && (
        <HomeScreen onNavigateToLab={handleNavigateToLab} onLoadProject={handleLoadProject} />
      )}
      
      {currentView === 'PROJECTS' && (
        <ProjectsScreen onLoadProject={(labType) => handleNavigateToLab(labType)} />
      )}
      
      {currentView === 'SETTINGS' && (
        <SettingsScreen />
      )}
      
      {currentView === 'LABS' && (
        <div className="w-full flex flex-col items-center pb-24">
          {/* Navigation Tab Bar for Labs */}
          <div className="flex bg-background-surface border border-border-strong rounded-lg p-1 mb-6 flex-wrap justify-center gap-1">
            <button
              onClick={() => handleSwitchTab('FIRST_ORDER')}
              className={`px-6 py-2 rounded-md font-medium transition-colors text-sm ${
                activeTab === 'FIRST_ORDER' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              First-Order
            </button>
            <button
              onClick={() => handleSwitchTab('SECOND_ORDER')}
              className={`px-6 py-2 rounded-md font-medium transition-colors text-sm ${
                activeTab === 'SECOND_ORDER' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Second-Order
            </button>
            <button
              onClick={() => handleSwitchTab('PID')}
              className={`px-6 py-2 rounded-md font-medium transition-colors text-sm ${
                activeTab === 'PID' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              PID Controller
            </button>
            <button
              onClick={() => handleSwitchTab('DC_MOTOR')}
              className={`px-6 py-2 rounded-md font-medium transition-colors text-sm ${
                activeTab === 'DC_MOTOR' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              DC Motor
            </button>
          </div>
          
          {activeTab === 'FIRST_ORDER' && <FirstOrderLab />}
          {activeTab === 'SECOND_ORDER' && <SecondOrderLab />}
          {activeTab === 'PID' && <PidLab />}
          {activeTab === 'DC_MOTOR' && <DCMotorLab />}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-surface border-t border-border-strong shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-50 px-6 pb-4 pt-2">
        <div className="max-w-md mx-auto flex justify-between items-center h-16">
          <button 
            onClick={() => handleSwitchView('HOME')}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${currentView === 'HOME' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t('nav.home')}</span>
          </button>
          
          <button 
            onClick={() => handleSwitchView('LABS')}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${currentView === 'LABS' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <FlaskConical className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t('nav.labs')}</span>
          </button>
          
          <button 
            onClick={() => handleSwitchView('PROJECTS')}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${currentView === 'PROJECTS' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <Folder className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t('nav.projects')}</span>
          </button>
          
          <button 
            onClick={() => handleSwitchView('SETTINGS')}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${currentView === 'SETTINGS' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t('nav.settings')}</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default App;

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoginScreen from './components/LoginScreen';
import LoadingScreen from './components/LoadingScreen';
import PersonalDataScreen from './components/PersonalDataScreen';
import DashboardScreen from './components/DashboardScreen';
import AddTankScreen from './components/AddTankScreen';
import RegisterReadingScreen from './components/RegisterReadingScreen';
import ProfileScreen from './components/ProfileScreen';
import { useDashboardData } from './hooks/useDashboardData';
import type { Tank } from './types/dashboard';

export type Screen =
  | 'login'
  | 'loading'
  | 'personalData'
  | 'dashboard'
  | 'addTank'
  | 'registerReading'
  | 'profile';

export type { Tank } from './types/dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const {
    alerts,
    addTank,
    dataOrigin,
    error,
    hasCachedData,
    isLoading,
    isOnline,
    isRefreshing,
    isSyncing,
    lastUpdatedAt,
    pendingSyncCount,
    refreshDashboard,
    registerReading,
    summary,
    tanks,
  } = useDashboardData();

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 26 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -26 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.35,
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <LoginScreen onNavigate={navigateTo} />
          </motion.div>
        )}

        {currentScreen === 'loading' && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <LoadingScreen onNavigate={navigateTo} />
          </motion.div>
        )}

        {currentScreen === 'personalData' && (
          <motion.div
            key="personalData"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <PersonalDataScreen onNavigate={navigateTo} />
          </motion.div>
        )}

        {currentScreen === 'dashboard' && (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <DashboardScreen
              alerts={alerts}
              dataOrigin={dataOrigin}
              error={error}
              hasCachedData={hasCachedData}
              isLoading={isLoading}
              isOnline={isOnline}
              isRefreshing={isRefreshing}
              isSyncing={isSyncing}
              lastUpdatedAt={lastUpdatedAt}
              onNavigate={navigateTo}
              onRefresh={() => {
                refreshDashboard({ silent: true });
              }}
              pendingSyncCount={pendingSyncCount}
              summary={summary}
              tanks={tanks}
            />
          </motion.div>
        )}

        {currentScreen === 'addTank' && (
          <motion.div
            key="addTank"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <AddTankScreen onNavigate={navigateTo} onAddTank={addTank} />
          </motion.div>
        )}

        {currentScreen === 'registerReading' && (
          <motion.div
            key="registerReading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <RegisterReadingScreen
              tanks={tanks}
              isOnline={isOnline}
              onNavigate={navigateTo}
              onUpdateReading={registerReading}
              pendingSyncCount={pendingSyncCount}
            />
          </motion.div>
        )}

        {currentScreen === 'profile' && (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ProfileScreen tanks={tanks} onNavigate={navigateTo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

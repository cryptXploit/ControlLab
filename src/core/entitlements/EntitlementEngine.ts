export const EntitlementEngine = {
  canSaveNewProject: (currentProjectCount: number, isPro: boolean): { allowed: boolean; message?: string } => {
    if (isPro) {
      return { allowed: true };
    }
    
    if (currentProjectCount >= 3) {
      return {
        allowed: false,
        message: 'Free tier limit reached. Upgrade to Pro for unlimited projects.'
      };
    }
    
    return { allowed: true };
  }
};

import { Activity, RefreshCcw, Settings, BarChart, Crosshair, Radar, GitMerge, Zap } from 'lucide-react';

export function ToolIcon({ id, className = '' }: { id: string, className?: string }) {
  const renderIcon = () => {
    switch (id) {
      case 'first-order':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
            <Activity className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      case 'second-order':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300">
            <Zap className="w-6 h-6 text-indigo-500 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      case 'pid':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300 overflow-hidden">
            <RefreshCcw className="w-6 h-6 text-emerald-500 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      case 'dc-motor':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 group-hover:border-amber-500/40 transition-all duration-300">
            <Settings className="w-6 h-6 text-amber-500 group-hover:animate-spin" />
            <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      case 'bode':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
            <BarChart className="w-6 h-6 text-purple-500 group-hover:scale-y-125 transition-transform duration-300 origin-bottom" />
            <div className="absolute inset-0 rounded-2xl bg-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      case 'pole-zero':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 group-hover:border-rose-500/40 transition-all duration-300">
            <Crosshair className="w-6 h-6 text-rose-500 group-hover:scale-125 group-hover:rotate-90 transition-transform duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-rose-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      case 'nyquist':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all duration-300">
            <Radar className="w-6 h-6 text-cyan-500 group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out" />
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      case 'root-locus':
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 group-hover:border-orange-500/40 transition-all duration-300">
            <GitMerge className="w-6 h-6 text-orange-500 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-orange-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      default:
        return (
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20 group-hover:border-gray-500/40 transition-all duration-300">
            <Activity className="w-6 h-6 text-gray-500" />
          </div>
        );
    }
  };

  return (
    <div className={`shrink-0 ${className}`}>
      {renderIcon()}
    </div>
  );
}

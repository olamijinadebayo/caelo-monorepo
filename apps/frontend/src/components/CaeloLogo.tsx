const CaeloLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 bg-caelo-navy rounded-sm flex items-center justify-center">
        <div className="w-3 h-3 border border-white rounded-full"></div>
      </div>
      <span className="text-xl font-semibold text-caelo-navy">Caelo</span>
    </div>
  );
};

export default CaeloLogo;
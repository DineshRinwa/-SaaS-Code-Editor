const FeatureCategory = ({ children, label }) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
  
  export default FeatureCategory;
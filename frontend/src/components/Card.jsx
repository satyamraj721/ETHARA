const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-xl font-semibold text-slate-900">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;

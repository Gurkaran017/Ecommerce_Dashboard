const EmptyState = ({ title, body, action }) => (
  <div className="border-t border-line py-20 text-center">
    <h2 className="font-display text-2xl">{title}</h2>
    {body && (
      <p className="mx-auto mt-2 max-w-sm text-[0.8125rem] leading-relaxed text-muted">
        {body}
      </p>
    )}
    {action && <div className="mt-7 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;

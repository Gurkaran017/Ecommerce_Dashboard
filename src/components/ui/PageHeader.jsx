const PageHeader = ({ title, lead, actions }) => (
  <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
    <div>
      <h1 className="font-display text-[2.25rem] leading-none">{title}</h1>
      {lead && <p className="mt-2 text-[0.8125rem] text-muted">{lead}</p>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </header>
);

export default PageHeader;

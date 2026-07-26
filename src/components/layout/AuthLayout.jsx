/** One centred layout shared by login, forgot and reset. */
const AuthLayout = ({ title, lead, children, footer }) => (
  <div className="grid min-h-screen place-items-center px-6 py-16">
    <div className="w-full max-w-[24rem]">
      <p className="meta mb-10 text-center uppercase tracking-[0.2em]">
        ShopMate Admin
      </p>

      <div className="border border-line bg-surface p-8">
        <h1 className="font-display text-3xl">{title}</h1>
        {lead && (
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
            {lead}
          </p>
        )}

        <div className="mt-8">{children}</div>
      </div>

      {footer && <div className="mt-6 text-center text-xs">{footer}</div>}
    </div>
  </div>
);

export default AuthLayout;

export default function BankCard({
  balance,
  lastFour,
  expiry,
  issuer,
}: {
  balance: number;
  lastFour: string;
  expiry: string;
  issuer: string;
}) {
  return (
    <div className="w-full h-[220px] bg-granate rounded-[24px] shadow-[0px_8px_30px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between relative overflow-hidden shrink-0">
      {/* Circulo decorativo de fondo */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-white/80 text-sm font-medium">Balance</span>
          <span className="text-white text-3xl font-semibold tracking-tight">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        {/* Logo dinámico */}
        <div className="flex items-center">
          {issuer === "MASTERCARD" ? (
            <div className="flex relative w-[34px] h-[24px] items-center">
              <div className="w-6 h-6 rounded-full bg-[#E9231A] absolute left-0 z-10"></div>
              <div className="w-6 h-6 rounded-full bg-[#E99418] absolute right-0 opacity-80 z-20"></div>
            </div>
          ) : (
            <span className="text-white font-inter font-bold italic text-xl">VISA</span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col gap-2">
          <span className="text-white tracking-widest text-lg font-medium">
            **** **** **** {lastFour}
          </span>
          <span className="text-white/90 text-sm font-medium">Soy Granate</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-white/60 text-[10px] uppercase font-medium">Exp. Date</span>
          <span className="text-white text-sm font-medium">{expiry}</span>
        </div>
      </div>
    </div>
  );
}
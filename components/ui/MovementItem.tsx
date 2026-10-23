type MovementType = "SUS" | "CASH_IN" | "CASH_OUT";

export default function MovementItem({
  title,
  description,
  amount,
  type,
}: {
  title: string;
  description: string;
  amount: number;
  type: MovementType;
}) {
  const isSus = type === "SUS";
  const isCashIn = type === "CASH_IN";
  const isCashOut = type === "CASH_OUT";

  return (
    <div className="w-full h-[92px] bg-white rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Caja del icono */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isSus ? "bg-sus-bg" : isCashIn ? "bg-cash-in-bg" : "bg-cash-out-bg"
          }`}
        >
          {isSus && (
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 5H5.5V15H12.5V5Z" fill="currentColor" className="text-sus" />
              <path d="M2 2V18H16V2H2ZM14 16H4V4H14V16Z" fill="currentColor" className="text-sus" />
            </svg>
          )}
          {isCashIn && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 18L6 10H10V4H14V10H18L12 18Z" fill="currentColor" className="text-cash-in" />
            </svg>
          )}
          {isCashOut && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
              <path d="M12 18L6 10H10V4H14V10H18L12 18Z" fill="currentColor" className="text-cash-out" />
            </svg>
          )}
        </div>

        {/* Textos */}
        <div className="flex flex-col">
          <span className="text-text-secondary text-base font-medium truncate max-w-[150px] sm:max-w-[200px]">
            {title}
          </span>
          <span className="text-text-muted text-xs font-normal">
            {description}
          </span>
        </div>
      </div>

      {/* Monto */}
      <span
        className={`text-sm font-normal whitespace-nowrap ${
          isSus ? "text-sus" : isCashIn ? "text-cash-in" : "text-cash-out"
        }`}
      >
        ${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}
      </span>
    </div>
  );
}
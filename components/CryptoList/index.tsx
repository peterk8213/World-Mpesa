// to change to server component

interface CryptoData {
  name: string;
  symbol: string;
  price: string;
  change: string;
  icon: string;
  iconBg: string;
}

export default function CryptoList({ crypto }: { crypto: CryptoData }) {
  return (
    <div
      key={crypto.symbol}
      className="flex items-center justify-between p-2 lg:px-10 border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full ${crypto.iconBg} text-white flex items-center justify-center text-sm font-medium`}
        >
          {crypto.icon}
        </div>
        <div>
          <h3 className="font-medium text-sm">{crypto.name}</h3>
          <p className="text-xs text-gray-500">{crypto.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-sm">
          {crypto.price === "0" ? (
            "Ksh 0"
          ) : (
            <>
              {crypto.symbol === "WLD" ? "Ksh" : "Ksh"} {crypto.price}
            </>
          )}
        </p>
        <p
          className={`text-xs ${
            crypto.change.startsWith("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {crypto.change}
        </p>
      </div>
    </div>
  );
}

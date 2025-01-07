// Define the User type
type User = {
  name: string;
  balance: number;
  baseCurrency: string;
};

export default function UserHomePageCard({ user }: { user: User }) {
  return (
    <div>
      <div className="text-center my-4">
        <p className="text-sm text-gray-500 mb-1">Welcome, {user.name}</p>
        <div className="flex items-baseline justify-center">
          <span className="text-2xl mr-1">{user.baseCurrency}</span>
          <span className="text-4xl sm:text-6xl font-medium">
            {user.balance}
          </span>
        </div>
      </div>
      ;
    </div>
  );
}

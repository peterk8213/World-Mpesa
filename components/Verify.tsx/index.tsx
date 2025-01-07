import { Button } from "@/components/ui/button";

interface VerifyBlockProps {
  onVerify: () => void;
}

export function VerifyBlock({ onVerify }: VerifyBlockProps) {
  const handleVerify = () => {
    // Simulating verification process
    setTimeout(() => {
      onVerify();
    }, 1000);
  };

  return (
    <Button
      onClick={handleVerify}
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      Verify with World ID
    </Button>
  );
}

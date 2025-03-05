import { Zap } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bounce, toast } from "react-toastify";

export const UpgradeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const userName = user?.fullName;
  const email = user?.primaryEmailAddress?.emailAddress;

  const handleUpgrade = async () => {
    toast.error("Payment Method in Beta Mode", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
        bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
        hover:from-blue-600 hover:to-blue-700 transition-all"
    >
      <Zap className="w-5 h-5" />
      {isLoading ? "Loading..." : "Upgrade to Pro"}
    </button>
  );
};

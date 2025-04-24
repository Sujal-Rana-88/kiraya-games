// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <CheckCircle2 className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800">Payment Successful</h1>
      <p className="text-gray-500 mt-2">
        Redirecting to home page in <span className="font-bold">{secondsLeft}</span> second{secondsLeft !== 1 && "s"}...
      </p>
    </div>
  );
}

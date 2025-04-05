import React, { useState } from "react";
import Modal from "@/components/ui/modal"; // Corrected import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import API_URLS from "@/config/urls";

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export default function VerifyEmailModal({ isOpen, onClose, userName }: VerifyEmailModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await axios.post(API_URLS.VERIFY_EMAIL, { userName, otp });
      toast({ title: "Verification successful", description: "You can now log in!" });
      onClose();
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid OTP or an error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Email" description="Enter the OTP sent to your email.">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full">Cancel</Button>
      </div>
    </Modal>
  );
}

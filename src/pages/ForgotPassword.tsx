
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [formData, setFormData] = useState({
    contact: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to your ${contactType}`,
      });
      setStep('verify');
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (formData.otp === "123456") {
        toast({
          title: "Verified!",
          description: "Please create your new password",
        });
        setStep('reset');
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check the code and try again",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are identical",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Password Reset Successful!",
        description: "You can now login with your new password",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-lg border-slate-700/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {step === 'request' && 'Reset Password'}
            {step === 'verify' && 'Verify OTP'}
            {step === 'reset' && 'Create New Password'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {step === 'request' && 'Enter your email or phone number to receive OTP'}
            {step === 'verify' && 'Enter the verification code we sent to you'}
            {step === 'reset' && 'Create a strong new password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'request' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={contactType === 'email' ? 'default' : 'outline'}
                  onClick={() => setContactType('email')}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={contactType === 'phone' ? 'default' : 'outline'}
                  onClick={() => setContactType('phone')}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </Button>
              </div>
              
              <div className="relative">
                {contactType === 'email' ? (
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                ) : (
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                )}
                <Input
                  type={contactType === 'email' ? 'email' : 'tel'}
                  placeholder={contactType === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
              />
              
              <Input
                type="password"
                placeholder="Confirm New Password"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;

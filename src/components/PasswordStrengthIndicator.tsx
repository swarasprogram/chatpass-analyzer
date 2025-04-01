
import React from "react";
import { Progress } from "@/components/ui/progress";
import { PasswordAnalysis, UserMode } from "@/types/chat";
import { Check, X, AlertTriangle, Info } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  analysis: PasswordAnalysis;
  userMode: UserMode;
}

const PasswordStrengthIndicator = ({ analysis, userMode }: PasswordStrengthIndicatorProps) => {
  const { score, feedback } = analysis;
  
  const getStrengthColor = () => {
    if (score < 40) return "bg-security-weak";
    if (score < 70) return "bg-security-medium";
    return "bg-security-strong";
  };
  
  const getStrengthLabel = () => {
    if (score < 40) return "Weak";
    if (score < 70) return "Medium";
    return "Strong";
  };

  const getIcon = (isValid: boolean) => {
    return isValid ? (
      <Check className="h-4 w-4 text-security-strong" />
    ) : (
      <X className="h-4 w-4 text-security-weak" />
    );
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Password Strength</span>
          <span className="text-sm">{getStrengthLabel()}</span>
        </div>
        <Progress value={score} className="h-2" indicatorClassName={getStrengthColor()} />
      </div>
      
      <div className="space-y-2 text-sm">
        {userMode === "business" && (
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md">
            <Info className="h-4 w-4 text-security-business mt-0.5" />
            <div>
              <p className="font-medium text-security-business">Business Account</p>
              <p className="text-xs">Business accounts require stronger password complexity and adherence to organizational security policies.</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {feedback.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              {item.type === 'warning' ? (
                <AlertTriangle className="h-4 w-4 text-security-medium mt-0.5" />
              ) : (
                getIcon(item.valid)
              )}
              <span className="text-xs">{item.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;

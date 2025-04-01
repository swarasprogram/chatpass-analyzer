
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Briefcase, User } from "lucide-react";
import { UserMode } from "@/types/chat";

interface ModeToggleProps {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

const ModeToggle = ({ userMode, setUserMode }: ModeToggleProps) => {
  const handleToggle = () => {
    setUserMode(userMode === "personal" ? "business" : "personal");
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {userMode === "personal" ? (
          <User className="h-4 w-4 text-security-personal" />
        ) : (
          <Briefcase className="h-4 w-4 text-security-business" />
        )}
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          {userMode === "personal" ? "Personal" : "Business"} Mode
        </Label>
      </div>
      <Switch
        id="mode-toggle"
        checked={userMode === "business"}
        onCheckedChange={handleToggle}
        className={userMode === "business" ? "data-[state=checked]:bg-security-business" : "data-[state=checked]:bg-security-personal"}
      />
    </div>
  );
};

export default ModeToggle;

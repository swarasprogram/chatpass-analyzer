
import React from "react";
import { Shield, Lock } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between max-w-4xl">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-security-business" />
          <h1 className="text-xl font-semibold">PassGuard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Password Analyzer</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

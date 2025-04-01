
import { PasswordAnalysis, UserMode, FeedbackItem } from "@/types/chat";

// Function to generate a random password
function generatePassword(userMode: UserMode): string {
  const length = userMode === "business" ? 16 : 12;
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  let allChars = uppercaseChars + lowercaseChars + numberChars;
  if (userMode === "business" || Math.random() > 0.3) {
    allChars += specialChars;
  }
  
  let password = "";
  
  // Ensure at least one character from each required category
  password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  
  if (userMode === "business" || Math.random() > 0.3) {
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  }
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    const randomChar = allChars.charAt(Math.floor(Math.random() * allChars.length));
    // Avoid repeating the same character three times in a row
    if (password.slice(-2) !== randomChar.repeat(2)) {
      password += randomChar;
    } else {
      i--; // Try again
    }
  }
  
  // Shuffle the password characters to make it more random
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

export async function analyzePassword(
  password: string,
  userMode: UserMode
): Promise<PasswordAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const lengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  // Business mode has stricter requirements
  const minLength = userMode === "business" ? 12 : 8;
  const requiresSpecialChars = userMode === "business";
  const lengthForBusiness = password.length >= minLength;
  
  // Common patterns to avoid
  const hasCommonPatterns = /123|abc|qwerty|password|admin/i.test(password);
  const hasSequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  const hasRepeatedChars = /(.)\1\1/.test(password); // Three or more of the same character
  
  // Calculate base score
  let score = 0;
  
  // Length contributes up to 25 points
  score += Math.min(25, Math.floor(password.length * 2.5));
  
  // Character variety contributes up to 60 points
  if (hasUppercase) score += 15;
  if (hasLowercase) score += 15;
  if (hasNumbers) score += 15;
  if (hasSpecialChars) score += 15;
  
  // Penalties for bad practices (up to -40 points)
  if (hasCommonPatterns) score -= 20;
  if (hasSequentialChars) score -= 10;
  if (hasRepeatedChars) score -= 10;
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Business accounts have higher standards
  if (userMode === "business" && score < 70) {
    score = Math.max(0, score - 10); // Additional penalty for business accounts
  }
  
  // Generate feedback items
  const feedback: FeedbackItem[] = [
    {
      message: `${userMode === "business" ? "12+" : "8+"} characters long`,
      valid: userMode === "business" ? lengthForBusiness : lengthValid
    },
    {
      message: "Contains uppercase letters",
      valid: hasUppercase
    },
    {
      message: "Contains lowercase letters",
      valid: hasLowercase
    },
    {
      message: "Contains numbers",
      valid: hasNumbers
    },
    {
      message: `Contains special characters ${userMode === "business" ? "(required)" : ""}`,
      valid: hasSpecialChars,
      type: userMode === "business" && !hasSpecialChars ? "error" : "success"
    }
  ];
  
  // Add warnings about bad patterns if detected
  if (hasCommonPatterns) {
    feedback.push({
      message: "Avoid common words or patterns",
      valid: false,
      type: "warning"
    });
  }
  
  if (hasSequentialChars) {
    feedback.push({
      message: "Avoid sequential characters",
      valid: false,
      type: "warning"
    });
  }
  
  if (hasRepeatedChars) {
    feedback.push({
      message: "Avoid repeated characters",
      valid: false,
      type: "warning"
    });
  }
  
  // Business mode-specific feedback
  if (userMode === "business") {
    feedback.push({
      message: "Meets organizational requirements",
      valid: score >= 70,
      type: score >= 70 ? "success" : "error"
    });
    
    if (!lengthForBusiness || !hasSpecialChars) {
      feedback.push({
        message: "More complex password required for business accounts",
        valid: false,
        type: "error"
      });
    }
  }

  // Generate message based on score and mode
  let message = "";
  
  if (userMode === "business") {
    if (score < 40) {
      message = "This password doesn't meet organizational security standards. Business accounts require stronger passwords with greater complexity. Please try again with a longer password that includes special characters.";
    } else if (score < 70) {
      message = "This password is moderately secure but doesn't fully meet business requirements. Consider adding more variety with special characters and increasing length.";
    } else {
      message = "This password meets business security standards. It has good complexity and length, making it suitable for organizational use.";
    }
  } else {
    if (score < 40) {
      message = "This password is weak and could be easily compromised. Try adding more characters, numbers, and special symbols.";
    } else if (score < 70) {
      message = "This password has moderate strength. Adding more variety or length would make it more secure.";
    } else {
      message = "This is a strong password! It has good length and complexity, making it difficult to crack.";
    }
  }
  
  // Add behavioral considerations
  if (userMode === "business") {
    message += "\n\nRemember that as a business user, your password protects sensitive company data. Never share your password or reuse it across different services.";
  } else {
    message += "\n\nFor personal accounts, consider using a password manager to help create and store unique passwords for all your accounts.";
  }
  
  // Generate a suggested password
  const suggestedPassword = generatePassword(userMode);

  // Add suggestion message
  message += `\n\nHere's a suggested strong password you can use: ${suggestedPassword}`;

  return {
    score,
    message,
    feedback,
    suggestedPassword
  };
}

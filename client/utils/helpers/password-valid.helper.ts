export const isPasswordInValid = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  if (!passwordRegex.test(password)) {
    let errorMessage = "Password must";
    if (password.length < 8) {
      errorMessage += "\n be at least 8 characters long";
    }
    if (!/(?=.*\d)/.test(password)) {
      errorMessage += "\n contain at least one digit";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errorMessage += "\n, contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errorMessage += "\n, contain at least one uppercase letter";
    }
    if (!/(?=.*[\W_])/.test(password)) {
      errorMessage += "\n, contain at least one special character";
    }

    return errorMessage;
  }

  return null;
};

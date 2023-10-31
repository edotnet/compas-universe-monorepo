export const isPasswordInValid = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  if (!passwordRegex.test(password)) {
    let errorMessage = "";

    if (password.length < 8) {
      errorMessage += "\n Minimum length of 8 characters";
    }
    if (!/(?=.*\d)/.test(password)) {
      errorMessage += "\n- At least one digit";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errorMessage += "\n- At least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errorMessage += "\n- At least one uppercase letter";
    }
    if (!/(?=.*[\W_])/.test(password)) {
      errorMessage += "\n- At least one special character";
    }

    return errorMessage;
  }

  return null;
}

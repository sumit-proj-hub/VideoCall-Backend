import { isValidEmail, hashPassword } from "../utils/auth-utils.js";
import { createUser } from "../models/user.model.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (typeof name !== "string" || name.trim().length == 0) {
    errors.push("invalid name");
  }
  if (typeof email !== "string" || !isValidEmail(email)) {
    errors.push("invalid email");
  }
  if (typeof password !== "string" || password.length < 8) {
    errors.push("inavlid password");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors: errors, success: false });
  }

  const password_hash = await hashPassword(password);

  try {
    await createUser({
      name: name,
      email: email,
      password_hash: password_hash
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export default register;

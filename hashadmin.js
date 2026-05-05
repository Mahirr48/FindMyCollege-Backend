import bcrypt from "bcryptjs";

const run = async () => {
  try {
    const password = "Admin@123";   // Admin login password

    const hash = await bcrypt.hash(password, 12);

    console.log("Plain Password :", password);
    console.log("Hashed Password:", hash);

  } catch (error) {
    console.error(error);
  }
};

run();
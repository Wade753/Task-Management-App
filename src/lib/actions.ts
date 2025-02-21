import { schema } from "./schema";
import { db } from "@/server/db";
import { executeAction } from "@/lib/executeAction";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
          name: "Default Name", // Add a default name or get it from formData
          role: "WRITER", // Add a default role or get it from formData
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };

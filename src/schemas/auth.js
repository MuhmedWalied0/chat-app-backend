import z from "zod";

const registerSchema = z.object({
    firstName: z
        .string({ required_error: "First name is required" })
        .min(2, "First name must be at least 2 characters long")
        .max(50, "First name must be at most 50 characters long"),

    lastName: z
        .string({ required_error: "Last name is required" })
        .min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name must be at most 50 characters long"),

    username: z
        .string({ required_error: "Username is required" })
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long")
        .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long"),
});

const loginSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long")
        .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long"),
});

export{
    registerSchema,loginSchema
}
import { z } from "zod";

export const FormSchema = z.object({
    title: z.string().min(1, { message: "Please provide a Todo title." }).max(64, { message: "The title must be less than 64 characters." }),
    description: z.string().max(256, { message: "The description must be less than 256 characters." }).optional(),
    priority: z.enum(["1", "2", "3"]).default("1"),
});

export type Priority = z.infer<typeof FormSchema>["priority"];

import { z } from "zod";

// Base schemas
const DateSchema = z.object({
    date: z.string().nullable(),
    place: z.string().nullable(),
});

const NameSchema = z.object({
    first: z.string(),
    middle: z.string().optional(),
    last: z.string(),
    preferred: z.string().optional(),
});

const PhotoSchema = z.object({
    url: z.string(),
    year: z.number().optional(),
    caption: z.string().optional(),
});

const ContactSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

// Main person schema
const PersonSchema = z.object({
    id: z.string(),
    name: NameSchema,
    birth: DateSchema,
    death: DateSchema,
    gender: z.enum(["male", "female", "other"]).optional(),
    photos: z.array(PhotoSchema).optional(),
    bio: z.string().optional(),
    contacts: ContactSchema.optional(),
});

// Relationship schema
const RelationshipSchema = z.object({
    type: z.enum(["marriage", "parent-child", "adopted"]),
    person1: z.string(),
    person2: z.string(),
    date: z.string().optional(),
    place: z.string().optional(),
    current: z.boolean().optional(),
});

// Media storage schema
const MediaStorageSchema = z.object({
    storage: z.string(),
    baseUrl: z.string(),
});

// Complete family tree schema
export const FamilyTreeSchema = z.object({
    version: z.string(),
    metadata: z.object({
        title: z.string(),
        lastUpdated: z.string(),
        description: z.string().optional(),
    }),
    people: z.array(PersonSchema),
    relationships: z.array(RelationshipSchema),
    media: z.object({
        photos: MediaStorageSchema,
        documents: MediaStorageSchema,
    }),
});

export type FamilyTree = z.infer<typeof FamilyTreeSchema>;
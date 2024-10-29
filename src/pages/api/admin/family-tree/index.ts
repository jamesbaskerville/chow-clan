export const prerender = false;
import type { APIRoute } from 'astro';
import { PutObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { FamilyTreeSchema } from "../../../../schemas/familyTree";
import type { ZodError } from 'zod';
import { getUser } from '../../../../lib/supabase';
import { s3Client } from '../../../../lib/aws';

export const POST: APIRoute = async (context) => {
    const { request } = context;
    // Check authentication
    const user = await getUser(context);
    if (!user) {
        return new Response('Unauthorized', {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Parse and validate the request body
        const body = await request.json();
        const validatedData = await FamilyTreeSchema.parseAsync(body);

        // Check if file exists (optional, since we're using versioning)
        try {
            await s3Client.send(new HeadObjectCommand({
                Bucket: import.meta.env.S3_BUCKET_NAME,
                Key: 'family-tree.json',
            }));
        } catch (error) {
            console.log('File does not exist yet, will be created');
        }

        // Save to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: import.meta.env.S3_BUCKET_NAME,
            Key: 'family-tree.json',
            Body: JSON.stringify(validatedData, null, 2), // Pretty print the JSON
            ContentType: 'application/json',
            CacheControl: 'no-cache', // Prevent caching to ensure latest version is always fetched
            Metadata: {
                'last-modified-by': user?.email || 'unknown',
                'last-modified-date': new Date().toISOString(),
            },
        }));

        return new Response(JSON.stringify({
            success: true,
            message: 'Family tree saved successfully',
            timestamp: new Date().toISOString(),
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error saving family tree:', error);

        // Handle validation errors specifically
        if ((error as any).errors) { // ZodError
            return new Response(JSON.stringify({
                success: false,
                error: 'Validation failed',
                details: (error as ZodError).errors,
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Handle other errors
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to save family tree',
            message: (error as Error).message,
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};


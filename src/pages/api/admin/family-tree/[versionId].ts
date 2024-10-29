export const prerender = false;
import type { APIRoute } from 'astro';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { FamilyTreeSchema } from "../../../../schemas/familyTree";
import type { ZodError } from 'zod';
import { getUser } from '../../../../lib/supabase';
import { s3Client } from '../../../../lib/aws';

export const GET: APIRoute = async (context) => {
    const { params } = context;
    // Check authentication
    const user = await getUser(context);
    if (!user) {
        return new Response('Unauthorized', {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { versionId } = params;

    // Handle missing versionId
    if (!versionId) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Version ID is required'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Fetch specific version from S3
        const command = new GetObjectCommand({
            Bucket: import.meta.env.S3_BUCKET_NAME,
            Key: 'family-tree.json',
            VersionId: versionId
        });

        const response = await s3Client.send(command);
        const data = await response.Body?.transformToString();

        if (!data) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Version not found'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parse and validate the data
        const parsedData = JSON.parse(data);
        const validatedData = await FamilyTreeSchema.parseAsync(parsedData);

        // Get version metadata
        const metadata = response.Metadata || {};
        const lastModified = response.LastModified;

        return new Response(JSON.stringify({
            success: true,
            data: validatedData,
            metadata: {
                versionId,
                lastModified,
                lastModifiedBy: metadata['last-modified-by'] || 'unknown',
                contentType: response.ContentType,
                ...metadata
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Error fetching family tree version:', error);

        // Handle validation errors
        if ((error as any).errors) { // ZodError
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid data structure in this version',
                details: (error as ZodError).errors
            }), {
                status: 422,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Handle S3 errors
        if ((error as Error).name === 'NoSuchKey' || (error as Error).name === 'NoSuchVersion') {
            return new Response(JSON.stringify({
                success: false,
                error: 'Version not found',
                versionId
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Handle other errors
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to fetch version',
            message: (error as Error).message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
"use server";

import { updateJobStatus } from "@/lib/db/dbOps";
import { CLOUDINARY, MANIM_API_URL } from "@/config";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

cloudinary.config({
   cloud_name: CLOUDINARY.name,
   api_key: CLOUDINARY.key,
   api_secret: CLOUDINARY.secret
})

export async function GenerateAndUploadVideoToCloudinary (code: string, jobId: string): Promise<string> {
   
   try {
      updateJobStatus(jobId, "generating_video");
   
   const response = await axios.post(
      `${MANIM_API_URL}/generate-video`,
      { manim_code: code, job_id: jobId },
      { responseType: "stream" }
   )

   updateJobStatus(jobId, "uploading_video")

   return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
         {
            resource_type: 'video',
            public_id: `manim_videos/${jobId}`,
            folder: 'manim_videos',
         },
         async (error, result) => {
            if (error) {
               console.error(`[${jobId}] cloudinary upload error`);
               updateJobStatus(jobId, 'failed');
               return reject(new Error(`upload failed: ${error.message}`));
            }
            console.log(`[${jobId}] cloudinary upload successful`);
            updateJobStatus(jobId, 'completed')
            resolve(result!.secure_url);
         }
      );
      response.data.pipe(uploadStream);
   });
   } catch (error) {
      console.error(`[${jobId}] video generation failed`, error);
      updateJobStatus(jobId, 'failed');

      if(axios.isAxiosError(error)) {
         if (error.response?.status === 400) {
            throw new Error(`Manim code error: ${error.response.data.detail || 'Invalid code'}`)
         } else if (error.response?.status === 500) {
            throw new Error(`Manim execution failed: ${error.response.data.message} || Internal server error`)
         } else if (error.code === 'ECONNABORTED') {
            throw new Error(`video gen timed out`)
      }
      }
      throw new Error(`Failed to generate video : ${error instanceof Error ? error.message : 'Unknown error'}`);
   }
}
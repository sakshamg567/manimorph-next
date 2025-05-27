import { createJob, setJobVideoUrl, updateJobStatus } from "@/lib/db/dbOps";
import { GenerateAndUploadVideoToCloudinary } from "./videoGenUploadservice";
import { v4 } from "uuid";

export function startGeneration(code: string): string {
   const jobId = v4();
   
   (async () => {
      try {
         await createJob(jobId);
         console.log("Job initialized");
         console.log(`Generation flow started for job ${jobId}`);

         await updateJobStatus(jobId, 'generating_video');

         try {
            const videoUrl = await GenerateAndUploadVideoToCloudinary(code, jobId);

            await updateJobStatus(jobId, 'completed');
            await setJobVideoUrl(jobId, videoUrl);
         } catch (error) {
            console.error(`Error in video generation for job ${jobId}:`, error);
            await updateJobStatus(jobId, 'failed');
         }
      } catch (error) {
         console.error(`Error in generation flow for job ${jobId}:`, error);
         await updateJobStatus(jobId, 'failed');
      }
   })();
   
   return jobId;
}
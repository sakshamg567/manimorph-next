import { useCallback, useEffect, useRef, useState } from "react";

interface VideoStatus {
   status: string;
   videoUrl: string | null;
   error: string | null;
   isConnected: boolean;
}

export function useVideoSSE(jobId: string | null): VideoStatus {
   const [status, setStatus] = useState<string>('idle');
   const [videoUrl, setVideoUrl] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [isConnected, setIsConnected] = useState<boolean>(false);
   const eventSourceRef = useRef<EventSource | null>(null);

   // Function to close the connection
   const closeConnection = useCallback(() => {
      if (eventSourceRef.current) {
         console.log(`[${jobId}] Manually closing SSE connection`);
         eventSourceRef.current.close();
         eventSourceRef.current = null;
         setIsConnected(false);
      }
   }, [jobId]);

   useEffect(() => {
      // Better jobId validation and debugging
      console.log('useVideoSSE: Received jobId:', { jobId, type: typeof jobId });
      
      if (!jobId || typeof jobId !== 'string') {
         console.log('useVideoSSE: Invalid jobId, resetting state');
         setStatus('idle');
         setVideoUrl(null);
         setError(null);
         setIsConnected(false);
         closeConnection();
         return;
      }
      
      console.log(`[${jobId}] Starting SSE connection`);
      
      const eventSource = new EventSource(`/api/job/${jobId}`);
      eventSourceRef.current = eventSource;
      
      eventSource.onopen = () => {
         console.log(`[${jobId}] SSE connection opened`);
         setIsConnected(true);
         setError(null);
      };

      eventSource.onmessage = (event) => {
         try {
            const data = JSON.parse(event.data);
            console.log(`[${jobId}] Received data:`, data);
            
            setStatus(data.status); 
            
            if (data.videoUrl) {
               setVideoUrl(data.videoUrl);
            }
            
            if (data.status === 'failed') {
               setError('Video generation failed');
            }

            // Close connection when job is complete or failed
            if (data.status === 'completed' || data.status === 'failed') {
               console.log(`[${jobId}] Job finished with status: ${data.status}, closing connection`);
               closeConnection();
            }
            
         } catch (err) {
            console.error(`[${jobId}] Error parsing SSE data:`, err);
            setError('Error parsing server response');
         }
      };
      
      eventSource.onerror = (event) => {
         console.error(`[${jobId}] SSE error:`, event);
         setIsConnected(false);

         if (eventSource.readyState === EventSource.CLOSED) {
            console.log(`[${jobId}] SSE connection closed`);
         }
      };
      
      return () => {
         console.log(`[${jobId}] Cleaning up SSE connection`);
         closeConnection();
      };
   }, [jobId, closeConnection]);

   // Expose a method to manually close the connection if needed
   useEffect(() => {
      return () => {
         closeConnection();
      };
   }, [closeConnection]);
   
   return { status, videoUrl, error, isConnected };
}
import { mediaApiRequest } from "@/apiRequests/media";

export const useUploadMediaMutation = () => {
  return {
    mutationFn: mediaApiRequest.upload,
  };
};

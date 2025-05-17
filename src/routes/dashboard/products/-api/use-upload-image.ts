import { useMutation } from "@tanstack/react-query";
import { productEndpoints } from "../-types";
import { axiosClient } from "@/lib/axiosInstance";

interface UploadImageParams {
  file: File;
  productId: string;
  folder?: string;
  displayOrder: number;
}

const uploadImageToCloudinary = async ({
  file,
  folder,
  productId,
  displayOrder
}: UploadImageParams) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("productId", productId);
  formData.append("displayOrder", displayOrder.toString());
  if (folder) {
    formData.append("folder", folder);
  }

  const { url, method, headers, response } = productEndpoints.uploadImage();
  const res = await axiosClient.request<typeof response>({
    method,
    url,
    data: formData,
    headers,
  });

  return res.data;
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImageToCloudinary,
    onSuccess: (data) => {
      console.log("Upload successful:", data);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });
};

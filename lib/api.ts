import axios from "axios";

const API_BASE_URL = "https://vb3gzcwtv8.execute-api.ap-south-1.amazonaws.com";

export async function getUploadUrl(fileName: string, contentType: string, owner: string, expiryTimestamp: number) {
  const res = await axios.post(`${API_BASE_URL}/getUploadUrl`, {
    fileName,
    contentType,
    owner,
    expiry_timestamp: expiryTimestamp
  });
  return res.data;
}

export async function getDownloadUrl(fileId: string) {
  const res = await axios.post(`${API_BASE_URL}/getDownloadUrl`, {
    file_id: fileId
  });
  return res.data;
}

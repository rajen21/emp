import axios from "axios";

type trigggerToast = (str: 'success' | 'info' | 'error',message: string) => void

export const handleDownload = async (fileUrl: string, trigggerToast: trigggerToast) => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: 'blob',
      headers: {
        "Access-Control-Allow-Origin": import.meta.env.VITE_ALLOW_ACCESS,
        "Access-Control-Allow-Credentials": true
      },
    });
    
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.target = "_blank";
    link.download = new Date().getTime().toString() + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    const error = err as Error;
    console.error('Download error:', error);
    trigggerToast("error",error.message)
  }
};
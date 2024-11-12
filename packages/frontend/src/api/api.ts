import axios from "./axiosSetup";
import type { Level } from "@jobs4palestine/shared";
interface SearchJobsParams {
  specialty: string;
  level?: Level;
}
interface ViewJobsParams extends SearchJobsParams {
  page?: number;
}
export const viewJobs = async ({ specialty, level, page }: ViewJobsParams) => {
  const searchParams = new URLSearchParams({
    q: specialty,
    level: level || "",
    page: typeof page === "number" ? String(page) : "",
  });
  try {
    const response = await axios.get(`/view?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    return [];
  }
};

export const archiveJob = async (
  objectId: string,
  unarchive: boolean = false
) => {
  const url = `/archive?objectId=${objectId}${
    unarchive ? "&unarchive=true" : ""
  }`;
  return axios.post(url);
};

export const searchJobs = async ({ specialty, level }: SearchJobsParams) => {
  try {
    const searchParams = new URLSearchParams({
      q: specialty,
      level: level || "",
    });
    const response = await axios.get(`/search?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    return [];
  }
};

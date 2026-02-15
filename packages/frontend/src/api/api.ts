import axios from "./axiosSetup";
import type { Level } from "@jobs4palestine/shared";
interface SearchJobsParams {
  specialty?: string;
  level: Level | null;
  customSearch?: string;
}
interface ViewJobsParams {
  specialty?: string;
  level: Level | null;
  page?: number;
  customSearch?: string;
}
export const viewJobs = async ({ specialty, level, page, customSearch }: ViewJobsParams) => {
  const searchParams = new URLSearchParams({
    q: specialty || customSearch || "",
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

export const searchJobs = async ({ specialty, level, customSearch }: SearchJobsParams) => {
  try {
    const params: Record<string, string> = {
      level: level || "",
    };

    if (customSearch) {
      params.customSearch = customSearch;
    } else if (specialty) {
      params.q = specialty;
    }

    const searchParams = new URLSearchParams(params);
    const response = await axios.get(`/search?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    return [];
  }
};

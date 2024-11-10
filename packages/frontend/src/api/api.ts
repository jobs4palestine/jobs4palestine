import axios from "./axiosSetup";
import type { Level } from "@jobs4palestine/shared";

export const viewJobs = async ({ specialty, level }: SearchJobsParams) => {
  const searchParams = new URLSearchParams({
    q: specialty,
    level: level || "",
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
type SearchJobsParams = {
  specialty: string;
  level?: Level;
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

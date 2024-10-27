import axios from './axiosSetup';

export const viewSpecialityJobs = async (specialty: string) => {
    try {
        const response = await axios.get(`/view?q=${specialty}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching table data:', error);
        return [];
    }
};

export const archiveSpecialityJob = async (objectId: string, unarchive: boolean = false) => {
    const url = `/archive?objectId=${objectId}${unarchive ? '&unarchive=true' : ''}`;
    return axios.post(url);
};

export const searchSpecialityJobs = async (specialty: string) => {
    try {
        const response = await axios.get(`/search?q=${specialty}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching table data:', error);
        return [];
    }
};

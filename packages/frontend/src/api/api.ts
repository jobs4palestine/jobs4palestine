import axios from './axiosSetup';

export const queryTableData = async (specialty: string) => {
    try {
        const response = await axios.get(`/view?q=${specialty}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching table data:', error);
        return [];
    }
};

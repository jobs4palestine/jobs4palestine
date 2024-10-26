import axios from 'axios';

export const getHelloMessage = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/hello`);
    return response.data;
};


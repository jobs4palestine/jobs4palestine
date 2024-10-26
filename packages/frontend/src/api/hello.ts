import axios from './axiosSetup';

export const getHelloMessage = async () => {
    const response = await axios.get(`/hello`);
    return response.data;
};


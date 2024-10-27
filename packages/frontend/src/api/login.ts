import axios from './axiosSetup';
export interface LoginResponse {
    token: string;
    userType: 'user' | 'admin';
}
export const postLogin = async (password: string) => {
    const base64Credentials = btoa(`${password}`);

    try {
        const response = await axios.post(`/login`, {}, {
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            }
        });
        if (response.status === 200) {
            const { token, userType } = response.data;  // Extract both token and userType
            localStorage.setItem('token', token);
            localStorage.setItem('userType', userType);  // Store userType in localStorage
            return Promise.resolve({ token, userType });
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
    return Promise.reject('login failed');
}


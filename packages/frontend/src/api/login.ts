import axios from './axiosSetup';

export const postLogin =  async (password: string) => {
    const base64Credentials = btoa(`${password}`);

    try {
        const response = await axios.post(`/login`, {}, {
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            }
        });
        if (response.status === 200) {
            console.log('Login successful:', response.data);
            const {token} = response.data;
            localStorage.setItem('token', token);
            return Promise.resolve(token)
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
    return Promise.reject('login failed:');
}

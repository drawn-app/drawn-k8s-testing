import { sleep, check } from 'k6';
import http from 'k6/http';

export function testLogin(params) {
    let data = params || { username: 'drawn@gmail.com', password: '0123456789' };
    let res = http.post('http://localhost/api/auth/login', data);
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
}

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        {duration: '10s', target: 100},
        {duration: '30s', target: 500},
        {duration: '10s', target: 0}, // for load test
        {duration: '10s', target: 100},
        {duration: '20s', target: 1000},
        {duration: '10s', target: 0}, // for spike test
        {duration: '20s', target: 400 },
        {duration: '30s', target: 400 },
        {duration: '10s', target: 0 }, //for stress test
        {duration: '10s', target: 100 },
        {duration: '5m', target: 100 },
        {duration: '10s', target: 0 }, //for soak test
    ],
};

export default () => {    
    http.get('http://localhost');
    let data = { email: 'drawn@gmail.com', password: '0123456789' };
    let res = http.post('http://localhost/api/auth/login', data);
    let responseBody = JSON.parse(res.body);
    let userId = responseBody.id;
    let authCookie = null;
    const setCookieHeader = res.headers['Set-Cookie'];
    if (setCookieHeader) {
        const cookies = setCookieHeader.split('; ');
        for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'auth') {
            authCookie = value;
            break;
        }
        }
    }
    let headers = {
        headers: {
            Cookie: `auth=${authCookie}`, // Set the auth cookie in the header
        },
    };
    sleep(1);
    
    http.get(`http://localhost/api/users/${userId}`);
    http.get('http://localhost/api/workspaces', headers);
    http.get('http://localhost/api/chat/1/messages', headers);  
    };
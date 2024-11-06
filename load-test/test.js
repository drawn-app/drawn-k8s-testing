import { sleep, check } from 'k6';
import http from 'k6/http';

export function testLogin(params) {
    let data = params || { username: 'drawn@gmail.com', password: '0123456789' };
    let res = http.post('http://localhost/api/auth/login', data);
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
}

// export let options = {
//     insecureSkipTLSVerify: true,
//     noConnectionReuse: false,
//     vus: 10, //num of concurrent users
//     duration: '30s', //test duration
// };

export default () => {    
    http.get('http://localhost');
    sleep(1); //every user away request api every 1 second
    http.get('http://localhost/login');
    let data = { email: 'drawn@gmail.com', password: '0123456789' };
    let res = http.post('http://localhost/api/auth/login', data);
    // console.log(res);
    check(res, {
        'is login status 200': (r) => r.status === 200,
    });
    sleep(1);

    // Extract auth cookie from Set-Cookie header
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

    // Check if auth cookie is found
    if (!authCookie) {
        console.error("Failed to extract auth cookie from login response");
        return; // Exit if no cookie found
    }

    // Construct the GET request with the auth cookie
    let options = {
        headers: {
            Cookie: `auth=${authCookie}`, // Set the auth cookie in the header
        },
    };

    // GET request to retrieve workspaces
    let workspacesRes = http.get('http://localhost/workspaces', options);

    // Check response status for workspaces request
    check(workspacesRes, {
        'is workspaces status 200': (r) => r.status === 200,
    });

    // Process or log the workspaces response (workspacesRes)
    console.log(workspacesRes); // Example: Log the JSON response body
    };
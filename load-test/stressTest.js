/*
    Stress test for the application
    Run: k6 stressTest.js
    Run: k6 stressTest.js --noConnectionReuse   // to disable connection reuse
    Run: k6 stressTest.js --insecureSkipTLSVerify // to skip TLS verification
    Run: k6 stressTest.js --noConnectionReuse --insecureSkipTLSVerify
*/

import { sleep } from 'k6';
import http from 'k6/http';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '10s', target: 100 }, //below load test is for 100 users
        { duration: '20s', target: 100 }, 
        { duration: '30s', target: 100 },
        { duration: '10s', target: 200 }, //normal load test is for 200 users
        { duration: '20s', target: 200 },
        { duration: '30s', target: 200 },
        { duration: '10s', target: 400 }, //arrow load test is for 400 users
        { duration: '20s', target: 400 },
        { duration: '30s', target: 400 },
        { duration: '10s', target: 800 }, //beyond load test is for 800 users
        { duration: '20s', target: 800 },
        { duration: '30s', target: 800 },
        { duration: '20s', target: 0 }, //scale down. recovery stage
    ],
};

export default () => {    
    http.batch([
        ['GET', 'http://localhost'],
    ]);
    sleep(1);
}
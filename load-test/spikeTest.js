/*
    Spike test for the spike.js module
*/

import { sleep } from 'k6';
import http from 'k6/http';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '10s', target: 100 }, //below load test is for 100 users
        { duration: '30s', target: 100 },
        { duration: '10s', target: 1000 }, //spike load test is for 1000 users
        { duration: '30s', target: 1000 },
        { duration: '10s', target: 100 }, //scale down. recovery stage
        { duration: '30s', target: 100 },
        { duration: '10s', target: 0 },
    ],
};

export default () => {    
    http.batch([
        ['GET', 'http://localhost'],
    ]);
    sleep(1);
}
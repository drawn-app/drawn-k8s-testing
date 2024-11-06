/*
    loadTest.js
    load test for k6
*/

import http from 'k6/http'; 
import { sleep } from 'k6';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        {duration: '10s', target: 100}, //simmulate ramp up of traffic from 0 to 100 users in 10 seconds
        {duration: '20s', target: 100}, //stay at 100 users for 20 seconds
        {duration: '10s', target: 0}, //ramp down to 0 users             
    ],
    tresholds: {
        http_req_duration: ['p(95)<1000'], //95% of requests must complete below 500ms
    }
};

export default () => {
    let response = http.get('http://localhost');
    sleep(1);
}   //every user away request api every 1 second
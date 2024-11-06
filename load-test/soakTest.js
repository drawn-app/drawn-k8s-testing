/*
    Soke test is use to validate reliability of system over a long time
*/
import { sleep } from 'k6';
import http from 'k6/http';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '10s', target: 200 }, //ramp up to 200 users
        { duration: '1h5m', target: 200 }, //stay at 200 users for 1 hour 5 minutes
        { duration: '10s', target: 0 }, //scsale down to 0 users
    ],
};

export default () => {    
    http.batch([
        ['GET', 'http://localhost'],
    ]);
    sleep(1);
}
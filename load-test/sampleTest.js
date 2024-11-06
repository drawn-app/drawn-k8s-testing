import { sleep } from 'k6';
import http from 'k6/http';

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    vus: 10, //num of concurrent users
    duration: '30s', //test duration
};

export default () => {    
    http.get('http://localhost');
    sleep(1); //every user away request api every 1 second
}
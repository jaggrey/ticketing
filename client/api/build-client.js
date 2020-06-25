import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    // Requests should be made from the pod to ingress service which is of the format
    // http://SERVICENAME.NAMESPACE.svc.cluster.local/YOURROUTE
    return axios.create({
      baseURL: 'http://codewithgrey.com',
      // 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // We are on the browser
    // Requestes can be made with a base url of ''
    return axios.create({
      baseURL: '/'
    });
  }
};

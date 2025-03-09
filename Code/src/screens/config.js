// Server configuration
const SERVER_CONFIG = {
  SOCKET_URL: 'http://10.54.21.205:5000',
  API_URL: 'http://10.54.21.205:5001'
};

   //For development vs production environments, you could also do:
 // const SERVER_CONFIG = {
 //   SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://10.54.21.205:5000',
 //   API_URL: process.env.REACT_APP_API_URL || 'http://10.54.21.205:5001'
 // };
  
  export default SERVER_CONFIG;

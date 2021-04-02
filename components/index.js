//Primary index.js file
require('dotenv').config()
const API_URL = process.env.API_URL 

$(document).ready(() =>{

    document.getElementById("spinner").style.display="none";

})
export {API_URL}

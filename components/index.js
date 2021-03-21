//Primary index.js file
require('dotenv').config()
const API_URL = process.env.API_URL 

$(document).ready(() =>{

    $('#two_maps_show').attr('hidden',true)
    document.getElementById("spinner").style.display="none";

})
export {API_URL}

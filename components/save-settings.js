const axios = require('axios')
var FileSaver = require('file-saver');
const {cleanConnectionTables} = require('./drawmap')
const {drawmap} = require('./drawmap')
const {drawmap2} = require('./drawmap')
const {API_URL} = require('./index')

document.getElementById('save-settings-button').addEventListener('click', saveSettings);
document.getElementById('button_exists').addEventListener('click', uplaodSavedSettings);

function saveSettings(){
    
    maps={}
    if(localStorage.getItem("map1")){
    maps['map1']=JSON.stringify(localStorage.getItem("map1"))
    }

    if(localStorage.getItem("map2")){
        maps['map2']=JSON.stringify(localStorage.getItem("map2"))
    }

    maps = {}
    axios.post(API_URL+'actions/save',maps, {
        headers: {
            'content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "uuid":localStorage.getItem('uuid')
        }
      }).then((response) => {
        var blob = new Blob([response.data.uuid +"\r\n"+response.data.file_name], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, response.data.file_name+".txt");
    }, (error) => {

    });
}

function uplaodSavedSettings(){
    let formData = new FormData();
    savedSettingsInput = document.getElementById('saved-settings')
    formData.append("file",savedSettingsInput.files[0])
    axios.post(API_URL+'actions/upload-saved', formData , {
        headers: {
            'content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
        }
      }).then((response) => {
        localStorage.setItem('uuid',response.data.uuid)
        if(response.data.second){
            cleanConnectionTables();
            localStorage.setItem("map1",response.data.first)
            drawmap(response.data.first,"inchlib1");
            localStorage.setItem("map2",response.data.second)
            drawmap2(response.data.second,"inchlib2");
            $('#one_maps_show').hide()
            $('#two_maps_show').show()
            $('#buttons').show()
            var first_second_connections= response.data.first_second_connections;
            localStorage.setItem('first_second_connections',JSON.stringify(first_second_connections))

            var second_first_connections= response.data.second_first_connections;
            localStorage.setItem('second_first_connections',JSON.stringify(second_first_connections))
        }
        else{
            cleanConnectionTables();
            localStorage.setItem("map1",response.data.first)
            if(localStorage.getItem("map2")){
              localStorage.removeItem("map2")
            }
            drawmap(response.data.first,"inchlib")
            $('#one_maps_show').show()
            $('#two_maps_show').hide()
            $('#buttons').show()
        }
        
    }, (error) => {

    });

}
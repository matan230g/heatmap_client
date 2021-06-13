
/* Draw HeatMap  */
var InCHlib = require("../lib/inchlib-1.2.0");
const {initTable} = require('./insertable')
const axios = require('axios')
const {API_URL} = require('./index')

document.getElementById('clear-tb1').addEventListener('click', cleanTableOne )
document.getElementById('clear-tb2').addEventListener('click', cleanTableTwo )

//restart the heatmap1 
$('#restart1').off('click').on('click',function() {
    resetMap("map1","inchlib1")
  });

//restart the heatmap2
$('#restart2').off('click').on('click',function() {
    resetMap("map2","inchlib2")
  });
  





//drawmap using InCHlib library
export function drawmap(json,target){
var inchlib = new InCHlib({"target": target,
                    "width": 800,
                    "column_metadata_colors": "RdLrBu",
                    "heatmap_colors": "RdBkGr",
                    "max_percentile": 90,
                    "middle_percentile": 60,
                    "min_percentile": 10,
                    "heatmap_font_color": "white",
                     text: 'biojs'});
                  
inchlib.send_json(JSON.parse(json));
//Show hidden
const formNotExists = document.getElementById("form-new");
const formExists = document.getElementById("form-exist");

const res = document.getElementById("checkbox-maps-choose").checked;
const res2 = document.getElementById("checkbox-loading-files-choose").checked;
inchlib.draw();
};


export function drawmap2(json,target){
    var inchlib2 = new InCHlib({"target": target,
                        "width": 800,
                        "height": 1200,
                        "column_metadata_colors": "RdLrBu",
                        "heatmap_colors": "RdBkGr",
                        "max_percentile": 90,
                        "middle_percentile": 60,
                        "min_percentile": 10,
                        "heatmap_font_color": "white",
                         text: 'biojs'});                


    inchlib2.send_json(JSON.parse(json));
    inchlib2.draw();
    }

    export function drawmapAfterManipulate(json,target){
        var inchlib = new InCHlib({"target": target,
                            "width": 800,
                            "height": 1200,
                            "column_metadata_colors": "RdLrBu",
                            "heatmap_colors": "RdBkGr",
                            "max_percentile": 90,
                            "middle_percentile": 60,
                            "min_percentile": 10,
                            "heatmap_font_color": "white",
                             text: 'biojs'});
                          
        inchlib.send_json(JSON.parse(json));
        inchlib.draw();
        };
        



    
export function cleanConnectionTables(){
    var table_1to2 = document.getElementById("table-connect-1to2");
    initTable(table_1to2)
    var table_2to1 = document.getElementById("table-connect-2to1");
    initTable(table_2to1);
}

 function cleanTableOne(){
    var table_1to2 = document.getElementById("table-connect-1to2");
    initTable(table_1to2)
}

function cleanTableTwo(){
    var table_2to1 = document.getElementById("table-connect-2to1");
    initTable(table_2to1)
}

function resetMap(map,target){
    $("#spinner-"+map).show()
    axios.get(API_URL+'actions/reset_default',{
      params:{'side' :map} ,
      headers: {
        'content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*",
        "uuid":localStorage.getItem('uuid')
      }
      }).then((response) => {
        drawmap(JSON.stringify(response.data.heatmap),target)
        $("#spinner-"+map).hide()
    })
    .catch(error => {
      $("#spinner-"+map).hide();
      let error_message = error.response.data.message;
      var para = document.createElement("p");            
          para.innerText = error_message;
          para.style.color="red"
    })


}
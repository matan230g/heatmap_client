
var InCHlib = require("../lib/inchlib-1.2.0");
//var json1 = require("../resources/microarrays.json")
//var json2 = require("../resources/target.json")
// var tet = require("../resources/microarrays.json")
const {initTable} = require('./insertable')
const axios = require('axios')
const {API_URL} = require('./index')

document.getElementById('clear-tb1').addEventListener('click', cleanTableOne )
document.getElementById('clear-tb2').addEventListener('click', cleanTableTwo )

document.getElementById('restart1').addEventListener('click', () => {
    resetMap("map1","inchlib1")
},false )

// document.getElementById('restart2').addEventListener('click', () => resetMap("map2","inchlib2") )





export function drawmap(json,target){
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
    console.log("blbalab")
    $("#spinner-"+map).show()
    axios.get(API_URL+'actions/reset_default',{
      params:{'side' :map} ,
      headers: {
        'content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*"
      }
      }).then((response) => {
        console.log(response.data.heatmap);
        drawmap(response.data.heatmap,target)
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
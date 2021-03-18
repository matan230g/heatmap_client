
var InCHlib = require("../lib/inchlib-1.2.0");
//var json1 = require("../resources/microarrays.json")
//var json2 = require("../resources/target.json")
// var tet = require("../resources/microarrays.json")
const {initTable} = require('./insertable')

document.getElementById('clear-tb1').addEventListener('click', cleanTableOne )
document.getElementById('clear-tb2').addEventListener('click', cleanTableTwo )

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
if((!res && formNotExists.style.display!="none") || (res2 && formExists.style.display!="none")){
    showMaps()
    let map= document.getElementById("inchlib");
    map.style.display="none";

    let download_map = document.getElementById("downoad_map");
    download_map.style.display="none";

}
else{
    hideMaps()
    let map= document.getElementById("inchlib");
    map.style.display="block";

    let download_map = document.getElementById("downoad_map");
    download_map.style.display="block";

}

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

    function showMaps(){

        let map1= document.getElementById("inchlib1");
        map1.style.display="block";
    
        let map2 = document.getElementById("inchlib2");
        map2.style.display="block";

        let table = document.getElementById("table-box-connect-1to2");
        table.style.display="block";
    
        let ml1 = document.getElementById("ml1");
        ml1.style.display="block";
    
        let h1 = document.getElementById("headline1");
        h1.style.display="block";

        let table21 = document.getElementById("table-box-connect-2to1");
        table21.style.display="block";
    
        let h2 = document.getElementById("headline2");
        h2.style.display="block";
    
        let ml2 = document.getElementById("ml2");
        ml2.style.display="block";

        let download_map1 = document.getElementById("downoad_map1");
        download_map1.style.display="block";

        let download_map2 = document.getElementById("downoad_map2");
        download_map2.style.display="block";
    
    }

    function hideMaps(){
        let map= document.getElementById("inchlib");
        map.style.display="none";

        let map1= document.getElementById("inchlib1");
        map1.style.display="none";
    
        let map2 = document.getElementById("inchlib2");
        map2.style.display="none";

        let table = document.getElementById("table-box-connect-1to2");
        table.style.display="none";
    
        let ml1 = document.getElementById("ml1");
        ml1.style.display="none";
    
        let h1 = document.getElementById("headline1");
        h1.style.display="none";

        let table21 = document.getElementById("table-box-connect-2to1");
        table21.style.display="none";
    
        let h2 = document.getElementById("headline2");
        h2.style.display="none";
    
        let ml2 = document.getElementById("ml2");
        ml2.style.display="none";

        let download_map1 = document.getElementById("downoad_map1");
        download_map1.style.display="none";

        let download_map2 = document.getElementById("downoad_map2");
        download_map2.style.display="none";

    
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

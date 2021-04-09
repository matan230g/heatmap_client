//Choose how much maps display
document.getElementById('checkbox-maps-choose').addEventListener('click', showHideMapsNum);
document.getElementById('checkbox-meta-data1').addEventListener('click', showHideMetaData1);
document.getElementById('checkbox-meta-data2').addEventListener('click', showHideMetaData2);
document.getElementById('checkbox-loading-files-choose').addEventListener('click', showHideForms);
//document.getElementById('map2-loading').addEventListener('click', showHideMap2Exist);
document.getElementById('miRNA-clust-select').addEventListener('change', changeSelectClusterMir)
document.getElementById('target-clust-select').addEventListener('change', changeSelectClusterTarget)

function showHideMetaData1(){
    const res = document.getElementById("checkbox-meta-data1").checked;
    var settings = document.getElementById("checkbox-mirNA-metadata-option");
    if(res){
        settings.style.display="block"; 
    }
    else{
        settings.style.display="none";  
    }
}


function showHideMetaData2(){
    const res = document.getElementById("checkbox-meta-data2").checked;
    var settings = document.getElementById("checkbox-target-metadata-option");
    if(res){
        settings.style.display="block"; 
    }
    else{
        settings.style.display="none";  
    }
}

function showHideMapsNum(){
    const res = document.getElementById("checkbox-maps-choose").checked;
    var target_metadata =  document.getElementById("checkbox-target-metadata-op");
    var checkbox_target_md = document.getElementById("checkbox-target-metadata-option")
    var connections = document.getElementById("connections")
    var settingssecondheatmap = document.getElementById("secondheatmapssettings");
    document.getElementById("checkbox-meta-data2").checked = false;

    if(res){
        settingssecondheatmap.style.display="none"
        target_metadata.style.display="none"; 
        checkbox_target_md.style.display="none";
        connections.style.display="none";
    }
    else{
        settingssecondheatmap.style.display="block"
        target_metadata.style.display="block";
        connections.style.display="block";
        hr.style.display="block";

    }
}

export function validate(res){
    var input1 = document.getElementById("mirNA")
    var input2 = document.getElementById("target")
    var input3 = document.getElementById("connection")
    var input4 = document.getElementById("mirNA-metadata")
    var input5 = document.getElementById("target-metadata")
    
    const res_meta_data1 = document.getElementById("checkbox-meta-data1").checked;
    const res_meta_data2 = document.getElementById("checkbox-meta-data2").checked;

    if(!input1.value){
        input1.classList.add("input-error");
        return false;
    }
    else{
        input1.classList.remove("input-error");
    }
    if(!res){
        if(!input2.value){
            input2.classList.add("input-error");
            return false;
        }
        else{
            input2.classList.remove("input-error");
        }

        if(!input3.value){
            input3.classList.add("input-error");
            return false;
        }
        else{
            input3.classList.remove("input-error");
        }
    }
    if(res_meta_data1){
        if(!input4.value){
            input4.classList.add("input-error");
            return false;
        }
        else{
            input4.classList.remove("input-error");
        }
    }
    if(res_meta_data2){
        if(!input5.value){
            input5.classList.add("input-error");
            return false;
        }
        else{
            input5.classList.remove("input-error");
        }
    }
    return true;

}

export function existingValidation(){

    let map1 = document.getElementById("map1")
    let map2 = document.getElementById("map2")
    
    const res = document.getElementById("map2-loading").checked;

    if(!map1.value){
       map1.classList.add("input-error");
        return false;
    }
    else{
        map1.classList.remove("input-error");
    }
    if(res){
        if(!map2.value){
            map2.classList.add("input-error");
            return false;
        }
        else{
            map2.classList.remove("input-error");
        }
    }
    return true;
}
function changeSelectClusterMir(event){

    if(event.target.value === 'Both'){
        document.getElementById('mir-linkage-column').style.display='block'
        document.getElementById('mir-distance-column').style.display='block'
    }
    else{
        document.getElementById('mir-linkage-column').style.display='none'
        document.getElementById('mir-distance-column').style.display='none'
    }   


}

function changeSelectClusterTarget(event){

    if(event.target.value === 'Both'){
        document.getElementById('tgt-linkage-column').style.display='block'
        document.getElementById('tgt-distance-column').style.display='block'
    }
    else{
        document.getElementById('tgt-linkage-column').style.display='none'
        document.getElementById('tgt-distance-column').style.display='none'
    }


}

function showHideForms(){
    let checkbox = document.getElementById("checkbox-loading-files-choose").checked;
    if(checkbox == true){
        document.getElementById('form-exist').style.display="block";
        document.getElementById('form-new').style.display="none";
    }
    else{
        document.getElementById('form-exist').style.display="none";
        document.getElementById('form-new').style.display="block";
    }
}


$('#downoad_map').unbind('click').bind('click',(function(e){
   e.preventDefault();
   downloadObjectAsJson("map")
}))


function downloadObjectAsJson(wichmap){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem(wichmap));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", wichmap + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
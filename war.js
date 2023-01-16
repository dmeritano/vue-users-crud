/*  ********************************************************************************* 
*************************************************************************************
  
Script to generate a WAR from the ./dist folder, to which the WEB-INF and 
    META-INF folders are previously added.

The script can be executed with node " node war.js ", although it has also 
been added in package.json , to the build process:

   "build": "vue-cli-service build && node war.js",
*************************************************************************************   
************************************************************************************* */   

const zipper = require("zip-a-folder")
const packageJSON = require("./package.json");
var fs = require("fs-extra");


//Copy Extra Files
const DIST_FOLDER = "./dist"
const TARGE_WAR_FOLDER = "./target/"
const METAINF_TARGET_DIR = DIST_FOLDER + "/META-INF"
const WEBINF_TARGET_DIR = DIST_FOLDER + "/WEB-INF"
const METAINF_SOURCE_DIR = "war-files/META-INF"
const WEBINF_SOURCE_DIR = "war-files/WEB-INF"
const APP_NAME = packageJSON.name
const APP_VERSION = packageJSON.version
const OUTPUT_WAR = TARGE_WAR_FOLDER + APP_NAME + "-" + APP_VERSION + ".war"


console.log("\n----------------------------------------------------");
console.log("-------------- GENERATING WAR FILE -----------------");
console.log("----------------------------------------------------");


if (!fs.pathExistsSync(DIST_FOLDER)){
  abort("No existe la carpeta " + DIST_FOLDER + " Realizo el build?")
}
if (!fs.pathExistsSync(METAINF_SOURCE_DIR)){
  abort("No existe la carpeta " + METAINF_SOURCE_DIR)
}
if (!fs.pathExistsSync(WEBINF_SOURCE_DIR)){
  abort("No existe la carpeta " + WEBINF_SOURCE_DIR)
}


//Step 1
//We make sure that the META-INF and WEB-INF folders do not exist in distribution folder
fs.removeSync(METAINF_TARGET_DIR)
fs.removeSync(WEBINF_TARGET_DIR)
console.log("Step 1 finished");

//Step 2
//We create the folders META-INF and WEB-INF in distribution folder
fs.ensureDirSync(METAINF_TARGET_DIR)
fs.ensureDirSync(WEBINF_TARGET_DIR)
console.log("Step 2 finished");

//Step 3
//Copy source folders META-INF and WEB-INF to distribution folder
fs.copySync(METAINF_SOURCE_DIR, METAINF_TARGET_DIR)
fs.copySync(WEBINF_SOURCE_DIR, WEBINF_TARGET_DIR)
console.log("Step 3 finished");

//Step 4
//We create final war file
zipper.zip(DIST_FOLDER, OUTPUT_WAR)
.then( () => {
  console.log("Step 4 finished");  
  console.log("Created war file: " + OUTPUT_WAR);
  console.log("-------------- Script war.js finished ----------------\n");
})
.catch(error => console.log(error))

function abort(msg){
  throw new Error(msg + "\n"); 
}
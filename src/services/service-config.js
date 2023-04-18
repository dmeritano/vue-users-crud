const getRuntimeConfig = async () => {
    //Fails when we have routes with more than one level (../users/profile)
    //Config always are in root ( / )
    //const runtimeConfig = await fetch('./config.json') 
    const runtimeConfig = await fetch('config.json') 
    
    return await runtimeConfig.json()
}

export default async function loadAppConfig(){
    return getRuntimeConfig()
}
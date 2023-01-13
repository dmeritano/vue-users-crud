const getRuntimeConfig = async () => {
    const runtimeConfig = await fetch('./config.json')
    return await runtimeConfig.json()
}

export default async function loadAppConfig(){
    return getRuntimeConfig()
}
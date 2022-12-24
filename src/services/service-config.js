const getRuntimeConfig = async () => {
    const runtimeConfig = await fetch('./config.json')
    return await runtimeConfig.json()
}

export default async function makeEnvConfig(){
    return getRuntimeConfig()
}
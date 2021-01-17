import * as axios from 'axios';
const apiKey = 'b9af9760949da193d392'

const instance = axios.create({
    baseURL: 'https://free.currconv.com/api/v7/',
})

export const convert = (have,take)=>{
    return instance.get(`convert/?q=${have}_${take},${take}_${have}&compact=ultra&apiKey=${apiKey}`)
}
export const currencies = ()=>{
    return instance.get(`currencies/?apiKey=${apiKey}`)
}
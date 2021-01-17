import React, {useState, useEffect} from 'react';
import {convert} from "../api/axios";
import {useCookies} from "react-cookie";
import {SwapOutlined } from '@ant-design/icons';
import {NavLink} from "react-router-dom";

function Convertor(props) {
    const [cookies, setCookie] = useCookies(['favorites'])
    let initOption = ['RUB - Russian Ruble', 'EUR - Euro']
    if (cookies.favorites) {
        let cookie =cookies.favorites.map(el=>{
            let toReplaceRegex = new RegExp('</span>', "gi")
            return  el.replace(/<span class="val">/g,'').replace(toReplaceRegex,'')
        })
        initOption = Array.from(new Set([...initOption, ...cookie]))

    }
    const [selected, setSelected] = useState(['RUB', 'EUR'])
    const [option, setOption] = useState(initOption)
    useEffect(() => {
        setOption(() => {
            if (cookies.favorites){
                let cookie =cookies.favorites.map(el=>{
                    let toReplaceRegex = new RegExp('</span>', "gi")
                    return  el.replace(/<span class="val">/g,'').replace(toReplaceRegex,'')
                })
                return Array.from(new Set([...initOption, ...cookie]))
            }else {
                return Array.from(new Set([...initOption]))
            }
        })
    }, [cookies.favorites])
    const [convertData, setConvertData] = useState([0, 0])
    useEffect(() => {
        convert(selected[0], selected[1]).then(r => {
            let data = []
            for (let value of Object.values(r.data)) {
                data.push(value)
            }
            setConvertData(() => data)
        })
    }, [])


    const selectedHave = (e) => {
        setSelected(() => [e.target.value, selected[1]])
        convert(e.target.value, selected[1]).then(r => {
            let data = []
            for (let value of Object.values(r.data)) {
                data.push(value)
            }
            setConvertData(() => data)
        })
    }
    const selectedTake = (e) => {
        setSelected(() => [selected[0], e.target.value])
        convert(selected[0], e.target.value).then(r => {
            let data = []
            for (let value of Object.values(r.data)) {
                data.push(value)
            }
            setConvertData(() => data)
        })
    }
    const swap = () => {
        setSelected(() => [selected[1], selected[0]])
        convert(selected[1], selected[0]).then(r => {
            let data = []
            for (let value of Object.values(r.data)) {
                data.push(value)
            }
            setConvertData(() => data)
        })
    }

    const [haveInput, setHaveInput] = useState(1)
    const changeHaveInput = (e) => {
        let value = parseFloat(e.target.value)
        if (isNaN(value)) {
            value = 0
        }
        setHaveInput(() => {
            return value
        })
        setTakeInput(() => {
            return (value * convertData[0]).toFixed(4)
        })
    }

    const [takeInput, setTakeInput] = useState('')
    const changeTakeInput = (e) => {
        let value = parseFloat(e.target.value)
        if (isNaN(value)) {
            value = 0
        }
        setTakeInput(() => {
            return value
        })
        setHaveInput(() => {
            return (value * convertData[1]).toFixed(4)
        })
    }
    useEffect(() => {
        setTakeInput(() => (convertData[0] * haveInput).toFixed(4))
    }, [convertData])
    return (
        <>
            <h1>Конвертор валют</h1>
            <div className={'convertorWrap'}>
                <div className={'inputWrap'}>
                    <h4>У меня есть:</h4>
                    <div>
                        <div className={'inputContent'}>
                            <input type="text" value={haveInput} onChange={changeHaveInput}/>
                            <select onChange={selectedHave} value={selected[0]}>
                                {option.map((el,index) => {
                                    let val = el.split(' ', 1)
                                    return <option key={index} value={val}>{el}</option>
                                })}
                            </select>
                        </div>
                    </div>

                </div>
                <div onClick={swap} className={"swapBtn"}>
                    <SwapOutlined style={{fontSize:"24px"}}/>
                </div>

                <div className={'inputWrap'}>
                    <h4>Я получу:</h4>
                    <div className={'inputContent'}>
                        <input type="text" value={takeInput} onChange={changeTakeInput}/>
                        <select onChange={selectedTake} value={selected[1]}>
                            {option.map((el,index) => {
                                let val = el.split(' ', 1)
                                return <option key={index} value={val}>{el}</option>
                            })}
                        </select>
                    </div>
                </div>

            </div>
            <p>*Добавить больше валют для <span style={{fontWeight:"bold"}}>конвертация</span> вы можете настранице <NavLink className={'link'} to={'/ExchangeRates'}>Валюты</NavLink></p>
        </>

    );
}

export default Convertor;
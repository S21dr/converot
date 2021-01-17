import React, {useState, useEffect} from 'react';
import {currencies} from "../api/axios";
import {useCookies} from 'react-cookie';
import {StarTwoTone, StarFilled, Loading3QuartersOutlined} from '@ant-design/icons';
import {Tabs} from "./Tab";

function ExchangeRates(props) {
    const [cookies, setCookie] = useCookies(['favorites'])
    const [apiData, setApiData] = useState([])
    const [data, setData] = useState([])
    let initFavorites = []
    if (cookies.favorites) {
        initFavorites = cookies.favorites
    }
    const [searchValue, setSearchValue] = useState('')

    const onChangeInput = (e) => {
        setSearchValue(() => e.target.value)
    }
    const find = () => {
        setData(() => {
            let favorite = favorites.map(el => {
                let toReplaceRegex = new RegExp('</span>', "gi")
                return el.replace(/<span class="val">/g, '').replace(toReplaceRegex, '')
            })
            let newApiData = apiData.map(el => {
                let toReplaceRegex = new RegExp('</span>', "gi")
                return el.replace(/<span class="val">/g, '').replace(toReplaceRegex, '')
            })
            let newFindDataItems = Array.from(new Set([...favorite,...newApiData])).filter(el => el.toLowerCase().includes(searchValue.toLowerCase()))


            newFindDataItems = newFindDataItems.map((el, index) => {
                let toReplace = searchValue;
                let toReplaceRegex = new RegExp(toReplace, "gi");
                let newEl = el.replace(toReplaceRegex, function (str) {
                    return '<span class="findText">' + str + '</span>'
                })
                let item = favorite.find(f => f === el)
                if (item) {
                    return <li key={index}><span dangerouslySetInnerHTML={{__html: newEl}}/>
                        <StarFilled style={{color: '#FFA500'}} onClick={deleteFavorites(el)}/>
                    </li>
                } else {
                    return <li key={index}><span dangerouslySetInnerHTML={{__html: newEl}}/>
                        <StarTwoTone twoToneColor="#FFA500" onClick={addFavorites(el)}/>
                    </li>
                }
            })
            return newFindDataItems

        })
    }
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(() => true)
        currencies().then(r => {
            setLoading(() => false)
            let newData = []
            for (let value of Object.values(r.data.results)) {
                newData.push(value)
            }
            newData = newData.map(el => {
                    return `<span class="val">${el.id}</span> - ${el.currencyName}`
            })
            setData(() => {
                let dataItemsArr = []
                if (cookies.favorites) {
                    dataItemsArr = Array.from(new Set([...cookies.favorites, ...newData]))
                } else {
                    dataItemsArr = newData
                }
                let dataItems = dataItemsArr.map((el, index) => {
                    let item = favorites.find(f => f === el)
                    if (item) {
                        return <li key={index}><span dangerouslySetInnerHTML={{__html: el}}/>
                            <StarFilled style={{color: '#FFA500'}} onClick={deleteFavorites(el)}/>
                        </li>
                    } else {
                        return <li key={index}><span dangerouslySetInnerHTML={{__html: el}}/>
                            <StarTwoTone twoToneColor="#FFA500" onClick={addFavorites(el)}/>
                        </li>
                    }
                })
                return dataItems
            })
            setApiData(() => {
                return newData
            })
        })
    }, [])

    const [favorites, setFavorites] = useState(initFavorites)

    const addFavorites = (e) => () => {
        setFavorites((prev) => {
            if (prev.length) {
                let newFavorites = [...prev, e]
                setCookie('favorites', Array.from(new Set(newFavorites)))
                return Array.from(new Set(newFavorites))
            } else {
                setCookie('favorites', [e])
                return [...prev, e]
            }
        })
        setSearchValue(() => '')
    }
    const deleteFavorites = (e) => () => {
        let deleteCookies = cookies.favorites.filter(el => !(el === e))
        setCookie('favorites', deleteCookies)
        setFavorites((prev) => {
            let newFavorites = []
            prev.forEach(el => {
                if (!(el === e)) {
                    newFavorites.push(el)
                }
            })
            return newFavorites
        })
        setSearchValue(() => '')
    }

    useEffect(() => {
        setData(() => {
            let dataItemsArr = []
            if (cookies.favorites) {
                dataItemsArr = Array.from(new Set([...cookies.favorites, ...apiData]))
            } else {
                dataItemsArr = apiData
            }

            let dataItems = dataItemsArr.map((el, index) => {
                let item = favorites.find(f => f === el)
                if (item) {
                    return <li key={index}><span dangerouslySetInnerHTML={{__html: el}}/>
                        <StarFilled style={{color: '#FFA500'}} onClick={deleteFavorites(el)}/>
                    </li>
                } else {
                    return <li key={index}><span dangerouslySetInnerHTML={{__html: el}}/>
                        <StarTwoTone twoToneColor="#FFA500" onClick={addFavorites(el)}/>
                    </li>
                }
            })
            return dataItems
        })
    }, [cookies.favorites])
    const items = [
        {
            title: 'Все валюты', content: <>
                <div className={'searchWrap'}>
                    <span className={'searchTitle'}>Поиск валюты :</span>
                    <input type={'text'} value={searchValue} onKeyUp={find} onChange={onChangeInput}/>
                </div>
                <ul className={'allСurrency'}>
                    {data}
                </ul>
                {
                    loading ? <div className={'loadingWrap'}>
                        <Loading3QuartersOutlined style={{fontSize: '100px', color: '#29b6f6'}} spin/>
                    </div> : ''
                }
            </>
        },
        {
            title: 'Избранное', content: <ul className={'allСurrency'}>
                {favorites.length ? favorites.map((el, index) => <li key={index}><span
                    dangerouslySetInnerHTML={{__html: el}}/>
                    <StarFilled style={{color: '#FFA500'}} onClick={deleteFavorites(el)}/>
                </li>) : 'Здесь пока что пусто'}
            </ul>
        },
    ];

    return (
        <>
            <h1>Доступные валюты</h1>
            <Tabs items={items}/>
        </>
    );
}

export default ExchangeRates;
import './style/global.scss'
import Convertor from "./component/Convertor";
import ExchangeRates from "./component/ExchangeRates";
import {NavLink, Route} from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <header>
                <ul className={'menu'}>
                    <li><NavLink to="/" exact activeClassName={'activeMenu'}>Конвертор валют</NavLink></li>
                    <li><NavLink to="/ExchangeRates" exact activeClassName={'activeMenu'}>Валюты</NavLink></li>
                </ul>
            </header>
            <div className={'mainContainer'}>
                <Route exact path='/ExchangeRates' component={ExchangeRates}/>
                <Route exact path='/' component={Convertor}/>
            </div>
            <footer className={'footer'}>
                <div className={'footerContainer'}>
                    <div>© 2021 Разработанно - Степановым Дмитрием Андреевичем</div>
                    <a href="mailto:adel.ernandies@mail.ru">adel.ernandies@mail.ru</a>
                </div>
            </footer>
        </div>
    );
}

export default App;

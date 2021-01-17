import React, {useState} from 'react';
const TabContent = ({ title, content }) => (
    <div className="tabcontent">
        <h3>{title}</h3>
        <div className={'contentTab'}>{content}</div>
    </div>
);

export function Tabs({ items }) {
    const [ active, setActive ] = useState(0);

    const openTab = e => setActive(+e.target.dataset.index);

    return (
        <div className={'tabWrap'}>
            <div className="tab">
                {items.map((n, i) => (
                    <button
                        key={i}
                        className={`tablinks ${i === active ? 'active' : ''}`}
                        onClick={openTab}
                        data-index={i}
                    >{n.title}</button>
                ))}
            </div>
            {items[active] && <TabContent {...items[active]} />}
        </div>
    );
}

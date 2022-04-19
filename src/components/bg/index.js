import React from 'react';
import style from './style.module.css';

const BgSvg = require('@site/static/img/tbs.svg').default;

export default function BlogBackground () {
    
    return (
        <BgSvg role="img" className="background" />
    )
}
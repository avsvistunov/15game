import React from 'react';
import './App.css';

interface IProps {
    num: number;
    clickHandler: (e: React.MouseEvent, id: number) => void;
}

function Item(props: IProps) {
    return (
        <div className={['Item', props.num ? 'FilledItem' : 'EmptyItem'].join(' ')}
            onClick={(_) => props.clickHandler(_, props.num)}
        >{!!props.num ? props.num : ''}</div>
    );
}

export default Item;

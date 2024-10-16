import React, {useEffect, useState} from 'react';
import usePreviousProps from '../Hook/use-previous-props';

const Tile = (props) => {
    const previousValue = usePreviousProps(props.value);
    const hasChanged = props.value !== previousValue &&  props.value > previousValue;
    const [extraClass, setExtraClass] = useState('');

    useEffect( () => {
        if (hasChanged){
            setExtraClass('tile-popup');
            setTimeout(() => {
                setExtraClass('');
            }, 200);
        }
    }, [hasChanged])

    const getValueColor = (value) => {
        switch (value) {
            case null:
                return '#cdc1b4';
            case 2:
                return '#eee4da';
            case 4:
                return '#ede0c8';
            case 8:
                return '#f2b179';
            case 16:
                return '#f59563';
            case 32:
                return '#f67c5f';
            case 64:
                return '#f65e3b';
            case 128:
                return '#edcf72';
            case 256:
                return '#edcc61';
            case 512:
                return '#edc850';
            case 1024:
                return '#edc53f';
            case 2048:
                return '#edc22e';
            default:
                return '#ffffff'; // Default color if the value doesn't match any case
            }
        };
        const tileStyle = {
            backgroundColor: getValueColor(props.value),
            transition: 'scale .2s'
        };
    return (
        <div className={`tile ${extraClass}`} style={tileStyle}>
            {props.value}
        </div>
    );
};
export default Tile;
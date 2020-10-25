import { IonSearchbar } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

const GrocSearch = () => {

    const [searchTextState, setSearchTextState] = useState('');
    const history = useHistory();

    const setSearchText = (event) => {
        setSearchTextState(event.detail.value);
    }

    const doSearch = () => {
        if (searchTextState && searchTextState.length>0)
            history.push("/products/list?keywords="+searchTextState);
    }

    const checkGo = (event) => {
        if (event.key === 'Enter')
            doSearch();
    }

    return (
        <IonSearchbar 
            className="pt-1" 
            placeholder="Search for products" 
            value={searchTextState} 
            onIonChange={setSearchText}
            enterkeyhint="go"
            onKeyUp={checkGo}
            ></IonSearchbar>
    )
}

export default GrocSearch;
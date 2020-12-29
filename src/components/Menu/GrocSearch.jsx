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
        if (searchTextState && searchTextState.trim().length>0){
            let keywords = searchTextState.trim().split(' ');
            const searchText = keywords.map((word) => word+'*').join(' ');
            // alert(searchText);
            history.push("/products/list?keywords="+searchText);
        }
    }

    const checkGo = (event) => {
        if (event.key === 'Enter')
            doSearch();
    }

    return (
        <IonSearchbar 
            className="py-1" 
            placeholder="Search for products"
            autocomplete="on"
            value={searchTextState} 
            onIonChange={setSearchText}
            enterkeyhint="go"
            onKeyUp={checkGo}
            ></IonSearchbar>
    )
}

export default GrocSearch;
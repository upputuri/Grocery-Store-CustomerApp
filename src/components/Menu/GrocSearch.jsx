import { IonSearchbar, IonText } from '@ionic/react';
import { search } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

const GrocSearch = (props) => {
    const [searchTextState, setSearchTextState] = useState(props.searchText);
    const history = useHistory();

    const setSearchText = (event) => {
        setSearchTextState(event.detail.value);
    }

    const doSearch = () => {
        if (searchTextState && searchTextState.trim().length>0){
            let keywords = searchTextState.trim().split(' ');
            const searchText = keywords.map((word) => word+'*').join(' ');
            // alert(searchText);
            history.push("/products/list?keywords="+searchText+"&userinput="+searchTextState);
        }
    }

    const checkGo = (event) => {
        if (event.key === 'Enter')
            doSearch();
    }

    return (
        <div>
        <IonSearchbar 
            className="py-1" 
            placeholder="Search for productss"
            autocomplete="on"
            value={searchTextState} 
            onIonChange={setSearchText}
            enterkeyhint="go"
            onKeyUp={checkGo}
            ></IonSearchbar></div>
    )
}

export default GrocSearch;
import React from 'react';
import cx from 'classnames';

function SearchForm({newLocationChangeHandler, updateSearchField, getNewLocationSubmit, searchAutocomplete, searchAutocompleteOpen}) {
    return (
        <div className='search'>
            <form  role="search" onSubmit={(e) => e.preventDefault()} className="search__form" id="search__form">
                <label style={{display:'none'}} htmlFor="search__field">Get forecast</label>
                <input
                    onChange={newLocationChangeHandler} 
                    className="search__field" 
                    id="search__field" 
                    name="search__field" 
                    placeholder="Enter city name"
                    autoComplete="off"
                    aria-label="Introduce the city you want the forecast for." />

                <button aria-label="Get forecast of the given" onClick={(e) => getNewLocationSubmit(e)} type="button" className="btn btn__search">Get Forecast</button>
                <ul className={cx('search__autocomplete', {
                        'search__autocomplete-open': searchAutocompleteOpen
                    })} 
                    id="search__autocomplete">
                    {
                        searchAutocomplete.length > 0
                            ? searchAutocomplete.map(elem => {
                                return <li onClick={updateSearchField} key={elem}>{elem}</li>
                            })
                            :  ""
                    }
                </ul>
            </form>
        </div>
    );
}
export default SearchForm;

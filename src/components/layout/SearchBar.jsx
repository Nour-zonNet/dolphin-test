import React from 'react'
import { Search } from '../../utils/icons'

const SearchBar = () => {
  return (
    <div>
      <input type='search'>
        <Search />
        <p></p>
      </input>
    </div>
  )
}

export default SearchBar

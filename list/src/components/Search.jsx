import { TbSearch, TbX } from 'react-icons/tb';

const Search = ({search = "", setSearch}) => {
  if (!setSearch) {
    return null;
  }
  
  const clearSearch = () => {
    if (setSearch) {
      setSearch("");
    }
  };

  return (
    <div className="search">
        <h2>
          <TbSearch className="icon" />
          Pesquisar
        </h2>
        <div className="search-input-wrapper">
            <TbSearch className="search-icon" />
            <input 
                type="text" 
                value={search || ""} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Digite para pesquisar tarefas..."
                aria-label="Campo de pesquisa"
                className="search-input"
            />
            {search && (
                <button 
                    className="clear-search" 
                    onClick={clearSearch}
                    aria-label="Limpar pesquisa"
                    type="button"
                >
                    <TbX />
                </button>
            )}
        </div>
    </div>
  )
}

export default Search
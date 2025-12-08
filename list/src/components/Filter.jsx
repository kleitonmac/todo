import { TbFilter, TbListCheck, TbCheck, TbClock, TbSortAscending, TbSortDescending } from 'react-icons/tb';

const Filter = ({filter = "All", setFilter, setSort, sort = "Asc"}) => {
  if (!setFilter || !setSort) {
    return null;
  }
  
  return (
    <div className="filter">
        <h2>
          <TbFilter className="icon" />
          Filtros e Ordenação
        </h2>
        <div className="filter-options">
            <div>
                <p>Status:</p>
                <select 
                    value={filter || "All"} 
                    onChange={(e) => setFilter(e.target.value)}
                    aria-label="Filtrar por status"
                >
                    <option value="All"><TbListCheck /> Todas</option>
                    <option value="completed"><TbCheck /> Completas</option>
                    <option value="incompleted"><TbClock /> Incompletas</option>
                </select>
            </div>
            <div>
                <p>Ordenação:</p>
                <div className="sort-buttons">
                    <button 
                        className={(sort || "Asc") === "Asc" ? "active" : ""}
                        onClick={() => setSort("Asc")}
                        aria-label="Ordenar A-Z"
                    >
                        <TbSortAscending /> A-Z
                    </button>
                    <button 
                        className={(sort || "Asc") === "Desc" ? "active" : ""}
                        onClick={() => setSort("Desc")}
                        aria-label="Ordenar Z-A"
                    >
                        <TbSortDescending /> Z-A
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Filter
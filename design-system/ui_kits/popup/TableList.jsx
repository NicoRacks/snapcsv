// SnapCSV table list
function TableList({ tables, onSelect }) {
  return (
    <div className="table-list-panel">
      <p className="panel-title">Tables found</p>
      <ul className="table-list" role="list">
        {tables.map((t, i) => (
          <TableItem key={t.id} table={t} index={i + 1} onSelect={() => onSelect(t)} />
        ))}
      </ul>
    </div>
  );
}

function TableItem({ table, index, onSelect }) {
  return (
    <li
      className="table-item"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      aria-label={`${table.name}, ${table.rows} rows, ${table.cols} columns`}
    >
      <div className="table-item-index">{index}</div>
      <div className="table-item-info">
        <div className="table-item-name">{table.name}</div>
        <div className="table-item-meta">{table.rows} rows · {table.cols} columns</div>
      </div>
      <div className="table-item-arrow" aria-hidden="true">›</div>
    </li>
  );
}

Object.assign(window, { TableList });

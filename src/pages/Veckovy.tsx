import { useNavigate } from 'react-router-dom';
import { getDayColumns, getRecipeGrid, getTodayDayId } from '../lib/data';

export default function Veckovy() {
  const navigate = useNavigate();
  const dayColumns = getDayColumns();
  const recipeGrid = getRecipeGrid();
  const todayId = getTodayDayId();

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">Veckomat</h1>
        <p className="app-subtitle">Recept och veckoplan från Gun-Britt &amp; Åke</p>
      </header>
      <p style={{ marginBottom: '0.5rem' }}>Välj en dag för att se recept.</p>
      <div className="week-table-wrap">
        <table className="week-table">
          <thead>
            <tr>
              <th style={{ width: '2.5rem' }}>Rad</th>
              {dayColumns.map((col) => (
                <th
                  key={col.id}
                  className={todayId === col.id ? 'column-today' : ''}
                >
                  <button
                    type="button"
                    className="day-col-header"
                    onClick={() => navigate(`/dag/${col.id}`)}
                  >
                    {col.label} ({col.protein})
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recipeGrid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={
                      todayId === dayColumns[colIndex]?.id ? 'column-today' : ''
                    }
                  >
                    {cell && String(cell).trim() !== '' ? cell : '–'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

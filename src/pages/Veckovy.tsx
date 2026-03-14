import { useNavigate, Link } from 'react-router-dom';
import { getDayColumns, getRecipeGrid, getTodayDayId } from '../lib/data';

export default function Veckovy() {
  const navigate = useNavigate();
  const dayColumns = getDayColumns();
  const recipeGrid = getRecipeGrid();
  const todayId = getTodayDayId();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 no-underline text-lg mb-8"
      >
        <span aria-hidden>←</span> Tillbaka till startsidan
      </Link>

      <h1 className="text-2xl font-bold text-stone-800 mb-2">Veckans mat</h1>
      <p className="text-stone-600 mb-8">Välj en dag för att se och välja recept.</p>

      {/* Day buttons – primary navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
        {dayColumns.map((col) => {
          const isToday = todayId === col.id;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => navigate(`/dag/${col.id}`)}
              className={`
                min-h-[48px] px-4 sm:px-5 py-2.5 rounded-xl text-left font-medium transition-all
                ${isToday
                  ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400 shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50'
                }
              `}
            >
              <span className="block text-base sm:text-lg">{col.label}</span>
              <span className={`block text-sm ${isToday ? 'text-amber-700' : 'text-stone-500'}`}>
                {col.protein}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recipe grid – light, scannable */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-block min-w-full align-middle">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="pb-3 pr-4 text-sm font-semibold text-stone-500 w-12">#</th>
                {dayColumns.map((col) => (
                  <th
                    key={col.id}
                    className={`pb-3 px-2 sm:px-3 text-sm font-semibold ${
                      todayId === col.id ? 'text-amber-800' : 'text-stone-600'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-stone-700">
              {recipeGrid.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-stone-50/50' : ''}
                >
                  <td className="py-2.5 pr-4 pl-0 text-stone-400 text-sm font-medium">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-2.5 px-2 sm:px-3 text-sm sm:text-base ${
                        !cell || String(cell).trim() === '' ? 'text-stone-300 italic' : ''
                      } ${todayId === dayColumns[colIndex]?.id ? 'text-amber-900/90' : ''}`}
                    >
                      {cell && String(cell).trim() !== '' ? cell : '–'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

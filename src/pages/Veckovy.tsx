import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDayColumns, getRecipeGrid, getRecipesForDay, getTodayDayId } from '../lib/data';

export default function Veckovy() {
  const navigate = useNavigate();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const dayColumns = getDayColumns();
  const recipeGrid = getRecipeGrid();
  const todayId = getTodayDayId();
  const selectedDay = selectedDayId ? dayColumns.find((c) => c.id === selectedDayId) : null;
  const selectedDayRecipes = selectedDayId ? getRecipesForDay(selectedDayId) : [];

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

      {/* Day buttons – on desktop navigate, on mobile set selectedDayId */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
        {dayColumns.map((col) => {
          const isToday = todayId === col.id;
          const baseClass = `
            min-h-[48px] px-4 sm:px-5 py-2.5 rounded-xl text-left font-medium transition-all
            ${isToday
              ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50'
            }
          `;
          return (
            <span key={col.id} className="relative">
              {/* Desktop: navigate on click */}
              <button
                type="button"
                onClick={() => navigate(`/dag/${col.id}`)}
                className={`${baseClass} hidden md:block w-full min-w-0`}
              >
                <span className="block text-base sm:text-lg">{col.label}</span>
                <span className={`block text-sm ${isToday ? 'text-amber-700' : 'text-stone-500'}`}>
                  {col.protein}
                </span>
              </button>
              {/* Mobile: set selected day only */}
              <button
                type="button"
                onClick={() => setSelectedDayId(col.id)}
                className={`${baseClass} block md:hidden`}
              >
                <span className="block text-base sm:text-lg">{col.label}</span>
                <span className={`block text-sm ${isToday ? 'text-amber-700' : 'text-stone-500'}`}>
                  {col.protein}
                </span>
              </button>
            </span>
          );
        })}
      </div>

      {/* Mobile only: selected day recipe list (no table) */}
      <div className="md:hidden">
        {!selectedDayId ? (
          <p className="text-stone-600 text-lg">Välj en dag ovan för att se recept.</p>
        ) : selectedDay && (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-stone-800 m-0">
                {selectedDay.label} – {selectedDay.protein}
              </h2>
              <Link
                to={`/dag/${selectedDayId}`}
                className="text-amber-800 font-medium underline"
              >
                Gå till denna dag för att välja recept
              </Link>
            </div>
            <ul className="list-none p-0 m-0 space-y-2">
              {selectedDayRecipes.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => navigate(`/dag/${selectedDayId}`)}
                    className="w-full text-left py-2.5 px-3 rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-amber-300 hover:bg-amber-50/50 text-base"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop only: recipe table */}
      <div className="hidden md:block overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
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

import type { Question } from '../lib/data';

type Props = {
  question: Question;
  value: boolean | string | undefined;
  onChange: (value: boolean | string) => void;
};

export default function QuestionStep({ question, value, onChange }: Props) {
  const base = 'min-h-[48px] px-4 py-2 rounded-lg font-medium transition-colors ';
  const unselected = 'bg-stone-200 text-stone-800 hover:bg-stone-300';
  const selected = 'bg-amber-800 text-amber-50';

  if (question.type === 'yesno') {
    return (
      <div className="mb-4 p-4 bg-white border border-stone-200 rounded-lg">
        <p className="text-lg text-stone-800 mb-3 m-0">{question.text}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={base + (value === true ? selected : unselected)}
            onClick={() => onChange(true)}
          >
            Ja
          </button>
          <button
            type="button"
            className={base + (value === false ? selected : unselected)}
            onClick={() => onChange(false)}
          >
            Nej
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-white border border-stone-200 rounded-lg">
      <p className="text-lg text-stone-800 mb-3 m-0">{question.text}</p>
      <div className="flex flex-wrap gap-2">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={base + (value === opt ? selected : unselected)}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

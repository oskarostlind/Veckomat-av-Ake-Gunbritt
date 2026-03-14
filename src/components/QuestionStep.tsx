import type { Question } from '../lib/data';

type Props = {
  question: Question;
  value: boolean | string | undefined;
  onChange: (value: boolean | string) => void;
};

export default function QuestionStep({ question, value, onChange }: Props) {
  if (question.type === 'yesno') {
    return (
      <div className="question-step">
        <p>{question.text}</p>
        <div className="question-options">
          <button
            type="button"
            className={value === true ? 'selected' : ''}
            onClick={() => onChange(true)}
          >
            Ja
          </button>
          <button
            type="button"
            className={value === false ? 'selected' : ''}
            onClick={() => onChange(false)}
          >
            Nej
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="question-step">
      <p>{question.text}</p>
      <div className="question-options">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={value === opt ? 'selected' : ''}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

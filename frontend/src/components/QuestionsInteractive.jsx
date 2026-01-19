import { useState } from "react";
import "../styles/main.css";

export default function QuestionsInteractive({ questions, docId }) {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [isGrading, setIsGrading] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const gradeQuestion = async (question) => {
    setIsGrading(true);
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      
      // El backend espera query parameters, no JSON body
      const params = new URLSearchParams({
        question_id: question.id,
        question: question.question,
        user_answer: answers[question.id] || ""
      });

      console.log("Calificando pregunta:", question.id);
      console.log("URL:", `${apiBaseUrl}/documents/${docId}/practice/grade?${params}`);

      const res = await fetch(`${apiBaseUrl}/documents/${docId}/practice/grade?${params}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error del backend:", errorData);
        alert(`Error al calificar: ${errorData.detail || 'Error desconocido'}`);
        return;
      }

      const data = await res.json();
      console.log("Respuesta de calificación:", data);
      
      setResults(prev => ({ ...prev, [question.id]: data }));
    } catch (error) {
      console.error("Error al calificar:", error);
      alert("Error de conexión al calificar la pregunta");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="questions-container">
      {questions.map((q, idx) => (
        <div key={q.id} className="question-card">
          <div className="question-header">
            <span className="question-number">Pregunta {idx + 1}</span>
            <span className={`question-type ${q.type}`}>
              {q.type === 'mcq' ? 'Opción Múltiple' : 'Respuesta Corta'}
            </span>
          </div>
          
          <div className="question-text">{q.question}</div>
          
          {q.type === 'mcq' && q.options ? (
            <div className="question-options">
              {q.options.map((opt, i) => (
                <label key={i} className="option-label">
                  <input
                    type="radio"
                    name={q.id}
                    value={String.fromCharCode(65 + i)}
                    checked={answers[q.id] === String.fromCharCode(65 + i)}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  <span>{String.fromCharCode(65 + i)}. {opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="question-input"
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              rows={3}
            />
          )}
          
          <button
            className="grade-btn"
            onClick={() => gradeQuestion(q)}
            disabled={!answers[q.id] || isGrading}
          >
            {isGrading ? 'Calificando...' : 'Calificar'}
          </button>
          
          {results[q.id] && (
            <div className={`result-card ${results[q.id].is_correct ? 'correct' : 'incorrect'}`}>
              <div className="result-header">
                {results[q.id].is_correct ? '✅ Correcto' : '❌ Incorrecto'}
                <span className="result-score">
                  Puntuación: {Math.round(results[q.id].score * 100)}%
                </span>
              </div>
              <div className="result-feedback">{results[q.id].feedback}</div>
              {results[q.id].expected_answer && (
                <div className="result-expected">
                  <strong>Respuesta esperada:</strong> {results[q.id].expected_answer}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
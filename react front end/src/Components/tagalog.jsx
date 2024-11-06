import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizComponent1.css';

function TG() {
  const [topic, setTopic] = useState('');
  const [lesson, setLesson] = useState('');
  const [quiz, setQuiz] = useState({});
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizDetails, setQuizDetails] = useState([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState([]);

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    resetLessonAndQuiz();
  };

  const resetLessonAndQuiz = () => {
    setLesson('');
    setQuiz({});
    setScore(0);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizFinished(false);
    setQuizDetails([]);
    setAnswerFeedback([]);
    setIsQuizMode(false);
  };

  const generateLesson = async () => {
    if (!topic) {
      alert('Please select a topic!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/create_lesson', { topic });
      setLesson(response.data.lesson);
      setIsQuizMode(false);
    } catch (error) {
      console.error('Error generating lesson:', error);
    }
  };

  const generateQuiz = async () => {
    if (!topic) {
      alert('Please select a topic!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/create_quiz', { topic });
      const quizData = response.data;

      setQuiz(quizData);
      setIsQuizMode(true);
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  const handleAnswerSubmit = () => {
    if (userAnswers.length !== quiz.questions.length) {
      alert('Please answer all questions!');
      return;
    }

    axios.post('http://localhost:5001/submit_answer', {
      quiz_data: quiz,
      user_answers: userAnswers
    })
    .then(response => {
      setScore(response.data.score);
      setQuizDetails(response.data.quiz_details);
      setQuizFinished(true);
    })
    .catch(error => {
      console.error('Error submitting answers:', error);
    });
  };

  const handleAnswerChange = (index, answerIndex) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = quiz.answers[index][answerIndex];
    setUserAnswers(updatedAnswers);
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="header">Tagalog Quiz</h1>

        <div className="topic-selector">
          <h3>Select a Topic:</h3>
          <div className="topic-options">
            <div>
              <input
                type="radio"
                id="animals"
                name="topic"
                value="animals"
                onChange={handleTopicChange}
                checked={topic === 'animals'}
              />
              <label htmlFor="animals">Animals</label>
            </div>
            <div>
              <input
                type="radio"
                id="food"
                name="topic"
                value="food"
                onChange={handleTopicChange}
                checked={topic === 'food'}
              />
              <label htmlFor="food">Food</label>
            </div>
            <div>
              <input
                type="radio"
                id="travel"
                name="topic"
                value="travel"
                onChange={handleTopicChange}
                checked={topic === 'travel'}
              />
              <label htmlFor="travel">Travel</label>
            </div>
          </div>

          <div className="button-container">
            <button onClick={generateLesson} className="btn">Generate Lesson</button>
            <button onClick={generateQuiz} className="btn">Generate Quiz</button>
          </div>
        </div>

        {!isQuizMode && lesson && (
          <div className="lesson-card">
            <h3>Lesson on {topic}</h3>
            <p>{lesson}</p>
          </div>
        )}

        {isQuizMode && quiz.questions && !quizFinished && (
          <div className="quiz-card">
            <h3>Quiz on {topic}</h3>
            <p>Score: {score}</p>

            <div className="quiz-question">
              <p>{quiz.questions[currentQuestionIndex]}</p>

              {quiz.answers[currentQuestionIndex].map((answer, ansIndex) => (
                <div key={ansIndex} className="answer-option">
                  <input
                    type="radio"
                    id={`answer-${ansIndex}`}
                    name={`question-${currentQuestionIndex}`}
                    value={answer}
                    checked={userAnswers[currentQuestionIndex] === answer}
                    onChange={() => handleAnswerChange(currentQuestionIndex, ansIndex)}
                  />
                  <label htmlFor={`answer-${ansIndex}`}>{answer}</label>
                </div>
              ))}
            </div>

            <div className="quiz-navigation">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="btn-nav"
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="btn-nav"
                >
                  Next
                </button>
              ) : (
                <button onClick={handleAnswerSubmit} className="btn-submit">
                  Submit Answers
                </button>
              )}
            </div>
          </div>
        )}

        {quizFinished && (
          <div className="quiz-summary">
            <h3>Quiz Summary</h3>
            <div className="score-summary">
              <p>Your Score: <span className="score">{score}</span> out of {quiz.questions.length * 10}</p>
            </div>

            <div className="quiz-detail-list">
              {quizDetails.map((detail, index) => (
                <div key={index} className="quiz-detail">
                  <p><strong>Question:</strong> {detail.question}</p>
                  <p><strong>Your Answer:</strong> {detail.user_answer}</p>
                  <p><strong>Correct Answer:</strong> {detail.correct_answer}</p>
                  <p className={detail.is_correct ? 'correct' : 'wrong'}>
                    <strong>Result:</strong> {detail.is_correct ? 'Correct' : 'Wrong'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TG;

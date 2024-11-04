import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuizComponent.css';
import logo from './langpro.png';

const QuizComponent = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setQuizResults(null);
  };

  const handleAnswer = (answer) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/submit-quiz', {
        quizId: currentQuiz.id,
        answers: userAnswers,
      });
      setQuizResults(response.data);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <div className="quiz-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark full-screen">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="KidsLingo Logo" className="navbar-logo" />
            <span className="h3 mb-0 ms-2">KidsLingo</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/quizzes" className="nav-link">Quizzes</Link>
              </li>
              <li className="nav-item">
                <Link to="/activities" className="nav-link">Activities</Link>
              </li>
              <li className="nav-item">
                <Link to="/progress" className="nav-link">My Progress</Link>
              </li>
            </ul>
            <div className="d-flex">
              <button className="btn btn-outline-primary me-2">Login</button>
              <button className="btn btn-primary">Register</button>
            </div>
          </div>
        </div>
      </nav>

      <h1>Sinhala Language Quizzes</h1>

      {!currentQuiz && (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <button key={quiz.id} onClick={() => startQuiz(quiz)} className="quiz-button">
              {quiz.title}
            </button>
          ))}
        </div>
      )}

      {currentQuiz && !quizCompleted && (
        <div className="question-container">
          <h2>{currentQuiz.title}</h2>
          <p>{currentQuiz.questions[currentQuestionIndex].text}</p>
          <input
            type="text"
            placeholder="Your answer"
            onChange={(e) => handleAnswer(e.target.value)}
            value={userAnswers[currentQuestionIndex] || ''}
          />
        </div>
      )}
      
      {quizCompleted && quizResults && (
        <div className="result-container">
          <h2>Quiz Completed!</h2>
          <p>Total Score: {quizResults.total_score} / {quizResults.max_score}</p>
          <p>Percentage: {quizResults.percentage}%</p>
          <h3>Detailed Results:</h3>
          {quizResults.detailed_results.map((result, index) => (
            <div key={index} className="question-result">
              <p>Question {result.question_number}:</p>
              <p>Your Answer: {result.user_answer}</p>
              <p>Correct Answer: {result.correct_answer}</p>
              <p>Similarity Score: {result.similarity_score}</p>
              <p className={result.is_correct ? "correct-feedback" : "incorrect-feedback"}>
                Feedback: {result.feedback}
              </p>
            </div>
          ))}
          <button onClick={() => setCurrentQuiz(null)} className="back-button">
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
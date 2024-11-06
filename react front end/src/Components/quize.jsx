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
  const [currentAnswer, setCurrentAnswer] = useState('');
  const userId = localStorage.getItem('user_id');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }

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
    setCurrentAnswer('');
  };

  const handleAnswer = (answer) => {
    setCurrentAnswer(answer);
  };

  const submitAnswer = async () => {
    const updatedAnswers = { ...userAnswers, [currentQuestionIndex]: currentAnswer };
    setUserAnswers(updatedAnswers);

    try {
      await axios.post('http://localhost:5000/api/evaluate-answer', {
        userAnswer: currentAnswer,
        correctAnswer: currentQuiz.questions[currentQuestionIndex].correct_answer
      });

      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer('');
      } else {
        await submitQuiz(updatedAnswers);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const response = await axios.post('http://localhost:5000/api/submit-quiz', {
        quizId: currentQuiz.id,
        answers: finalAnswers,
      });
      setQuizResults(response.data);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <div className="quiz-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark full-screen">
  <div className="container">
    <Link to="/" className="navbar-brand d-flex align-items-center">
      <img src={logo} alt="KidsLingo Logo" className="navbar-logo" />
      <span className="h3 mb-0 ms-2">Lang Pro</span>
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
          <Link to="/quizes" className="nav-link">Quizzes</Link>
        </li>
        <li className="nav-item">
          <Link to="/subscription" className="nav-link">Subscription</Link>
        </li>
      </ul>
      <div className="d-flex align-items-center">
        {isLoggedIn ? (
          <div className="dropdown">
            <img
              src={profilePicture || 'default-profile.png'} // Add a default profile picture
              alt="Profile"
              className="rounded-circle"
              width="40"
              height="40"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ 
                cursor: 'pointer',
                border: '2px solid #fff',
                marginLeft: '15px'
              }}
            />
            <ul 
              className="dropdown-menu dropdown-menu-end" 
              aria-labelledby="dropdownMenuButton"
              style={{
                backgroundColor: '#343a40',
                marginTop: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <li>
                <Link 
                  className="dropdown-item text-light" 
                  to="/profile"
                  style={{ padding: '8px 20px' }}
                >
                  <i className="fas fa-user me-2"></i>Profile
                </Link>
              </li>
              <li>
                <Link 
                  className="dropdown-item text-light" 
                  to="/settings"
                  style={{ padding: '8px 20px' }}
                >
                  <i className="fas fa-cog me-2"></i>Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider" style={{ borderColor: 'rgba(255,255,255,0.1)' }}/></li>
              <li>
                <button 
                  className="dropdown-item text-light" 
                  onClick={handleLogout}
                  style={{ padding: '8px 20px' }}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowRegisterModal(true)}
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</nav>

      <h1>Sinhala Language Quizzes</h1>

      {!currentQuiz && (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <img src={quiz.image_url} alt={quiz.title} className="quiz-image" />
              <button onClick={() => startQuiz(quiz)} className="quiz-button">
                {quiz.title}
              </button>
            </div>
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
            value={currentAnswer}
          />
          <button onClick={submitAnswer} className="submit-answer">Enter</button>
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
              <p>Score: {result.is_correct ? "1" : "0"} / 1</p>
              <p className={result.is_correct ? "correct-feedback" : "incorrect-feedback"}>
                Feedback: {result.feedback}
              </p>
            </div>
          ))}
          <Link to="/quiz"><button  className="back-button">
            Back to Quizzes
          </button></Link>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
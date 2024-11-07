import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from './langpro.png';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/';
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

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

  const styles = {
    app: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#121212',
      color: '#EAEAEA',
      padding: '20px',
      height: '100vh',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: '#1E1E1E',
    },
    header: {
      textAlign: 'center',
      fontSize: '3em',
      color: '#00C2FF',
      marginBottom: '20px',
    },
    topicSelector: {
      marginBottom: '40px',
    },
    topicOptions: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
    },
    btn: {
      backgroundColor: '#00C2FF',
      color: '#121212',
      fontSize: '1.2em',
      padding: '10px 30px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    btnHover: {
      backgroundColor: '#0096b0',
    },
    lessonCard: {
      backgroundColor: '#2F2F2F',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '20px',
    },
    quizCard: {
      backgroundColor: '#2F2F2F',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '20px',
    },
    quizQuestion: {
      marginBottom: '15px',
    },
    answerOption: {
      marginLeft: '20px',
    },
    quizSummary: {
      backgroundColor: '#333',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginTop: '20px',
    },
    scoreSummary: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    score: {
      color: '#007BFF',
    },
    correct: {
      color: 'green',
    },
    wrong: {
      color: 'red',
    },
  };

  return (
    <div style={styles.app}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
                  <button
                    className="btn btn-dark dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="me-2">{username}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li>
                      <Link className="dropdown-item text-light" to="/profile">
                        <i className="fas fa-user me-2"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item text-light" to="/settings">
                        <i className="fas fa-cog me-2"></i>Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-light" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <button className="btn btn-outline-primary me-2" onClick={() => setShowLoginModal(true)}>
                    Login
                  </button>
                  <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        <h1 style={styles.header}>Tagalog Quiz</h1>

        <div style={styles.topicSelector}>
          <h3>Select a Topic:</h3>
          <div style={styles.topicOptions}>
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

          <div style={styles.buttonContainer}>
            <button onClick={generateLesson} style={styles.btn}>Generate Lesson</button>
            <button onClick={generateQuiz} style={styles.btn}>Generate Quiz</button>
          </div>
        </div>

        {!isQuizMode && lesson && (
          <div style={styles.lessonCard}>
            <h3>Lesson on {topic}</h3>
            <p>{lesson}</p>
          </div>
        )}

        {isQuizMode && quiz.questions && !quizFinished && (
          <div style={styles.quizCard}>
            <h3>Quiz on {topic}</h3>
            <p>Score: {score}</p>

            <div style={styles.quizQuestion}>
              <p>{quiz.questions[currentQuestionIndex]}</p>

              {quiz.answers[currentQuestionIndex].map((answer, ansIndex) => (
                <div key={ansIndex} style={styles.answerOption}>
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
                  style={styles.btn}
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="btn-nav"
                  style={styles.btn}
                >
                  Next
                </button>
              ) : (
                <button onClick={handleAnswerSubmit} style={styles.btn}>
                  Submit Answers
                </button>
              )}
            </div>
          </div>
        )}

        {quizFinished && (
          <div style={styles.quizSummary}>
            <h3>Quiz Summary</h3>
            <div style={styles.scoreSummary}>
              <p>Your Score: <span style={styles.score}>{score}</span> out of {quiz.questions.length * 10}</p>
            </div>

            <div className="quiz-detail-list">
              {quizDetails.map((detail, index) => (
                <div key={index} style={styles.quizDetail}>
                  <p><strong>Question:</strong> {detail.question}</p>
                  <p><strong>Your Answer:</strong> {detail.user_answer}</p>
                  <p><strong>Correct Answer:</strong> {detail.correct_answer}</p>
                  <p style={detail.is_correct ? styles.correct : styles.wrong}>
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
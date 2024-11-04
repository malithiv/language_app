from flask import Flask, jsonify, request
from flask_cors import CORS
from nltk.tokenize import word_tokenize
from nltk.metrics.distance import edit_distance
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
import numpy as np
import unicodedata

app = Flask(__name__)
CORS(app)

# Download required NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')


class SmartAnswerEvaluator:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        # Mapping for Sinhala transliteration
        self.transliteration_map = {
            'ā': 'a', 'æ': 'ae', 'ǣ': 'ae',
            'í': 'i', 'ī': 'i', 'ú': 'u', 'ū': 'u',
            'ṭ': 't', 'ḍ': 'd', 'ṇ': 'n',
            'ṅ': 'ng', 'ñ': 'n', 'ṃ': 'm',
            'ś': 'sh', 'ṣ': 'sh',
            # Add specific Sinhala-Roman mappings
            'ayubowan': 'ආයුබෝවන්',
            'amma': 'අම්මා',
            'sthuthiyi': 'ස්තූතියි',
            'thaththa': 'තාත්තා',
            'wathura': 'වතුර',
            'gedara': 'ගෙදර',
            'paha': 'පහ',
            'rathu': 'රතු',
            'nil': 'නිල්',
            'karunakara': 'කරුණාකර'
        }

    def evaluate_answer(self, user_answer, correct_answer):
        if not user_answer or not correct_answer:
            return 0.0

        user_answer = str(user_answer).strip().lower()
        correct_answer = str(correct_answer).strip()

        # Direct match
        if user_answer == correct_answer:
            return 1.0

        # Check transliteration map
        if user_answer in self.transliteration_map and self.transliteration_map[user_answer] == correct_answer:
            return 1.0

        # Check reverse mapping
        for roman, sinhala in self.transliteration_map.items():
            if (user_answer == roman and correct_answer == sinhala) or \
               (user_answer == sinhala and correct_answer == roman):
                return 1.0

        # Fuzzy matching for partial matches
        normalized_user = self.normalize_text(user_answer)
        normalized_correct = self.normalize_text(self.romanize(correct_answer))
        
        # Calculate edit distance similarity
        edit_sim = 1 - (edit_distance(normalized_user, normalized_correct) / 
                       max(len(normalized_user), len(normalized_correct)))
        
        # Calculate character overlap similarity
        char_sim = self.character_similarity(normalized_user, normalized_correct)
        
        # Combined score with weighted average
        final_score = (edit_sim * 0.6) + (char_sim * 0.4)
        
        return final_score

    def normalize_text(self, text):
        # Remove diacritics and convert to ASCII
        text = ''.join(c for c in unicodedata.normalize('NFD', text)
                      if unicodedata.category(c) != 'Mn')
        # Remove special characters and extra spaces
        text = ''.join(c.lower() for c in text if c.isalnum() or c.isspace())
        return text.strip()

    def romanize(self, text):
        # Convert Sinhala text to romanized form for comparison
        for roman, sinhala in self.transliteration_map.items():
            if sinhala in text:
                text = text.replace(sinhala, roman)
        return text

    def character_similarity(self, text1, text2):
        set1 = set(text1)
        set2 = set(text2)
        intersection = set1 & set2
        union = set1 | set2
        if not union:
            return 0.0
        return len(intersection) / len(union)


# Complete quiz data with 20 quizzes
quizzes = [
    {
        "id": 1,
        "title": "Basic Greetings",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'Hello' in Sinhala",
                "correct_answer": "ආයුබෝවන්",
                "alternatives": ["ayubowan", "ආයුබෝවන්", "ayubowan", "ayubovan"]
            },
            {
                "text": "How do you say 'Good morning' in Sinhala?",
                "correct_answer": "සුභ උදෑසනක්",
                "alternatives": ["subha udaysanak", "සුභ උදෑසනක්", "suba udaysanak"]
            }
        ]
    },
    {
        "id": 2,
        "title": "Numbers 1-10",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'one' in Sinhala",
                "correct_answer": "එක",
                "alternatives": ["eka", "එක", "ek"]
            },
            {
                "text": "Write 'five' in Sinhala",
                "correct_answer": "පහ",
                "alternatives": ["paha", "පහ", "pa"]
            }
        ]
    },
    {
        "id": 3,
        "title": "Family Members",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'mother' in Sinhala",
                "correct_answer": "අම්මා",
                "alternatives": ["amma", "අම්මා", "ammi"]
            },
            {
                "text": "Write 'father' in Sinhala",
                "correct_answer": "තාත්තා",
                "alternatives": ["thaththa", "තාත්තා", "tatta"]
            }
        ]
    },
    {
        "id": 4,
        "title": "Colors",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'red' in Sinhala",
                "correct_answer": "රතු",
                "alternatives": ["rathu", "රතු", "ratu"]
            },
            {
                "text": "Write 'blue' in Sinhala",
                "correct_answer": "නිල්",
                "alternatives": ["nil", "නිල්", "neel"]
            }
        ]
    },
    {
        "id": 5,
        "title": "Common Phrases",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'Thank you' in Sinhala",
                "correct_answer": "ස්තූතියි",
                "alternatives": ["sthuthiyi", "ස්තූතියි", "istuti"]
            },
            {
                "text": "Write 'Please' in Sinhala",
                "correct_answer": "කරුණාකර",
                "alternatives": ["karunakara", "කරුණාකර", "karuna"]
            }
        ]
    },
    {
        "id": 6,
        "title": "Days of the Week",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'Monday' in Sinhala",
                "correct_answer": "සඳුදා",
                "alternatives": ["sanduda", "සඳුදා", "sadura"]
            },
            {
                "text": "Write 'Sunday' in Sinhala",
                "correct_answer": "ඉරිදා",
                "alternatives": ["irida", "ඉරිදා", "iruda"]
            }
        ]
    },
    {
        "id": 7,
        "title": "Food Items",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'rice' in Sinhala",
                "correct_answer": "බත්",
                "alternatives": ["bath", "බත්", "bath"]
            },
            {
                "text": "Write 'water' in Sinhala",
                "correct_answer": "වතුර",
                "alternatives": ["wathura", "වතුර", "watura"]
            }
        ]
    },
    {
        "id": 8,
        "title": "Weather Terms",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'rain' in Sinhala",
                "correct_answer": "වැස්ස",
                "alternatives": ["wessa", "වැස්ස", "wassa"]
            },
            {
                "text": "Write 'sun' in Sinhala",
                "correct_answer": "ඉර",
                "alternatives": ["ira", "ඉර", "hiru"]
            }
        ]
    },
    {
        "id": 9,
        "title": "Body Parts",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'eye' in Sinhala",
                "correct_answer": "ඇස",
                "alternatives": ["asa", "ඇස", "æsa"]
            },
            {
                "text": "Write 'hand' in Sinhala",
                "correct_answer": "අත",
                "alternatives": ["atha", "අත", "ata"]
            }
        ]
    },
    # Continuing from previous quizzes...
    {
        "id": 10,
        "title": "Animals",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'dog' in Sinhala",
                "correct_answer": "බල්ලා",
                "alternatives": ["balla", "බල්ලා", "balla"]
            },
            {
                "text": "Write 'cat' in Sinhala",
                "correct_answer": "පූසා",
                "alternatives": ["pusa", "පූසා", "poosa"]
            }
        ]
    },
    {
        "id": 11,
        "title": "Fruits",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'banana' in Sinhala",
                "correct_answer": "කෙසෙල්",
                "alternatives": ["kesel", "කෙසෙල්", "kehel"]
            },
            {
                "text": "Write 'mango' in Sinhala",
                "correct_answer": "අඹ",
                "alternatives": ["amba", "අඹ", "amba"]
            }
        ]
    },
    {
        "id": 12,
        "title": "Vehicles",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'car' in Sinhala",
                "correct_answer": "කාර් එක",
                "alternatives": ["kar eka", "කාර් එක", "car eka"]
            },
            {
                "text": "Write 'bus' in Sinhala",
                "correct_answer": "බස් එක",
                "alternatives": ["bas eka", "බස් එක", "bus eka"]
            }
        ]
    },
    {
        "id": 13,
        "title": "Time Expressions",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'today' in Sinhala",
                "correct_answer": "අද",
                "alternatives": ["ada", "අද", "ada"]
            },
            {
                "text": "Write 'tomorrow' in Sinhala",
                "correct_answer": "හෙට",
                "alternatives": ["heta", "හෙට", "heta"]
            }
        ]
    },
    {
        "id": 14,
        "title": "Directions",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'left' in Sinhala",
                "correct_answer": "වම",
                "alternatives": ["wama", "වම", "vama"]
            },
            {
                "text": "Write 'right' in Sinhala",
                "correct_answer": "දකුණ",
                "alternatives": ["dakuna", "දකුණ", "dakunu"]
            }
        ]
    },
    {
        "id": 15,
        "title": "Common Verbs",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'eat' in Sinhala",
                "correct_answer": "කනවා",
                "alternatives": ["kanawa", "කනවා", "kanna"]
            },
            {
                "text": "Write 'drink' in Sinhala",
                "correct_answer": "බොනවා",
                "alternatives": ["bonawa", "බොනවා", "bonna"]
            }
        ]
    },
    {
        "id": 16,
        "title": "Emotions",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'happy' in Sinhala",
                "correct_answer": "සතුටු",
                "alternatives": ["sathutu", "සතුටු", "santhose"]
            },
            {
                "text": "Write 'sad' in Sinhala",
                "correct_answer": "දුක",
                "alternatives": ["duka", "දුක", "duka"]
            }
        ]
    },
    {
        "id": 17,
        "title": "Places",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'home' in Sinhala",
                "correct_answer": "ගෙදර",
                "alternatives": ["gedara", "ගෙදර", "gedera"]
            },
            {
                "text": "Write 'school' in Sinhala",
                "correct_answer": "පාසල",
                "alternatives": ["pasala", "පාසල", "paasala"]
            }
        ]
    },
    {
        "id": 18,
        "title": "Nature",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'tree' in Sinhala",
                "correct_answer": "ගස",
                "alternatives": ["gaha", "ගස", "gasa"]
            },
            {
                "text": "Write 'flower' in Sinhala",
                "correct_answer": "මල",
                "alternatives": ["mala", "මල", "mal"]
            }
        ]
    },
    {
        "id": 19,
        "title": "Numbers 11-20",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'fifteen' in Sinhala",
                "correct_answer": "පහළොව",
                "alternatives": ["pahalowa", "පහළොව", "pahalova"]
            },
            {
                "text": "Write 'twenty' in Sinhala",
                "correct_answer": "විස්ස",
                "alternatives": ["vissa", "විස්ස", "wissa"]
            }
        ]
    },
    {
        "id": 20,
        "title": "Simple Sentences",
        "type": "text_input",
        "questions": [
            {
                "text": "Write 'I am going home' in Sinhala",
                "correct_answer": "මම ගෙදර යනවා",
                "alternatives": ["mama gedara yanawa", "මම ගෙදර යනවා", "man gedara yanawa"]
            },
            {
                "text": "Write 'What is your name?' in Sinhala",
                "correct_answer": "ඔයාගේ නම මොකද්ද",
                "alternatives": ["oyage nama mokadda", "ඔයාගේ නම මොකද්ද", "oyage nama monawada"]
            }
        ]
    }
]

class QuizManager:
    def __init__(self):
        self.evaluator = SmartAnswerEvaluator()
    
    def grade_quiz(self, quiz_id, user_answers):
        quiz = next((q for q in quizzes if q['id'] == quiz_id), None)
        if not quiz:
            return {"error": "Quiz not found"}
            
        results = []
        total_score = 0
        
        for i, question in enumerate(quiz['questions']):
            if str(i) not in user_answers:
                continue
                
            user_answer = user_answers[str(i)]
            correct_answer = question['correct_answer']
            
            # Calculate similarity score
            similarity = self.evaluator.evaluate_answer(user_answer, correct_answer)
            
            # Check alternatives if provided
            if 'alternatives' in question:
                alt_scores = [
                    self.evaluator.evaluate_answer(user_answer, alt)
                    for alt in question['alternatives']
                ]
                similarity = max([similarity] + alt_scores)
            
            # Determine if answer is correct (similarity > threshold)
            is_correct = similarity > 0.8
            
            result = {
                "question_number": i + 1,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "similarity_score": round(similarity, 2),
                "is_correct": is_correct,
                "feedback": self.generate_feedback(similarity)
            }
            
            results.append(result)
            if is_correct:
                total_score += 1
                
        return {
            "quiz_id": quiz_id,
            "total_score": total_score,
            "max_score": len(quiz['questions']),
            "percentage": round((total_score / len(quiz['questions'])) * 100, 1),
            "detailed_results": results
        }
    
    def generate_feedback(self, similarity_score):
        if similarity_score >= 0.9:
            return "Excellent! Your answer is correct."
        elif similarity_score >= 0.8:
            return "Very good! Your answer is mostly correct."
        elif similarity_score >= 0.6:
            return "Good attempt, but there's room for improvement."
        else:
            return "Please review this question again."

# Flask routes
@app.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    return jsonify(quizzes)

@app.route('/api/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = next((q for q in quizzes if q['id'] == quiz_id), None)
    if quiz:
        return jsonify(quiz)
    return jsonify({"error": "Quiz not found"}), 404

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    try:
        data = request.json
        quiz_id = data.get('quizId')
        answers = data.get('answers')
        
        if not quiz_id or not answers:
            return jsonify({"error": "Missing quiz ID or answers"}), 400
            
        quiz_manager = QuizManager()
        results = quiz_manager.grade_quiz(quiz_id, answers)
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/evaluate-answer', methods=['POST'])
def evaluate_single_answer():
    try:
        data = request.json
        user_answer = data.get('userAnswer')
        correct_answer = data.get('correctAnswer')
        
        if not user_answer or not correct_answer:
            return jsonify({"error": "Missing user answer or correct answer"}), 400
        
        evaluator = SmartAnswerEvaluator()
        similarity = evaluator.evaluate_answer(user_answer, correct_answer)
        
        return jsonify({
            "similarity_score": round(similarity, 2),
            "is_correct": similarity > 0.8,
            "feedback": QuizManager().generate_feedback(similarity)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Additional utility routes
@app.route('/api/quiz-stats/<int:quiz_id>', methods=['GET'])
def get_quiz_stats(quiz_id):
    quiz = next((q for q in quizzes if q['id'] == quiz_id), None)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
        
    return jsonify({
        "quiz_id": quiz_id,
        "title": quiz["title"],
        "question_count": len(quiz["questions"]),
        "type": quiz["type"]
    })

@app.route('/api/quiz-categories', methods=['GET'])
def get_quiz_categories():
    categories = list(set(quiz["title"] for quiz in quizzes))
    return jsonify(categories)

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Example usage and testing
if __name__ == '__main__':
    # Test the evaluator
    evaluator = SmartAnswerEvaluator()
    
    # Test cases
    test_cases = [
        ("ayubowan", "ආයුබෝවන්"),
        ("amma", "අම්මා"),
        ("sthuthiyi", "ස්තූතියි")
    ]
    
    print("Running test cases:")
    for user_input, correct_answer in test_cases:
        score = evaluator.evaluate_answer(user_input, correct_answer)
        print(f"User input: {user_input}")
        print(f"Correct answer: {correct_answer}")
        print(f"Similarity score: {score:.2f}")
        print("---")
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
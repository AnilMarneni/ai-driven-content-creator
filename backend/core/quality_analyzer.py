
import textstat
from textblob import TextBlob
from typing import Dict, Any

def analyze_quality(text: str) -> Dict[str, Any]:
    """
    Analyzes content quality using TextStat and TextBlob.
    Returns a dictionary of metrics.
    """
    if not text:
        return {
            "readability_score": 0,
            "readability_label": "N/A",
            "sentiment_score": 0,
            "sentiment_label": "Neutral",
            "word_count": 0,
            "reading_time_seconds": 0
        }

    # 1. Readability (Flesch Reading Ease)
    # 90-100 : Very Easy
    # 80-89  : Easy
    # 70-79  : Fairly Easy
    # 60-69  : Standard
    # 50-59  : Fairly Difficult
    # 30-49  : Difficult
    # 0-29   : Very Difficult
    score = textstat.flesch_reading_ease(text)
    
    if score >= 90: label = "Very Easy"
    elif score >= 80: label = "Easy"
    elif score >= 70: label = "Fairly Easy"
    elif score >= 60: label = "Standard"
    elif score >= 50: label = "Fairly Difficult"
    elif score >= 30: label = "Difficult"
    else: label = "Very Difficult"

    # 2. Sentiment
    # Polarity: -1.0 (Negative) to 1.0 (Positive)
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    
    if sentiment > 0.5: sent_label = "Very Positive"
    elif sentiment > 0.1: sent_label = "Positive"
    elif sentiment < -0.5: sent_label = "Very Negative"
    elif sentiment < -0.1: sent_label = "Negative"
    else: sent_label = "Neutral"

    # 3. Stats
    word_count = len(text.split())
    # Average reading speed: 200-250 wpm. Let's use 230.
    reading_time = round(word_count / (230 / 60)) # in seconds

    return {
        "readability_score": score,
        "readability_label": label,
        "sentiment_score": round(sentiment, 2),
        "sentiment_label": sent_label,
        "word_count": word_count,
        "reading_time_seconds": reading_time
    }

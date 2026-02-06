import re

def calculate_readability(text: str) -> float:
    """
    Calculate Flesch-Kincaid Readability Score (Approximation).
    Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    """
    if not text.strip():
        return 0.0
        
    sentences = re.split(r'[.!?]+', text)
    sentences = [s for s in sentences if s.strip()]
    num_sentences = len(sentences) or 1
    
    words = text.split()
    num_words = len(words) or 1
    
    # Rough syllable count (count vowels)
    def count_syllables(word):
        word = word.lower()
        count = 0
        vowels = "aeiouy"
        if word[0] in vowels:
            count += 1
        for i in range(1, len(word)):
            if word[i] in vowels and word[i - 1] not in vowels:
                count += 1
        if word.endswith("e"):
            count -= 1
        if count == 0:
            count = 1
        return count

    num_syllables = sum(count_syllables(w) for w in words)
    
    score = 206.835 - 1.015 * (num_words / num_sentences) - 84.6 * (num_syllables / num_words)
    return round(max(0, min(100, score)), 1)

def analyze_seo(content: str, keywords: str) -> dict:
    """
    Analyze content for SEO metrics.
    """
    keyword_list = [k.strip().lower() for k in keywords.split(",") if k.strip()]
    words = content.lower().split()
    total_words = len(words) or 1
    
    results = {
        "score": 0,
        "readability_score": calculate_readability(content),
        "word_count": total_words,
        "keyword_analysis": [],
        "checks": {
            "has_h1": "# " in content,
            "has_h2": "## " in content,
            "paragraph_length": True # Simplified
        }
    }
    
    # Keyword Density
    if keyword_list:
        matches = 0
        for kw in keyword_list:
            count = content.lower().count(kw)
            density = (count / total_words) * 100
            status = "Good" if 0.5 <= density <= 2.5 else ("Low" if density < 0.5 else "High")
            matches += 1 if status == "Good" else 0
            
            results["keyword_analysis"].append({
                "keyword": kw,
                "count": count,
                "density": round(density, 2),
                "status": status
            })
        
        # Calculate SEO Score based on keyword hits and structure
        keyword_score = (matches / len(keyword_list)) * 50
        structure_score = (25 if results["checks"]["has_h1"] else 0) + (25 if results["checks"]["has_h2"] else 0)
        results["score"] = round(keyword_score + structure_score)
    else:
        # If no keywords, base on structure and readability
        structure_score = (30 if results["checks"]["has_h1"] else 0) + (30 if results["checks"]["has_h2"] else 0)
        readability_contribution = min(40, results["readability_score"] / 2.5)
        results["score"] = round(structure_score + readability_contribution)

    return results

const fs = require('fs').promises;
const path = require('path');

class RulesEngine {
  constructor() {
    this.rules = [];
    this.loadRules();
  }

  async loadRules() {
    try {
      const rulesPath = path.join(__dirname, '../config/symptom-rules.json');
      const rulesData = await fs.readFile(rulesPath, 'utf8');
      this.rules = JSON.parse(rulesData);
      console.log(`📋 Loaded ${this.rules.length} symptom rules`);
    } catch (error) {
      console.error('❌ Failed to load rules:', error.message);
      this.rules = this.getDefaultRules();
    }
  }

  getDefaultRules() {
    return [
      {
        id: 'emergency_chest_pain',
        name: 'Emergency: Severe Chest Pain',
        conditions: {
          symptoms: ['chest pain', 'chest pressure', 'heart pain'],
          severity: { min: 8 },
          associatedSymptoms: ['shortness of breath', 'nausea', 'sweating', 'dizziness']
        },
        suggestions: {
          urgency: 'emergency',
          action: 'Call 911 immediately',
          reasoning: 'Severe chest pain with associated symptoms may indicate a heart attack or other serious cardiac emergency.',
          confidence: 95,
          nextSteps: [
            'Call emergency services immediately',
            'Chew aspirin if not allergic',
            'Stay calm and sit upright',
            'Do not drive yourself to hospital'
          ]
        }
      },
      {
        id: 'emergency_breathing',
        name: 'Emergency: Severe Breathing Difficulty',
        conditions: {
          symptoms: ['shortness of breath', 'difficulty breathing', 'can\'t breathe'],
          severity: { min: 8 },
          duration: { unit: 'minutes', max: 30 }
        },
        suggestions: {
          urgency: 'emergency',
          action: 'Seek immediate emergency care',
          reasoning: 'Severe breathing difficulty can be life-threatening and requires immediate medical attention.',
          confidence: 90,
          nextSteps: [
            'Call 911 or go to ER immediately',
            'Sit upright and try to stay calm',
            'Use rescue inhaler if prescribed',
            'Remove any tight clothing'
          ]
        }
      },
      {
        id: 'urgent_high_fever',
        name: 'Urgent: High Fever with Symptoms',
        conditions: {
          symptoms: ['fever', 'high temperature'],
          temperature: { min: 103 },
          associatedSymptoms: ['headache', 'neck stiffness', 'confusion', 'rash']
        },
        suggestions: {
          urgency: 'urgent',
          action: 'Seek medical care within 2-4 hours',
          reasoning: 'High fever with neurological symptoms may indicate serious infection requiring prompt treatment.',
          confidence: 85,
          nextSteps: [
            'Go to urgent care or ER',
            'Take temperature-reducing medication',
            'Stay hydrated',
            'Monitor for worsening symptoms'
          ]
        }
      },
      {
        id: 'moderate_persistent_headache',
        name: 'Moderate: Persistent Severe Headache',
        conditions: {
          symptoms: ['headache', 'head pain'],
          severity: { min: 7 },
          duration: { unit: 'hours', min: 6 }
        },
        suggestions: {
          urgency: 'moderate',
          action: 'Schedule appointment with healthcare provider within 24-48 hours',
          reasoning: 'Persistent severe headaches may indicate an underlying condition that needs evaluation.',
          confidence: 75,
          nextSteps: [
            'Contact your primary care doctor',
            'Keep a headache diary',
            'Try over-the-counter pain relief',
            'Rest in a dark, quiet room'
          ]
        }
      },
      {
        id: 'mild_cold_symptoms',
        name: 'Mild: Common Cold Symptoms',
        conditions: {
          symptoms: ['runny nose', 'congestion', 'sneezing', 'sore throat'],
          severity: { max: 4 },
          temperature: { max: 100.4 }
        },
        suggestions: {
          urgency: 'mild',
          action: 'Self-care and monitor symptoms',
          reasoning: 'These appear to be mild cold symptoms that typically resolve with rest and home care.',
          confidence: 80,
          nextSteps: [
            'Get plenty of rest',
            'Stay hydrated',
            'Use over-the-counter remedies as needed',
            'Monitor for worsening symptoms',
            'Contact doctor if symptoms persist > 10 days'
          ]
        }
      },
      {
        id: 'routine_mild_symptoms',
        name: 'Routine: Mild General Symptoms',
        conditions: {
          severity: { max: 3 },
          duration: { unit: 'days', max: 2 }
        },
        suggestions: {
          urgency: 'routine',
          action: 'Monitor and practice self-care',
          reasoning: 'Mild symptoms of short duration often resolve on their own with basic self-care.',
          confidence: 70,
          nextSteps: [
            'Continue monitoring symptoms',
            'Maintain good hydration',
            'Get adequate rest',
            'Consider over-the-counter remedies if appropriate',
            'Contact healthcare provider if symptoms worsen or persist'
          ]
        }
      }
    ];
  }

  analyzeSymptoms(symptomLogs) {
    if (!Array.isArray(symptomLogs) || symptomLogs.length === 0) {
      return {
        suggestions: [],
        confidence: 0,
        reasoning: 'No symptoms provided for analysis'
      };
    }

    const matchedRules = [];

    for (const rule of this.rules) {
      const score = this.evaluateRule(rule, symptomLogs);
      if (score > 0) {
        matchedRules.push({
          rule,
          score,
          confidence: Math.min(rule.suggestions.confidence * (score / 100), 100)
        });
      }
    }

    // Sort by score and confidence
    matchedRules.sort((a, b) => (b.score * b.confidence) - (a.score * a.confidence));

    return {
      suggestions: matchedRules.slice(0, 3).map(match => ({
        ...match.rule.suggestions,
        ruleName: match.rule.name,
        confidence: Math.round(match.confidence)
      })),
      confidence: matchedRules.length > 0 ? Math.round(matchedRules[0].confidence) : 0,
      reasoning: this.generateReasoning(symptomLogs, matchedRules)
    };
  }

  evaluateRule(rule, symptomLogs) {
    let score = 0;
    const conditions = rule.conditions;

    // Check symptom matches
    if (conditions.symptoms) {
      const symptomMatches = this.checkSymptomMatches(conditions.symptoms, symptomLogs);
      if (symptomMatches === 0) return 0; // Must have at least one symptom match
      score += symptomMatches * 30;
    }

    // Check severity conditions
    if (conditions.severity) {
      const severityScore = this.checkSeverityConditions(conditions.severity, symptomLogs);
      score += severityScore;
    }

    // Check duration conditions
    if (conditions.duration) {
      const durationScore = this.checkDurationConditions(conditions.duration, symptomLogs);
      score += durationScore;
    }

    // Check temperature conditions
    if (conditions.temperature) {
      const tempScore = this.checkTemperatureConditions(conditions.temperature, symptomLogs);
      score += tempScore;
    }

    // Check associated symptoms
    if (conditions.associatedSymptoms) {
      const associatedScore = this.checkAssociatedSymptoms(conditions.associatedSymptoms, symptomLogs);
      score += associatedScore;
    }

    return Math.min(score, 100);
  }

  checkSymptomMatches(ruleSymptoms, symptomLogs) {
    let matches = 0;
    
    for (const ruleSymptom of ruleSymptoms) {
      const found = symptomLogs.some(log => 
        log.name.toLowerCase().includes(ruleSymptom.toLowerCase()) ||
        ruleSymptom.toLowerCase().includes(log.name.toLowerCase())
      );
      if (found) matches++;
    }

    return (matches / ruleSymptoms.length) * 100;
  }

  checkSeverityConditions(severityCondition, symptomLogs) {
    const severities = symptomLogs.map(log => log.severity);
    const maxSeverity = Math.max(...severities);
    const avgSeverity = severities.reduce((a, b) => a + b, 0) / severities.length;

    let score = 0;

    if (severityCondition.min !== undefined) {
      if (maxSeverity >= severityCondition.min) {
        score += 25;
      }
    }

    if (severityCondition.max !== undefined) {
      if (maxSeverity <= severityCondition.max) {
        score += 25;
      }
    }

    if (severityCondition.avg !== undefined) {
      if (Math.abs(avgSeverity - severityCondition.avg) <= 1) {
        score += 15;
      }
    }

    return score;
  }

  checkDurationConditions(durationCondition, symptomLogs) {
    let score = 0;

    for (const log of symptomLogs) {
      const durationInHours = this.convertToHours(log.duration.value, log.duration.unit);
      const conditionInHours = this.convertToHours(
        durationCondition.value || durationCondition.min || durationCondition.max,
        durationCondition.unit
      );

      if (durationCondition.min !== undefined) {
        const minInHours = this.convertToHours(durationCondition.min, durationCondition.unit);
        if (durationInHours >= minInHours) score += 15;
      }

      if (durationCondition.max !== undefined) {
        const maxInHours = this.convertToHours(durationCondition.max, durationCondition.unit);
        if (durationInHours <= maxInHours) score += 15;
      }
    }

    return Math.min(score, 30);
  }

  checkTemperatureConditions(tempCondition, symptomLogs) {
    const temperatures = symptomLogs
      .filter(log => log.temperature)
      .map(log => log.temperature);

    if (temperatures.length === 0) return 0;

    const maxTemp = Math.max(...temperatures);
    let score = 0;

    if (tempCondition.min !== undefined && maxTemp >= tempCondition.min) {
      score += 20;
    }

    if (tempCondition.max !== undefined && maxTemp <= tempCondition.max) {
      score += 20;
    }

    return score;
  }

  checkAssociatedSymptoms(associatedSymptoms, symptomLogs) {
    let matches = 0;

    for (const log of symptomLogs) {
      if (log.associatedSymptoms) {
        for (const associated of log.associatedSymptoms) {
          const found = associatedSymptoms.some(symptom =>
            associated.name.toLowerCase().includes(symptom.toLowerCase()) ||
            symptom.toLowerCase().includes(associated.name.toLowerCase())
          );
          if (found) matches++;
        }
      }
    }

    return Math.min(matches * 10, 20);
  }

  convertToHours(value, unit) {
    const conversions = {
      minutes: value / 60,
      hours: value,
      days: value * 24,
      weeks: value * 24 * 7,
      months: value * 24 * 30
    };
    return conversions[unit] || value;
  }

  generateReasoning(symptomLogs, matchedRules) {
    if (matchedRules.length === 0) {
      return 'No specific patterns detected. Consider monitoring symptoms and consulting healthcare provider if concerned.';
    }

    const topRule = matchedRules[0];
    const symptomNames = symptomLogs.map(log => log.name).join(', ');
    const maxSeverity = Math.max(...symptomLogs.map(log => log.severity));

    return `Based on your symptoms (${symptomNames}) with severity up to ${maxSeverity}/10, ${topRule.rule.suggestions.reasoning}`;
  }

  // Method to add new rules dynamically
  addRule(rule) {
    this.rules.push(rule);
  }

  // Method to get all rules (for testing/debugging)
  getAllRules() {
    return this.rules;
  }
}

module.exports = new RulesEngine();

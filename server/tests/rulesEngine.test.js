const rulesEngine = require('../src/utils/rulesEngine');

describe('Rules Engine', () => {
  // Sample symptom data for testing
  const sampleSymptoms = {
    mildCold: [
      {
        name: 'runny nose',
        severity: 3,
        duration: { value: 2, unit: 'days' },
        temperature: 99.5,
        associatedSymptoms: [
          { name: 'sneezing', severity: 2 }
        ]
      }
    ],
    severeChestPain: [
      {
        name: 'chest pain',
        severity: 9,
        duration: { value: 30, unit: 'minutes' },
        associatedSymptoms: [
          { name: 'shortness of breath', severity: 8 },
          { name: 'sweating', severity: 7 }
        ]
      }
    ],
    highFever: [
      {
        name: 'fever',
        severity: 7,
        duration: { value: 6, unit: 'hours' },
        temperature: 104,
        associatedSymptoms: [
          { name: 'headache', severity: 8 },
          { name: 'neck stiffness', severity: 6 }
        ]
      }
    ],
    persistentHeadache: [
      {
        name: 'headache',
        severity: 8,
        duration: { value: 12, unit: 'hours' }
      }
    ],
    mildSymptoms: [
      {
        name: 'fatigue',
        severity: 2,
        duration: { value: 1, unit: 'days' }
      }
    ]
  };

  beforeAll(async () => {
    // Ensure rules are loaded
    await rulesEngine.loadRules();
  });

  describe('Basic Functionality', () => {
    test('should load rules successfully', () => {
      const rules = rulesEngine.getAllRules();
      expect(rules).toBeDefined();
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
    });

    test('should return empty suggestions for no symptoms', () => {
      const result = rulesEngine.analyzeSymptoms([]);
      expect(result.suggestions).toEqual([]);
      expect(result.confidence).toBe(0);
    });

    test('should return suggestions object with required properties', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.mildCold);
      expect(result).toHaveProperty('suggestions');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('reasoning');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('Emergency Scenarios', () => {
    test('should detect emergency chest pain', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.severeChestPain);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      const emergencySuggestion = result.suggestions.find(s => s.urgency === 'emergency');
      expect(emergencySuggestion).toBeDefined();
      expect(emergencySuggestion.action).toContain('911');
      expect(result.confidence).toBeGreaterThan(80);
    });

    test('should detect urgent high fever with neurological symptoms', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.highFever);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      const urgentSuggestion = result.suggestions.find(s => 
        s.urgency === 'urgent' || s.urgency === 'emergency'
      );
      expect(urgentSuggestion).toBeDefined();
      expect(result.confidence).toBeGreaterThan(70);
    });
  });

  describe('Moderate Scenarios', () => {
    test('should detect moderate persistent headache', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.persistentHeadache);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      const moderateSuggestion = result.suggestions.find(s => 
        s.urgency === 'moderate' || s.urgency === 'urgent'
      );
      expect(moderateSuggestion).toBeDefined();
      expect(result.confidence).toBeGreaterThan(50);
    });
  });

  describe('Mild Scenarios', () => {
    test('should detect mild cold symptoms', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.mildCold);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      const mildSuggestion = result.suggestions.find(s => 
        s.urgency === 'mild' || s.urgency === 'routine'
      );
      expect(mildSuggestion).toBeDefined();
      expect(result.confidence).toBeGreaterThan(40);
    });

    test('should provide routine care for very mild symptoms', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.mildSymptoms);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      const routineSuggestion = result.suggestions.find(s => s.urgency === 'routine');
      expect(routineSuggestion).toBeDefined();
    });
  });

  describe('Rule Evaluation Functions', () => {
    test('should check symptom matches correctly', () => {
      const ruleSymptoms = ['chest pain', 'heart pain'];
      const symptoms = [{ name: 'chest pain', severity: 8 }];
      
      const matches = rulesEngine.checkSymptomMatches(ruleSymptoms, symptoms);
      expect(matches).toBeGreaterThan(0);
    });

    test('should check severity conditions correctly', () => {
      const severityCondition = { min: 7 };
      const symptoms = [{ severity: 8 }];
      
      const score = rulesEngine.checkSeverityConditions(severityCondition, symptoms);
      expect(score).toBeGreaterThan(0);
    });

    test('should check duration conditions correctly', () => {
      const durationCondition = { min: 6, unit: 'hours' };
      const symptoms = [{ duration: { value: 8, unit: 'hours' } }];
      
      const score = rulesEngine.checkDurationConditions(durationCondition, symptoms);
      expect(score).toBeGreaterThan(0);
    });

    test('should check temperature conditions correctly', () => {
      const tempCondition = { min: 103 };
      const symptoms = [{ temperature: 104 }];
      
      const score = rulesEngine.checkTemperatureConditions(tempCondition, symptoms);
      expect(score).toBeGreaterThan(0);
    });

    test('should convert duration units correctly', () => {
      expect(rulesEngine.convertToHours(2, 'hours')).toBe(2);
      expect(rulesEngine.convertToHours(1, 'days')).toBe(24);
      expect(rulesEngine.convertToHours(1, 'weeks')).toBe(168);
      expect(rulesEngine.convertToHours(60, 'minutes')).toBe(1);
    });
  });

  describe('Confidence Scoring', () => {
    test('should assign higher confidence to better matches', () => {
      const result1 = rulesEngine.analyzeSymptoms(sampleSymptoms.severeChestPain);
      const result2 = rulesEngine.analyzeSymptoms(sampleSymptoms.mildSymptoms);
      
      expect(result1.confidence).toBeGreaterThan(result2.confidence);
    });

    test('should limit confidence to maximum of 100', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.severeChestPain);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('Reasoning Generation', () => {
    test('should generate meaningful reasoning', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.severeChestPain);
      
      expect(result.reasoning).toBeDefined();
      expect(typeof result.reasoning).toBe('string');
      expect(result.reasoning.length).toBeGreaterThan(10);
      expect(result.reasoning).toContain('chest pain');
    });

    test('should include symptom names in reasoning', () => {
      const result = rulesEngine.analyzeSymptoms(sampleSymptoms.persistentHeadache);
      
      expect(result.reasoning).toContain('headache');
    });
  });

  describe('Multiple Symptoms', () => {
    test('should handle multiple symptoms correctly', () => {
      const multipleSymptoms = [
        ...sampleSymptoms.mildCold,
        {
          name: 'sore throat',
          severity: 4,
          duration: { value: 3, unit: 'days' }
        }
      ];
      
      const result = rulesEngine.analyzeSymptoms(multipleSymptoms);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    test('should prioritize more severe symptoms', () => {
      const mixedSymptoms = [
        ...sampleSymptoms.mildSymptoms,
        ...sampleSymptoms.severeChestPain
      ];
      
      const result = rulesEngine.analyzeSymptoms(mixedSymptoms);
      const topSuggestion = result.suggestions[0];
      expect(topSuggestion.urgency).toBe('emergency');
    });
  });

  describe('Edge Cases', () => {
    test('should handle symptoms with missing optional fields', () => {
      const minimalSymptom = [{
        name: 'headache',
        severity: 5,
        duration: { value: 2, unit: 'hours' }
      }];
      
      const result = rulesEngine.analyzeSymptoms(minimalSymptom);
      expect(result.suggestions).toBeDefined();
    });

    test('should handle invalid duration units gracefully', () => {
      const invalidDuration = [{
        name: 'pain',
        severity: 5,
        duration: { value: 2, unit: 'invalid' }
      }];
      
      expect(() => {
        rulesEngine.analyzeSymptoms(invalidDuration);
      }).not.toThrow();
    });

    test('should handle zero severity', () => {
      const zeroSeverity = [{
        name: 'discomfort',
        severity: 0,
        duration: { value: 1, unit: 'hours' }
      }];
      
      const result = rulesEngine.analyzeSymptoms(zeroSeverity);
      expect(result.suggestions).toBeDefined();
    });
  });

  describe('Rule Structure Validation', () => {
    test('should have properly structured rules', () => {
      const rules = rulesEngine.getAllRules();
      
      rules.forEach(rule => {
        expect(rule).toHaveProperty('id');
        expect(rule).toHaveProperty('name');
        expect(rule).toHaveProperty('conditions');
        expect(rule).toHaveProperty('suggestions');
        expect(rule.suggestions).toHaveProperty('urgency');
        expect(rule.suggestions).toHaveProperty('action');
        expect(rule.suggestions).toHaveProperty('reasoning');
        expect(rule.suggestions).toHaveProperty('confidence');
        expect(rule.suggestions).toHaveProperty('nextSteps');
        expect(Array.isArray(rule.suggestions.nextSteps)).toBe(true);
      });
    });

    test('should have valid urgency levels', () => {
      const rules = rulesEngine.getAllRules();
      const validUrgencies = ['emergency', 'urgent', 'moderate', 'mild', 'routine'];
      
      rules.forEach(rule => {
        expect(validUrgencies).toContain(rule.suggestions.urgency);
      });
    });

    test('should have reasonable confidence values', () => {
      const rules = rulesEngine.getAllRules();
      
      rules.forEach(rule => {
        expect(rule.suggestions.confidence).toBeGreaterThanOrEqual(0);
        expect(rule.suggestions.confidence).toBeLessThanOrEqual(100);
      });
    });
  });
});

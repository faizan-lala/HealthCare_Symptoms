const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Symptom name is required'],
    trim: true,
    maxlength: [100, 'Symptom name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  severity: {
    type: Number,
    required: [true, 'Severity level is required'],
    min: [1, 'Severity must be at least 1'],
    max: [10, 'Severity cannot exceed 10']
  },
  duration: {
    value: {
      type: Number,
      required: [true, 'Duration value is required'],
      min: [0, 'Duration cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Duration unit is required'],
      enum: ['minutes', 'hours', 'days', 'weeks', 'months']
    }
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  triggers: [{
    type: String,
    maxlength: [50, 'Trigger cannot exceed 50 characters']
  }],
  associatedSymptoms: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Associated symptom name cannot exceed 100 characters']
    },
    severity: {
      type: Number,
      min: 1,
      max: 10
    }
  }],
  temperature: {
    type: Number,
    min: [95, 'Temperature seems too low'],
    max: [115, 'Temperature seems too high']
  },
  bloodPressure: {
    systolic: {
      type: Number,
      min: [50, 'Systolic pressure seems too low'],
      max: [300, 'Systolic pressure seems too high']
    },
    diastolic: {
      type: Number,
      min: [30, 'Diastolic pressure seems too low'],
      max: [200, 'Diastolic pressure seems too high']
    }
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  status: {
    type: String,
    enum: ['active', 'improving', 'resolved', 'worsening'],
    default: 'active'
  },
  followUpDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration in hours
symptomSchema.virtual('durationInHours').get(function() {
  const { value, unit } = this.duration;
  const conversions = {
    minutes: value / 60,
    hours: value,
    days: value * 24,
    weeks: value * 24 * 7,
    months: value * 24 * 30
  };
  return conversions[unit] || value;
});

// Virtual for severity level description
symptomSchema.virtual('severityDescription').get(function() {
  const descriptions = {
    1: 'Very Mild',
    2: 'Mild',
    3: 'Mild-Moderate',
    4: 'Moderate',
    5: 'Moderate',
    6: 'Moderate-Severe',
    7: 'Severe',
    8: 'Very Severe',
    9: 'Extremely Severe',
    10: 'Unbearable'
  };
  return descriptions[this.severity] || 'Unknown';
});

// Index for efficient queries
symptomSchema.index({ user: 1, createdAt: -1 });
symptomSchema.index({ user: 1, name: 1 });
symptomSchema.index({ user: 1, severity: -1 });
symptomSchema.index({ user: 1, status: 1 });

// Static method to get user's symptom statistics
symptomSchema.statics.getUserStats = async function(userId) {
  return await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalSymptoms: { $sum: 1 },
        averageSeverity: { $avg: '$severity' },
        mostCommonSymptom: { $first: '$name' },
        activeSymptoms: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        resolvedSymptoms: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Symptom', symptomSchema);

///////////////////////////////////////////////////////////////////////////////
// Namespace
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar = Ember.Namespace.create()


///////////////////////////////////////////////////////////////////////////////
// Controller
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.CalendarController = Ember.ArrayController.extend({
    startOfWeek: 0
  , headingDateFormat: 'ddd MMM D'
  , headingTimeFormat: 'h a'
  , headingTimeRangeStart: 0
  , headingTimeRangeEnd: 24
  , eventTimeFormat: 'h:mm a'
  , eventTimeSeparator: ' - '
  
  , week: null
  , days: function () {
      if (!this.get('week')) return []
      
      var curr = this.get('week').clone().subtract('days', 1)
        , days = []
        , i
      
      for (i = 0; i < 7; i++)
        days.push(curr.add('days', 1).clone())
      
      return days
    }.property('week')
    
  , init: function () {
      this.set('week', moment().subtract('days', (moment().day() + 7 - this.get('startOfWeek')) % 7))
      _super.init()
    }
})


///////////////////////////////////////////////////////////////////////////////
// Views
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.CalendarView = Ember.View.extend({
    classNames: ['ember-calendar']
})

Ember.Calendar.DayView = Ember.View.extend({
    classNames: ['ember-calendar-day']
})

Ember.Calendar.EventView = Ember.View.extend({
    classNames: ['ember-calendar-event']
  , attributeBindings: ['style']
  , style: function () {
      var start = moment(this.get('context.start'))
        , end = moment(this.get('context.end'))
        , rangeStart: start.clone().startOf('day').valueOf() + 1000 * 60 * 60 * this.get('parentView.headingTimeRangeStart')
        , rangeEnd: start.clone().startOf('day').valueOf() + 1000 * 60 * 60 * this.get('parentView.headingTimeRangeEnd')
      
      return 'top: ' + (start - rangeStart) / (rangeEnd - rangeStart) + '%; height: ' + (end - start) / (rangeEnd - rangeStart) + '%;'
    }
})
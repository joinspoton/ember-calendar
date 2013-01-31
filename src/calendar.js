///////////////////////////////////////////////////////////////////////////////
// Namespace
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar = Ember.Namespace.create()


///////////////////////////////////////////////////////////////////////////////
// Controller
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.CalendarController = Ember.ArrayController.extend({
    initialDate: 'today'
  , startOfWeek: 0
  , headingDateFormat: 'ddd MMM D'
  , headingTimeFormat: 'h a'
  , headingTimeRangeStart: 0
  , headingTimeRangeEnd: 24
  , eventTimeFormat: 'h:mm a'
  , eventTimeSeparator: ' - '
  , eventViewClass: 'Ember.Calendar.EventView'
  
  , week: null
  , days: function () {
      if (!this.get('week'))
        return []
      
      var curr = this.get('week').clone().subtract('days', 1)
        , days = []
        , i
      
      for (i = 0; i < 7; i++)
        days.push(curr.add('days', 1).clone())
      
      return days
    }.property('week')
  , times: function () {
      var times = []
        , i
      
      for (i = this.get('headingTimeRangeStart'); i <= this.get('headingTimeRangeEnd'); i++)
        times.push(1000 * 60 * 60 * i)
      
      return times
    }.property('headingTimeRangeStart', 'headingTimeRangeStart')
    
  , events: function () {
      if (!this.get('week'))
        return []
      
      var events = []
        , days = this.get('days')
      
      this.get('content').forEach(function (event) {
        var start = moment(event.start).clone()
          , end = moment(event.end).clone()
          , object
          , day
        
        if (end < days[0] || start > days[6])
          return
        
        while (end > start) {
          object = new Object()
          Object.keys(event).forEach(function (key) {
            if (key !== 'start' && key !== 'end')
              object[key] = event[key]
          })
          
          object.start = start.clone()
          object.end = start.clone().endOf('day')
          
          if (object.end > end)
            object.end = end.clone()
          
          day = object.start.clone().startOf('day').diff(this.get('week'), 'days')
          if (day >= 0 && day <= 6)
            events[day].push(object)
          
          start.add('days', 1).startOf('day')
        }
      })
      
      return events
    }.property('content', 'days')
    
  , loadPreviousWeek: function () {
      this.get('week').subtract('days', 7)
      this.notifyPropertyChange('week')
    }
  , loadNextWeek: function () {
      this.get('week').add('days', 7)
      this.notifyPropertyChange('week')
    }
  
  , init: function () {
      this.set('week', moment(this.get('initialDate')).subtract('days', (moment(this.get('initialDate')).day() + 7 - this.get('startOfWeek')) % 7))
      _super.init()
    }
})


///////////////////////////////////////////////////////////////////////////////
// Views
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.CalendarView = Ember.View.extend({
    classNames: ['ember-calendar']
})

Ember.Calendar.HeadingDayView = Ember.View.extend({
    classNames: ['ember-calendar-head-day']
  , dateString: function () {
      return this.get('context').format(this.get('parentView.controller.headingDateFormat'))
    }.property('context')
})

Ember.Calendar.HeadingTimeView = Ember.View.extend({
    classNames: ['ember-calendar-head-time']
  , timeString: function () {
      return this.get('context').format(this.get('parentView.controller.headingTimeFormat'))
    }.property('context')
})

Ember.Calendar.DayView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-day']
  , childViews: function () {
      var self = this
      return this.get('context').map(function (event) {
        return Ember.create(self.get('parentView.controller.eventViewClass'), { event: event })
      })
    }.property('context')
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
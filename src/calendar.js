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
  
  , headingDateViewClass: 'Ember.Calendar.HeadingDateView'
  , headingTimeViewClass: 'Ember.Calendar.HeadingTimeView'
  , dayViewClass: 'Ember.Calendar.DayView'
  , eventViewClass: 'Ember.Calendar.EventView'
  
  , week: null
  , dates: function () {
      if (!this.get('week'))
        return []
      
      var curr = this.get('week').clone().subtract('days', 1)
        , dates = []
        , i
      
      for (i = 0; i < 7; i++)
        dates.push(curr.add('days', 1).clone())
      
      return dates
    }.property('week')
  , times: function () {
      var times = []
        , i
      
      for (i = this.get('headingTimeRangeStart'); i <= this.get('headingTimeRangeEnd'); i++)
        times.push(1000 * 60 * 60 * i)
      
      return times
    }.property('headingTimeRangeStart', 'headingTimeRangeStart')
    
  , days: function () {
      if (!this.get('week'))
        return []
      
      var days = []
        , dates = this.get('dates')
      
      this.get('content').forEach(function (event) {
        var start = moment(event.start).clone()
          , end = moment(event.end).clone()
          , object
          , day
        
        if (end < dates[0] || start > dates[6])
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
            days[day].push(object)
          
          start.add('days', 1).startOf('day')
        }
      })
      
      return days
    }.property('content', 'dates')
    
  , loadPreviousWeek: function () {
      this.get('week').subtract('days', 7)
      this.notifyPropertyChange('week')
    }
  , loadNextWeek: function () {
      this.get('week').add('days', 7)
      this.notifyPropertyChange('week')
    }
  
  , init: function () {
      this._super()
      this.set('week', moment(this.get('initialDate')).subtract('days', (moment(this.get('initialDate')).day() + 7 - this.get('startOfWeek')) % 7))
    }
})


///////////////////////////////////////////////////////////////////////////////
// Views
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.CalendarView = Ember.View.extend({
    templateName: 'ember-calendar'
  , classNames: ['ember-calendar']
})

Ember.Calendar.HeadingDatesView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-head-dates']
  , updateChildViews: function () {
      var self = this
      
      // hacky way of updating DOM after removing childViews (http://stackoverflow.com/questions/14538736/how-to-clear-all-childviews-from-containerview)
      this.removeAllChildren()
      $('#' + this.get('elementId')).html('')
      
      this.get('childViews').pushObjects(this.get('dates').map(function (date) {
        return Ember.get(self.get('parentView.controller.headingDateViewClass')).create({ date: date })
      }))
    }.observes('dates')
  , init: function () {
      this._super()
      this.updateChildViews()
    }
})

Ember.Calendar.HeadingDateView = Ember.View.extend({
    templateName: 'ember-calendar-head-date'
  , classNames: ['ember-calendar-head-date']
  , dateString: function () {
      return this.get('date').format(this.get('parentView.parentView.controller.headingDateFormat'))
    }.property('date')
})

Ember.Calendar.HeadingTimesView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-head-times']
  , updateChildViews: function () {
      var self = this
      
      // hacky way of updating DOM after removing childViews (http://stackoverflow.com/questions/14538736/how-to-clear-all-childviews-from-containerview)
      this.removeAllChildren()
      $('#' + this.get('elementId')).html('')
      
      this.get('childViews').pushObjects(this.get('times').map(function (time) {
        return Ember.get(self.get('parentView.controller.headingTimeViewClass')).create({ time: time })
      }))
    }.observes('times')
  , init: function () {
      this._super()
      this.updateChildViews()
    }
})

Ember.Calendar.HeadingTimeView = Ember.View.extend({
    templateName: 'ember-calendar-head-time'
  , classNames: ['ember-calendar-head-time']
  , timeString: function () {
      return moment().startOf('day').add('milliseconds', this.get('time')).format(this.get('parentView.parentView.controller.headingTimeFormat'))
    }.property('time')
})

Ember.Calendar.DaysView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-days']
  , updateChildViews: function () {
      var self = this
      
      // hacky way of updating DOM after removing childViews (http://stackoverflow.com/questions/14538736/how-to-clear-all-childviews-from-containerview)
      this.removeAllChildren()
      $('#' + this.get('elementId')).html('')
      
      this.get('childViews').pushObjects(this.get('days').map(function (events) {
        return Ember.get(self.get('parentView.controller.dayViewClass')).create({ events: events })
      }))
    }.observes('days')
  , init: function () {
      this._super()
      this.updateChildViews()
    }
})

Ember.Calendar.DayView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-day']
  , updateChildViews: function () {
      var self = this
      
      // hacky way of updating DOM after removing childViews (http://stackoverflow.com/questions/14538736/how-to-clear-all-childviews-from-containerview)
      this.removeAllChildren()
      $('#' + this.get('elementId')).html('')
      
      this.get('childViews').pushObjects(this.get('events').map(function (event) {
        return Ember.get(self.get('parentView.parentView.controller.eventViewClass')).create({ event: event })
      }))
    }.observes('events')
  , init: function () {
      this._super()
      this.updateChildViews()
    }
})

Ember.Calendar.EventView = Ember.View.extend({
    classNames: ['ember-calendar-event']
  , attributeBindings: ['style']
  , style: function () {
      if (!this.get('event')) return ''
      
      var start = moment(this.get('event.start'))
        , end = moment(this.get('event.end'))
        , rangeStart = start.clone().startOf('day').valueOf() + 1000 * 60 * 60 * this.get('parentView.parentView.parentView.headingTimeRangeStart')
        , rangeEnd = start.clone().startOf('day').valueOf() + 1000 * 60 * 60 * this.get('parentView.parentView.parentView.headingTimeRangeEnd')
      
      return 'top: ' + (start - rangeStart) / (rangeEnd - rangeStart) + '%; height: ' + (end - start) / (rangeEnd - rangeStart) + '%;'
    }.property('event', 'event.start', 'event.end')
  , nameString: function () {
      if (!this.get('event')) return ''
      return this.get('event.name')
    }.property('event', 'event.name')
  , timeString: function () {
      if (!this.get('event')) return ''
      return this.get('event.start').format(this.get('parentView.parentView.parentView.controller.eventTimeFormat')) + this.get('parentView.parentView.parentView.controller.eventTimeSeparator') + this.get('event.end').format(this.get('parentView.parentView.parentView.controller.eventTimeFormat'))
    }.property('event', 'event.start', 'event.end')
  , locationString: function () {
      if (!this.get('event')) return ''
      return this.get('event.location.name') || this.get('event.location.address')
    }.property('event', 'event.location')
})
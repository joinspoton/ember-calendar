1.0.0 / 2013-10-11
==================

* Added daily view and view switching.
* Added convertible example demonstrating view switching.
* Renamed `Ember.Calendar.CalendarView` to `Ember.Calendar.ContainerView`; added new `Ember.Calendar.CalendarView` that wraps (optional) view switching buttons and calendar body.
* Renamed weekly view template: `ember-calendar` -> `ember-calendar-week`.
* Renamed keys related to weekly view in Ember.Calendar.CalendarController: `dayViewClass` -> `weekDayViewClass`, `headingDateViewClass` -> `weekHeadingDateViewClass`, `dates` -> `weekDates`, `days` -> `weekDays`.
(function(window, document, undefined) {
  'use strict';

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December'];

  function Calendar(container, country, year, month) {
    this.year = year;
    this.month = month;
    this.days = [];
    this.country = country;
    this.container = container;
  }

  Calendar.prototype.addDay = function(day) {
    this.days.push(day);
  }

  Calendar.prototype.draw = function() {
    getHolidays(this.country, this.year, this.month+1)
      .then(response => response.holidays)
      .then((data) => {
      var i, span, text, index, holiday;
      // holidays
      this.holidays = data.map(item => {
        return {
          day: parseInt(item.date.split('-')[2]),
          name: item.name
        };
      });

      var containerMonth = document.createElement('div');
      containerMonth.className = 'calendar-month';
      // header month
      var headerMonth = document.createElement('header');
      var headerMonthTitle = document.createElement('h5');
      var headerText = document.createTextNode(months[this.month] + ' ' + this.year);
      headerMonthTitle.appendChild(headerText);
      headerMonth.appendChild(headerMonthTitle);
      // header month days week
      var daysWeek = document.createElement('div');
      daysWeek.className = 'week-header';
      var daysWeekString = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      for (i = 0; i < daysWeekString.length; i++) {
        span = document.createElement('span');
        span.appendChild(document.createTextNode(daysWeekString[i]));
        daysWeek.appendChild(span);
      }
      headerMonth.appendChild(daysWeek);

      containerMonth.appendChild(headerMonth);
      this.container.appendChild(containerMonth);

      // draw days
      var firstDay = new Date(this.year, this.month, 1);
      var firstWeekDay = firstDay.getDay();
      var lastDay = this.days[this.days.length-1];

      var weekMonth = document.createElement('div');
      weekMonth.className = 'week-month';

      for (i = 1; i <= 35; i++) { //35 = 7*5
        span = document.createElement('span');
        // days added of the month
        index = this.days.indexOf(i-firstWeekDay);
        if (index !== -1) {
          span.className = 'week-day';
          text = document.createTextNode(this.days[index]);
          span.appendChild(text);
        }

        // days weekend: Sunday
        if (i % 7 === 1) {
          span.className = 'weekend-day';
        }

        // holiday
        holiday = this.holidays.find(item => item.day === i-firstWeekDay);
        if (holiday) {
          if (span.className === 'week-day' || span.className === 'weekend-day') {
            span.className = 'week-holiday';
            span.setAttribute('title', holiday.name);
          }
        }

        weekMonth.appendChild(span);
        if ( i % 7 === 0) {
          // days weekend: Saturday
          span.className = 'weekend-day';
          containerMonth.appendChild(weekMonth);
          weekMonth = document.createElement('div');
          weekMonth.className = 'week-month';
        }
      }

    })
    .catch((err) => {
      console.error(err.message);
    });
  }

  window.Calendar = Calendar;

})(window, document);

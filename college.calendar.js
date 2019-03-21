var today = moment();
var mindate = false;
var maxdate = false;
var minimonth = false;

function Calendar(selector,events) {
  this.selector = selector;
  this.el = document.querySelector(selector);
  this.events = events;
  this.current = moment().date(1);
  this.draw();
}
Calendar.prototype.draw = function() {
  this.drawHeader();
  this.drawMonth();
};
Calendar.prototype.drawHeader = function() {
  var self = this;
  if(!self.header) {
    //Create the header elements
    self.header = document.createElement("div");
    self.header.className = "header";
    self.title = document.createElement("h2");
    var right = document.createElement("div");
    right.className = "right";
    right.addEventListener('click', function() { self.nextMonth(); });
    var left = document.createElement("div");
    left.className = "left";
    left.addEventListener('click', function() { self.prevMonth(); });
    //Append the Elements
    self.header.appendChild(self.title); 
    self.header.appendChild(right);
    self.header.appendChild(left);
    self.el.appendChild(self.header);
  }
  self.title.innerHTML = self.current.format("MMMM YYYY");
};
Calendar.prototype.drawMonth = function() {
  var self = this;
  if(self.month) {
    this.oldMonth = this.month;
    this.oldMonth.className = "month out " + (self.next ? "next" : "prev");
    this.oldMonth.addEventListener("webkitAnimationEnd", function() {
      self.oldMonth.parentNode.removeChild(self.oldMonth);
      self.month = document.createElement("div");
      self.month.className = "month";
      self.backFill();
      self.currentMonth();
      self.fowardFill();
      self.el.appendChild(self.month);
      window.setTimeout(function() {
        self.month.className = "month in " + (self.next ? "next" : "prev");
      }, 16);
    });
  }
  else {
    self.month = document.createElement("div");
    self.month.className = "month";
    self.el.appendChild(self.month);
    self.backFill();
    self.currentMonth();
    self.fowardFill();
    self.month.className = "month new";
  }
};
Calendar.prototype.backFill = function() {
  var clone = this.current.clone();
  var dayOfWeek = clone.day();
  if(!dayOfWeek) { return; }
  clone.subtract(dayOfWeek+1,"days");
  for(var i = dayOfWeek; i > 0 ; i--) {
    this.drawDay(clone.add(1,"days"));
  }
};
Calendar.prototype.fowardFill = function() {
  var clone = this.current.clone().add(1,"months").subtract(1,"days");
  var dayOfWeek = clone.day();
  if(dayOfWeek === 6) { return; }
  for(var i = dayOfWeek; i < 6 ; i++) {
    this.drawDay(clone.add(1,"days"));
  }
};
Calendar.prototype.currentMonth = function() {
  var clone = this.current.clone();
  while(clone.month() === this.current.month()) {
    this.drawDay(clone);
    clone.add(1,"days");
  }
};
Calendar.prototype.getWeek = function(day) {
  if(!this.week || day.day() === 0) {
    this.week = document.createElement("div");
    this.week.className = "week";
    this.month.appendChild(this.week);
  }
};
Calendar.prototype.drawDay = function(day) {
  var self = this;
  self.getWeek(day);
  //Outer Day
  var outer = document.createElement("div");
  outer.className = self.getDayClass(day);
  if(day.month() === self.current.month()) {
    outer.addEventListener('click', function(e) {
      if (e.target.tagName != "A") {
        self.openDay(this);
      }
    });
  }
  //Day Name
  var name = document.createElement("div");
  name.className = "day-name";
  name.innerText = name.textContent = day.format("ddd");
  //Day Number
  var number = document.createElement("div");
  number.className = "day-number";
  number.innerText = number.textContent = day.format("D");
  //Events
  var events = document.createElement("div");
  events.className = "day-events";
  self.drawEvents(day, events);

  outer.appendChild(name);
  outer.appendChild(number);
  outer.appendChild(events);
  self.week.appendChild(outer);
};
Calendar.prototype.drawEvents = function(day, element) {
  if(day.month() === this.current.month()) {
    var todaysEvents = this.events.reduce(function(memo, ev) {
      if(ev.date.isSame(day,"day")) {
        memo.push(ev);
      }
      return memo;
    }, []);
    todaysEvents.forEach(function(ev) {
      var event = document.createElement("div");
      event.className = (ev.allday === true) ? "item allday" : "item"; 
      var time = document.createElement("span");
      time.className = "time";
      time.innerText = time.textContent = ev.time;
      var title = document.createElement("span");
      title.className = "title";
      title.innerHTML = ev.title;
      event.appendChild(time);
      event.appendChild(title);
      element.appendChild(event);
    });
  }
};
Calendar.prototype.getDayClass = function(day) {
  classes = ["day"];
  if(day.month() !== this.current.month()) {
    classes.push("other");
  }
  else if (today.isSame(day,"day")) {
    classes.push("today");
  }
  return classes.join(' ');
};
Calendar.prototype.openDay = function(el) {
  var details, arrow;
  var dayNumber = +el.querySelectorAll(".day-number")[0].innerText || +el.querySelectorAll(".day-number")[0].textContent;
  var day = this.current.clone().date(dayNumber);
  var weekday = day.format("d");
  if (el.classList.contains("open")) {
    // if we've clicked on the open day, close it
    el.classList.remove("open");
    var currentOpened = document.querySelector(".details");
    if(currentOpened) {
      currentOpened.addEventListener("webkitAnimationEnd", function() {
        currentOpened.parentNode.removeChild(currentOpened);
      });
      currentOpened.addEventListener("oanimationend", function() {
        currentOpened.parentNode.removeChild(currentOpened);
      });
      currentOpened.addEventListener("msAnimationEnd", function() {
        currentOpened.parentNode.removeChild(currentOpened);
      });
      currentOpened.addEventListener("animationend", function() {
        currentOpened.parentNode.removeChild(currentOpened);
      });
      currentOpened.classList.remove("in");
      currentOpened.classList.add("out");
    }
  }
  else {
    var currentOpenedDay = document.querySelector(".day.open");
    if (currentOpenedDay !== null) { currentOpenedDay.classList.remove("open"); }
    el.classList.add("open");
    var currentOpened = document.querySelector(".details");
    //Check to see if there is an open detais box on the current row
    if(currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector(".arrow");
    }
    else {
      //Close the open events on differnt week row
      //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
      if(currentOpened) {
        currentOpened.addEventListener("webkitAnimationEnd", function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener("oanimationend", function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener("msAnimationEnd", function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener("animationend", function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.classList.remove("in");
        currentOpened.classList.add("out");
      }
      //Create the Details Container
      details = document.createElement("div");
      details.className = "details in";
      //Create the arrow
      var arrow = document.createElement("div");
      arrow.className = "arrow";
      //Create the event wrapper
      details.appendChild(arrow);
      el.parentNode.appendChild(details);
    }
    var todaysEvents = this.events.reduce(function(memo, ev) {
      if(ev.date.isSame(day, "day")) {
        memo.push(ev);
      }
      return memo;
    }, []);
    this.renderEvents(todaysEvents,details);
    details.className = "details in details-" + weekday;
    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + (el.offsetWidth / 2) + "px";
  }
};
Calendar.prototype.renderEvents = function(events, ele) {
  //Remove any events in the current details element
  var currentWrapper = ele.querySelector(".events");
  var wrapper = document.createElement("div");
  wrapper.className = "events in" + (currentWrapper ? " new" : "");
  
  events.forEach(function(ev) {
    var div = document.createElement("div");
    div.className = "event";
    div.innerHTML = ev.html;
    wrapper.appendChild(div);
  });
  if(!events.length) {
    var div = document.createElement("div");
    div.className = "event empty";
    var span = document.createElement("span");
    span.innerText = span.textContent = "No Events";
    div.appendChild(span);
    wrapper.appendChild(div);
  }
  if(currentWrapper) {
    currentWrapper.className = 'events out';
    currentWrapper.addEventListener('webkitAnimationEnd', function() {
      currentWrapper.parentNode.removeChild(currentWrapper);
      ele.appendChild(wrapper);
    });
    currentWrapper.addEventListener('oanimationend', function() {
      currentWrapper.parentNode.removeChild(currentWrapper);
      ele.appendChild(wrapper);
    });
    currentWrapper.addEventListener('msAnimationEnd', function() {
      currentWrapper.parentNode.removeChild(currentWrapper);
      ele.appendChild(wrapper);
    });
    currentWrapper.addEventListener('animationend', function() {
      currentWrapper.parentNode.removeChild(currentWrapper);
      ele.appendChild(wrapper);
    });
  }
  else {
    ele.appendChild(wrapper);
  }
};
Calendar.prototype.nextMonth = function() {
  if (this.current.isBefore(maxdate,"month")) {
    this.current.add(1,"months");
    this.next = true;
    this.draw();
  }
};
Calendar.prototype.prevMonth = function() {
  if (this.current.isAfter(mindate,"month")) { 
    this.current.subtract(1,"months");
    this.next = false;
    this.draw();
  }
};

(function($) {
  $(function() {
    
    // label all day events
    var alldaytext = "(All day)";
    $(".view-calevents .time .date-display-single").each(function(){
      if ($(this).text() == alldaytext) {
        $(this).parent().addClass("allday").parent().addClass("allday");
      }
    });
    
    // set state
    $(".view-calevents").addClass("calevents-js-processed");
    
    // create container for mini-month
    $(".view-calevents").prepend("<div id=\"calevents-minimonth\"></div>");
    
    // collect event data as array of objects
    var eventdata = [];
    var events = $(".calevent");
    var x;
    for (x=0;x<events.length;x++) {
      var date = events.eq(x).find(".time").eq(0).attr("data-date-start");
      var title = events.eq(x).find("h4").eq(0).html();
      var time = (events.eq(x).find(".date-display-start").length > 0) ? events.eq(x).find(".date-display-start").eq(0).text() : events.eq(x).find(".date-display-single").eq(0).text();
      var html = events.eq(x).html();
      var allday = (events.eq(x).hasClass("allday")) ? true : false;
      eventdata[x] = {};
      eventdata[x].date = moment(date);
      eventdata[x].title = title;
      eventdata[x].time = time;
      eventdata[x].html = html;
      eventdata[x].allday = allday;
      
      if (x === 0) { // first event date; dates are chronological, so this should be the earliest date
        mindate = date;
      }
      if (x == (events.length - 1)) { // last event date; dates are chronological, so this should be the latest date
        maxdate = date;
      }
    }
    
    // create minimonth and toggle
    if (eventdata.length) {
      // minimonth
      minimonth = new Calendar("#calevents-minimonth",eventdata);
      // toggle
      $(".view-calevents").addClass("view-style-cal").prepend("<div class=\"view-style-toggle\"><div class=\"view-style-list\">List</div><div class=\"view-style-cal on\">Calendar</div></div>");
      $(".view-calevents .view-style-toggle .view-style-list").click(function(){
        if (!$(this).hasClass("on")) {
          $(".view-calevents").addClass("view-style-list").removeClass("view-style-cal").find(".view-style-toggle .view-style-cal").removeClass("on");
          $(this).addClass("on");
        }
      });
      $(".view-calevents .view-style-toggle .view-style-cal").click(function(){
        if (!$(this).hasClass("on")) {
          $(".view-calevents").addClass("view-style-cal").removeClass("view-style-list").find(".view-style-toggle .view-style-list").removeClass("on");
          $(this).addClass("on");
        }
      });
    }                  
  });
})(jQuery);

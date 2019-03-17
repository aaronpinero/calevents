var today = moment();

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
    // right.addEventListener('click', function() { self.nextMonth(); });
    var left = document.createElement("div");
    left.className = "left";
    // left.addEventListener('click', function() { self.prevMonth(); });
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
      // self.backFill();
      // self.currentMonth();
      // self.fowardFill();
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
    //this.backFill();
    self.currentMonth();
    //this.fowardFill();
    self.month.className = "month new";
  }
};
Calendar.prototype.currentMonth = function() {
  var clone = this.current.clone();
  while(clone.month() === this.current.month()) {
    this.drawDay(clone);
    clone.add("days", 1);
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
  //outer.addEventListener('click', function() {
  //  self.openDay(this);
  //});
  //Day Name
  var name = document.createElement("div");
  name.className = "day-name";
  name.innerText = name.textContent = day.format("ddd");
  //Day Number
  var number = document.createElement("div");
  number.className = "day-number";
  number.innerText = number.textContent = day.format("D");
  //Events
  //var events = document.createElement("div");
  //events.className = "day-events";
  //this.drawEvents(day, events);

  outer.appendChild(name);
  outer.appendChild(number);
  //outer.appendChild(events);
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
      var evSpan = document.createElement("span");
      element.appendChild(evSpan);
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

(function($) {
  $(function() {
    
    // label all day events
    var alldaytext = "(All day)";
    $(".view-calevents .time .date-display-single").each(function(){
      if ($(this).text() == alldaytext) {
        $(this).parent().parent().addClass("allday");
      }
    });
    
    // set state
    $(".view-calevents").addClass("js-processed");
    
    // create container for mini-month
    $(".view-calevents").before("<div id=\"calevents-minimonth\"></div>");
    
    // collect event data as array of objects
    var eventdata = [];
    var events = $(".calevent");
    var x;
    for (x=0;x<events.length;x++) {
      var date = events.eq(x).find(".time").eq(0).attr("data-date-start"); // console.log('date: '+date);
      var html = events.eq(x).html(); // console.log('html: '+html)
      eventdata[x] = {};
      eventdata[x].date = date;
      eventdata[x].html = html;
    }
    
    // create minimonth
    var minimonth = new Calendar('#calevents-minimonth',eventdata); console.log(minimonth);
                        
  });
})(jQuery);

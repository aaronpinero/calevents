function Calendar(selector,events) {
  this.selector = selector;
  this.el = document.querySelector(selector);
  this.events = events;
  this.current = moment().date(1);
  this.draw();
}
Calendar.prototype.draw = function() {
  this.drawHeader();
};
Calendar.prototype.drawHeader = function() {
  var self = this;
  if(!self.header) {
    //Create the header elements
    self.header = document.createElement('div');
    self.header.className = 'header';
    self.title = document.createElement('h2');
    var right = document.createElement('div');
    right.className = 'right';
    // right.addEventListener('click', function() { self.nextMonth(); });
    var left = document.createElement('div');
    left.className = 'left';
    // left.addEventListener('click', function() { self.prevMonth(); });
  
    //Append the Elements
    self.header.appendChild(self.title); 
    self.header.appendChild(right);
    self.header.appendChild(left);
    self.el.appendChild(self.header);
  }
  self.title.innerHTML = self.current.format('MMMM YYYY');
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
    var today = moment();
    var minimonth = new Calendar('#calevents-minimonth',eventdata); console.log(minimonth);
                        
  });
})(jQuery);

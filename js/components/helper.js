var Helper = {
	getMonth: function(number) {
		monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return monthString[number-1];
	},

	showPopup: function(selector) {
		$(selector).popup('open');
        setTimeout(function() {
            $(selector+':visible').popup('close');
        }, 4000);
	}
};
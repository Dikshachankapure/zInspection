sap.ui.define(function () {
	"use strict";

	var formatter = {

		status: function (sStatus) {

			if (sStatus === "Overdue") {
				return "Error";
			} else if (sStatus === "Planned") {
				return "None";
			} else {
				return "Success";
			}
		},

		progressStatus: function (sProgressStatus) {
			if (sProgressStatus > 0) {
				return "Warning";
			} else if (sProgressStatus === 100) {
				return "Success";
			} else {
				return "None";
			}
		},

		timeHours: function (t) {
			var v = Math.round((t / 60) / 60);
			return (v < 10) ? '0' + v : v;
		},

		timemins: function (t) {
			var v = Math.round(t / 60) % 60;
			return (v < 10) ? '0' + v : v;
		},

		timesecs: function (t) {
			var v = t % 60;
			return (v < 10) ? '0' + v : v;
		}
	};

	return formatter;

});
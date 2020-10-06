/*global QUnit*/

sap.ui.define([
	"poc/zinspection/controller/MyInspections.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MyInspections Controller");

	QUnit.test("I should test the MyInspections controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
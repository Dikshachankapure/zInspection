sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"poc/zinspection/model/formatter",
	"sap/ui/model/Filter"
], function (Controller, formatter, Filter) {
	"use strict";

	return Controller.extend("poc.zinspection.controller.MyInspections", {
		formatter: formatter,
		onInit: function () {
		
			var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
			this.getView().setModel(userModel, "userapi");

			var oModel = this.getOwnerComponent().getModel("InspectionModel");
			var oListAssigned = this.getView().byId("AssignedInspections");
			oListAssigned.setModel(oModel);

			/*	debugger;
				for (var i = 0; i < oModel.getData().InspectionsSet.length; i++) {
					var dueDate = oModel.getData().InspectionsSet[i].DueDate;
					var strDate = dueDate.split("/");
					var dateOne = new Date(strDate[2], strDate[1], strDate[0]); //Year, Month, Date    
					var currDate = new Date();
					var dateTwo = new Date(currDate.getFullYear(),currDate.getMonth(),currDate.getDate());
					if (dateOne > dateTwo) {
						//alert("Planned");
					} else {
						//alert("Overdue");
					}
				}*/

			if (oModel.getData().InspectionsSet.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "Assigned");
				var allFilter = new sap.ui.model.Filter([oFilter1], true);

				var obinding = oListAssigned.getBinding("items");
				obinding.filter(allFilter);
			}

			var oTab1 = this.getView().byId("tab1");
			oTab1.setCount(oListAssigned.getItems().length);

			var oListComplete = this.getView().byId("CompleteInspections");
			oListComplete.setModel(oModel);

			if (oModel.getData().InspectionsSet.length > 0) {
				oFilter1 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "Complete");
				allFilter = new sap.ui.model.Filter([oFilter1], true);

				obinding = oListComplete.getBinding("items");
				obinding.filter(allFilter);
			}

			var oTab2 = this.getView().byId("tab2");
			oTab2.setCount(oListComplete.getItems().length);
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onListItemPress: function (oEvent) {
			var Id = oEvent.getSource().getAttributes()[2].getText();
			this.getRouter().navTo("ExecuteInspection", {
				Id: Id
			});

		}

	});
});
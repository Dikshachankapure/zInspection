sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"poc/zinspection/model/formatter",
	"sap/m/UploadCollectionParameter",
	"sap/m/MessageToast"
], function (Controller, History, Filter, FilterOperator, JSONModel, formatter, UploadCollectionParameter, MessageToast) {
	"use strict";

	return Controller.extend("poc.zinspection.controller.ExecuteInspection", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf poc.zinspection.view.ExecuteInspection
		 */
		formatter: formatter,
		getPage: function () {
			return this.byId("dynamicPageId");
		},

		onInit: function () {

			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getOwnerComponent().getRouter().getRoute("ExecuteInspection").attachPatternMatched(this._onRouteMatched, this);
			this.getPage().setShowFooter(!this.getPage().getShowFooter());

		},

		//End comments here

		_onRouteMatched: function (oEvent) {
			this.Id = oEvent.getParameter("arguments").Id;
			var that = this;
			that.ontblSsectionsLoad(this.Id);
			var lblDuration = this.getView().byId("lblDuration");
			var btnStartInspection = this.getView().byId("btnStartInspection");
			//lblDuration.setText("");
			lblDuration.setVisible(false);
			btnStartInspection.setVisible(true);
			var indicator = this.getView().byId("indinspectionprogress");
			indicator.setPercentValue(0);
			indicator.setDisplayValue("0%");
			var tblLocations = this.getView().byId("tblLocations");
			var oModel1 = new sap.ui.model.json.JSONModel();
			var data = [];
			oModel1.setData(data);
			tblLocations.setModel(oModel1, "LocationSet");
		},

		ontblSsectionsLoad: function (Id) {

			var oModel = this.getOwnerComponent().getModel("SectionModel");
			var otblSections = this.getView().byId("tblSections");

			var oNewModel = new sap.ui.model.json.JSONModel();

			if (oModel.getData().SectionsSet.length > 0) {
				var values = {
					results: []
				};

				for (var i = 0; i < oModel.getData().SectionsSet.length; i++) {
					if (Id === oModel.getData().SectionsSet[i].Id) {
						values.results.push({
							"Id": oModel.getData().SectionsSet[i].Id,
							"SectionId": oModel.getData().SectionsSet[i].SectionId,
							"SectionName": oModel.getData().SectionsSet[i].SectionName,
							"QuestionsSet": oModel.getData().SectionsSet[i].QuestionsSet
						});
					}
				}

				oNewModel.setData(values);
				otblSections.setModel(oNewModel);
				this.countQuestions = 0;
				for (var val = 0; val < values.results.length; val++) {
					this.countQuestions = this.countQuestions + values.results[val].QuestionsSet.length;
				}

				for (var j = 0; j < otblSections.getItems().length; j++) {
					var aItems = otblSections.getItems()[j].getCells()[0].getContent()[2].getItems();
					for (var k = 0; k < aItems.length; k++) {
						aItems[k].getCells()[2].setEnabled(false);
						aItems[k].getCells()[3].setEnabled(false);
					}
				}

			}

		},

		onAction: function (oEvent) {

			this.Id = "";
			this.SectionId = "";
			this.QuestionId = "";
			var oButton = oEvent.getSource();
			this.byId("actionsheet").openBy(oButton);
			this.Id = oEvent.getSource().getParent().getParent().getParent().getContent()[0].getText();
			this.SectionId = oEvent.getSource().getParent().getParent().getParent().getContent()[1].getText();
			this.QuestionId = oEvent.getSource().getParent().getCells()[0].getText();
			this.btnComment = oEvent.getSource().getParent().getCells()[4];
			this.btnPhoto = oEvent.getSource().getParent().getCells()[5];
			this.btnAction = oEvent.getSource().getParent().getCells()[6];
		},

		onPressComment: function (oEvent) {

			var tblComments = this.getView().byId("tblComments");
			if (!this._CommentoDialog) {
				this._CommentoDialog = sap.ui.xmlfragment("poc.zinspection.fragments.Comment", this);
				this._CommentoDialog.setModel(this.getView().getModel());
			}
			this.getView().addDependent(this._CommentoDialog);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this._CommentoDialog.setModel(i18nModel, "i18n");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._CommentoDialog);
			this._CommentoDialog.open();

			for (var i = 0; i < tblComments.getItems().length; i++) {
				if (tblComments.getItems()[i].getCells()[0].getText() === this.Id && tblComments.getItems()[i].getCells()[1].getText() === this.SectionId &&
					tblComments.getItems()[i].getCells()[2].getText() === this.QuestionId) {
					var comment = tblComments.getItems()[i].getCells()[3].getText();
					var txtcomment = sap.ui.getCore().byId("txtcomment");
					txtcomment.setValue(comment);
					break;
				}
			}
		},

		onPressDetailComment: function (oEvent) {
			this.Id = oEvent.getSource().getParent().getParent().getParent().getContent()[0].getText();
			this.SectionId = oEvent.getSource().getParent().getParent().getParent().getContent()[1].getText();
			this.QuestionId = oEvent.getSource().getParent().getCells()[0].getText();

			var tblComments = this.getView().byId("tblComments");
			if (!this._CommentoDialog) {
				this._CommentoDialog = sap.ui.xmlfragment("poc.zinspection.fragments.Comment", this);
				this._CommentoDialog.setModel(this.getView().getModel());
			}
			this.getView().addDependent(this._CommentoDialog);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this._CommentoDialog.setModel(i18nModel, "i18n");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._CommentoDialog);
			this._CommentoDialog.open();

			for (var i = 0; i < tblComments.getItems().length; i++) {
				if (tblComments.getItems()[i].getCells()[0].getText() === this.Id && tblComments.getItems()[i].getCells()[1].getText() === this.SectionId &&
					tblComments.getItems()[i].getCells()[2].getText() === this.QuestionId) {
					var comment = tblComments.getItems()[i].getCells()[3].getText();
					var txtcomment = sap.ui.getCore().byId("txtcomment");
					txtcomment.setValue(comment);
					break;
				}
			}
		},

		OnCancelComment: function (oEvent) {

			this._CommentoDialog.close();
			if (this._CommentoDialog) {
				this._CommentoDialog.destroy();
				this._CommentoDialog = false; // make it falsy so that it can be created next time
			}
		},

		onPressPhotoVideo: function (oEvent) {

			var tblPhotoVideo = this.getView().byId("tblPhotoVideo");

			var oModelUpload = this.getOwnerComponent().getModel("UploadCollectionModel");
			this.getView().setModel(oModelUpload);

			if (!this._PVDialog) {
				this._PVDialog = sap.ui.xmlfragment("poc.zinspection.fragments.PhotoVideo", this);
				this._PVDialog.setModel(this.getView().getModel());
			}
			this.getView().addDependent(this._PVDialog);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this._PVDialog.setModel(i18nModel, "i18n");
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PVDialog);

			this._PVDialog.open();

			var txtTempQueID = this.getView().byId("txtQueId");
			var txtUpload = sap.ui.getCore().byId("UploadCollection");

			if (txtUpload.getItems().length > 0) {
				for (var i = 0; i < txtUpload.getItems().length; i++) {
					if (txtUpload.getModel().getData().items[i].Id === this.Id && txtUpload.getModel().getData().items[i].SectionId === this.SectionId) {
						var query1 = this.QuestionId;

						var oFilter1;
						var allFilter = "";
						if (query1.length > 0) {
							oFilter1 = new sap.ui.model.Filter("QuestionId", sap.ui.model.FilterOperator.EQ, query1);

							allFilter = new sap.ui.model.Filter([oFilter1], false);

						}
						var obinding = txtUpload.getBinding("items");
						obinding.filter(allFilter);
					}

				}

			}

			sap.ui.getCore().byId("attachmentTitle").setText(this.getAttachmentTitleText());

		},
		onPressDetailPhotoVideo: function (oEvent) {

			this.Id = oEvent.getSource().getParent().getParent().getParent().getContent()[0].getText();
			this.SectionId = oEvent.getSource().getParent().getParent().getParent().getContent()[1].getText();
			this.QuestionId = oEvent.getSource().getParent().getCells()[0].getText();

			var tblPhotoVideo = this.getView().byId("tblPhotoVideo");
			if (!this._PVDialog) {
				this._PVDialog = sap.ui.xmlfragment("poc.zinspection.fragments.PhotoVideo", this);
				this._PVDialog.setModel(this.getView().getModel());
			}
			this.getView().addDependent(this._PVDialog);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this._PVDialog.setModel(i18nModel, "i18n");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PVDialog);
			this._PVDialog.open();

		},

		onUploadComplete: function (oEvent) {

			var oUploadCollection = sap.ui.getCore().byId("UploadCollection");
			var oData = oUploadCollection.getModel().getData();
			//	var oData = sap.ui.getCore().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var oItem = {};
			var sUploadedFile = oEvent.getParameter("files")[0].fileName;
			// at the moment parameter fileName is not set in IE9
			if (!sUploadedFile) {
				var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				sUploadedFile = aUploadedFile[0];
			}
			oItem = {
				"documentId": jQuery.now().toString(), // generate Id,
				"fileName": sUploadedFile,
				"Id": this.Id,
				"SectionId": this.SectionId,
				"QuestionId": this.QuestionId,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",

			};

			aItems.unshift(oItem);
			sap.ui.getCore().byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			// Sets the text to the label
			sap.ui.getCore().byId("attachmentTitle").setText(this.getAttachmentTitleText());
			// delay the success message for to notice onChange message
			/*	setTimeout(function () {
					MessageToast.show("UploadComplete event triggered.");
				}, 4000);*/

		},
		onBeforeUploadStarts: function (oEvent) {

			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			var oCustomerHeaderQuestionId = new sap.m.UploadCollectionParameter({
				name: "Que_Id",
				value: this.QuestionId
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderQuestionId);

			var txtTempQueID = this.getView().byId("txtQueId");
			txtTempQueID.setText(oCustomerHeaderQuestionId.getValue());

		},
		onUploadTerminated: function (oEvent) {
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
		},
		onFileDeleted: function (oEvent) {

			this.deleteItemById(oEvent.getParameter("documentId"));
			//MessageToast.show("FileDeleted event triggered.");
		},

		getAttachmentTitleText: function () {
			var aItems = sap.ui.getCore().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		OnCancelPhotoVideo: function (oEvent) {

			this._PVDialog.close();
			if (this._PVDialog) {
				this._PVDialog.destroy();
				this._PVDialog = false; // make it falsy so that it can be created next time
			}
		},

		onPressAction: function (oEvent) {

			if (!this._ActionDialog) {
				this._ActionDialog = sap.ui.xmlfragment("poc.zinspection.fragments.Action", this);
				this._ActionDialog.setModel(this.getView().getModel());
			}
			this.getView().addDependent(this._ActionDialog);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this._ActionDialog.setModel(i18nModel, "i18n");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._ActionDialog);
			this._ActionDialog.open();
			var tblActions = this.getView().byId("tblActions");
			for (var i = 0; i < tblActions.getItems().length; i++) {
				if (tblActions.getItems()[i].getCells()[0].getText() === this.Id && tblActions.getItems()[i].getCells()[1].getText() === this.SectionId &&
					tblActions.getItems()[i].getCells()[2].getText() === this.QuestionId) {
					var actionDescription = tblActions.getItems()[i].getCells()[3].getText();
					var actionResponsible = tblActions.getItems()[i].getCells()[4].getText();
					var duedate = tblActions.getItems()[i].getCells()[5].getText();
					var solved = tblActions.getItems()[i].getCells()[6].getText();

					var txtActionDesc = sap.ui.getCore().byId("txtActionDesc");
					var drpActionResponsible = sap.ui.getCore().byId("drpActionResponsible");
					var dpkDueDate = sap.ui.getCore().byId("dpkDueDate");
					var swtSolved = sap.ui.getCore().byId("swtSolved");

					txtActionDesc.setValue(actionDescription);
					drpActionResponsible.setSelectedKey(actionResponsible);
					dpkDueDate.setValue(duedate);

					if (solved === "") {
						swtSolved.setState(false);
					} else {
						if (solved === "true") {
							swtSolved.setState(true);
						} else {
							swtSolved.setState(false);
						}
					}
					break;
				}
			}
		},

		onPressDetailAction: function (oEvent) {
			this.Id = oEvent.getSource().getParent().getParent().getParent().getContent()[0].getText();
			this.SectionId = oEvent.getSource().getParent().getParent().getParent().getContent()[1].getText();
			this.QuestionId = oEvent.getSource().getParent().getCells()[0].getText();

			if (!this._ActionDialog) {
				this._ActionDialog = sap.ui.xmlfragment("poc.zinspection.fragments.Action", this);
				this._ActionDialog.setModel(this.getView().getModel());
			}
			this.getView().addDependent(this._ActionDialog);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			this._ActionDialog.setModel(i18nModel, "i18n");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._ActionDialog);
			this._ActionDialog.open();
			var tblActions = this.getView().byId("tblActions");
			for (var i = 0; i < tblActions.getItems().length; i++) {
				if (tblActions.getItems()[i].getCells()[0].getText() === this.Id && tblActions.getItems()[i].getCells()[1].getText() === this.SectionId &&
					tblActions.getItems()[i].getCells()[2].getText() === this.QuestionId) {
					var actionDescription = tblActions.getItems()[i].getCells()[3].getText();
					var actionResponsible = tblActions.getItems()[i].getCells()[4].getText();
					var duedate = tblActions.getItems()[i].getCells()[5].getText();
					var solved = tblActions.getItems()[i].getCells()[6].getText();

					var txtActionDesc = sap.ui.getCore().byId("txtActionDesc");
					var drpActionResponsible = sap.ui.getCore().byId("drpActionResponsible");
					var dpkDueDate = sap.ui.getCore().byId("dpkDueDate");
					var swtSolved = sap.ui.getCore().byId("swtSolved");

					txtActionDesc.setValue(actionDescription);
					drpActionResponsible.setSelectedKey(actionResponsible);
					dpkDueDate.setValue(duedate);

					if (solved === "") {
						swtSolved.setState(false);
					} else {
						if (solved === "true") {
							swtSolved.setState(true);
						} else {
							swtSolved.setState(false);
						}
					}
					break;
				}
			}
		},

		OnCancelAction: function (oEvent) {

			this._ActionDialog.close();
			if (this._ActionDialog) {
				this._ActionDialog.destroy();
				this._ActionDialog = false; // make it falsy so that it can be created next time
			}
		},

		onActionSheetclose: function (oEvent) {
			this.byId("actionsheet").close();
		},

		add: function () {
			var lblDuration = this.getView().byId("lblDuration");
			this.seconds++;
			if (this.seconds >= 60) {
				this.seconds = 0;
				this.minutes++;
				if (this.minutes >= 60) {
					this.minutes = 0;
					this.hours++;
				}
			}

			var result = (this.hours ? (this.hours > 9 ? this.hours : "0" + this.hours) : "00") + ":" + (this.minutes ? (this.minutes > 9 ?
					this.minutes : "0" + this.minutes) :
				"00") + ":" + (this.seconds > 9 ? this.seconds : "0" + this.seconds);
			lblDuration.setText("Duration: " + result);

		},

		timer: function () {
			var that = this;
			setInterval(function () {
				that.add();
			}, 1000);

		},

		onPressStartInspection: function () {
			this.progressvalue = 0;
			this.tblselectedvalues = 0;
			this.percentage = 0;
			var tblLocations = this.getView().byId("tblLocations");
			tblLocations.setModel(null);

			var lblDuration = this.getView().byId("lblDuration");
			var otblSections = this.getView().byId("tblSections");
			lblDuration.setVisible(true);
			var btnStartInspection = this.getView().byId("btnStartInspection");
			btnStartInspection.setVisible(false);
			this.seconds = 0;
			this.minutes = 0;
			this.hours = 0;
			this.t = "";
			this.timer();

			var btnsubmit = this.getView().byId("btnsubmit");
			var btnCancel = this.getView().byId("btnCancel");
			btnsubmit.setEnabled(true);
			btnCancel.setEnabled(true);

			for (var j = 0; j < otblSections.getItems().length; j++) {
				var aItems = otblSections.getItems()[j].getCells()[0].getContent()[2].getItems();
				for (var k = 0; k < aItems.length; k++) {
					aItems[k].getCells()[2].setEnabled(true);
				}
			}

		},

		isInArray: function (Id, sId, QId, values) {

			var count = values.length;
			for (var i = 0; i < count; i++) {
				if (values[i].Id === Id && values[i].SectionId === sId && values[i].QuestionId === QId) {
					return true;
				}
			}
			return false;
		},

		onSelectionChange: function (oEvent) {
			var tblLocations = this.getView().byId("tblLocations");
			var indicator = this.getView().byId("indinspectionprogress");
			var oNewModel = new sap.ui.model.json.JSONModel();
			var Id = oEvent.getSource().getParent().getParent().getParent().getContent()[0].getText();
			var SectionId = oEvent.getSource().getParent().getParent().getParent().getContent()[1].getText();
			var QuestionId = oEvent.getSource().getParent().getCells()[0].getText();
			var oSegButton = oEvent.getSource().getParent().getCells()[3];
			oSegButton.setEnabled(true);

			var oModelLocations = tblLocations.getModel();
			if (oModelLocations !== undefined) {
				var values = oModelLocations.getData();
				if (values.LocationSet === undefined) {
					values = {
						LocationSet: []
					};
				}

			} else {
				values = {
					LocationSet: []
				};
			}
			var item = {};
			var that = this;
			if (tblLocations.getItems().length > 0) {
				var Valresult = that.isInArray(Id, SectionId, QuestionId, values.LocationSet);

				if (Valresult == true) {
					return false;
				} else {
					item.Id = Id;
					item.SectionId = SectionId;
					item.QuestionId = QuestionId;
					item.Location = "";
					values.LocationSet.push(item);
					oNewModel.setData(values);
					tblLocations.setModel(oNewModel);

					if (this.countQuestions === 1) {
						this.progressvalue = 100;
					} else {
						this.percentage = 100 / parseFloat(this.countQuestions);
						if (this.percentage > 0) {
							this.progressvalue = parseFloat(this.progressvalue) + parseFloat(this.percentage);
						}
					}

					indicator.setPercentValue(Math.round(this.progressvalue));
					indicator.setDisplayValue(Math.round(this.progressvalue) + "%");

					if (this.progressvalue > 0 && Math.round(this.progressvalue) < 100) {
						indicator.setState("Warning");
					} else if (Math.round(this.progressvalue) === 100) {
						indicator.setState("Success");
					} else {
						indicator.setState("None");
					}
				}

			} else {
				item.Id = Id;
				item.SectionId = SectionId;
				item.QuestionId = QuestionId;
				item.Location = "";
				values.LocationSet.push(item);
				oNewModel.setData(values);
				tblLocations.setModel(oNewModel);

				this.tblselectedvalues = tblLocations.getModel().getData().LocationSet.length;

				if (this.countQuestions === 1) {
					this.progressvalue = 100;
				} else {
					this.percentage = 100 / parseFloat(this.countQuestions);
					if (this.percentage > 0) {
						this.progressvalue = parseFloat(this.percentage) * parseFloat(this.tblselectedvalues);
					}
				}

				indicator.setPercentValue(Math.round(this.progressvalue));
				indicator.setDisplayValue(Math.round(this.progressvalue) + "%");

				if (this.progressvalue > 0 && Math.round(this.progressvalue) < 100) {
					indicator.setState("Warning");
				} else if (Math.round(this.progressvalue) === 100) {
					indicator.setState("Success");
				} else {
					indicator.setState("None");
				}

			}

		},

		onSaveComment: function () {

			var tblComments = this.getView().byId("tblComments");
			var txtcomment = sap.ui.getCore().byId("txtcomment");
			var Comment = txtcomment.getValue();
			var oNewModel = new sap.ui.model.json.JSONModel();

			var oModelComments = tblComments.getModel();
			if (oModelComments !== undefined) {
				var values = oModelComments.getData();
				if (values.CommentsSet === undefined) {
					values = {
						CommentsSet: []
					};
				}

			} else {
				values = {
					CommentsSet: []
				};
			}

			var that = this;
			if (tblComments.getItems().length > 0) {
				var Valresult = that.isInArray(this.Id, this.SectionId, this.QuestionId, values.CommentsSet);

				if (Valresult === true) {
					for (var i = 0; i < values.CommentsSet.length; i++) {
						if (this.Id === values.CommentsSet[i].Id && this.SectionId === values.CommentsSet[i].SectionId && this.QuestionId === values.CommentsSet[
								i].QuestionId) {
							values.CommentsSet[i].Comment = Comment;
							//values.CommentsSet[i].Location = Location;
							oNewModel.setData(values);
							tblComments.setModel(oNewModel);
							break;
						}

					}
				} else {
					values.CommentsSet.push({
						"Id": this.Id,
						"SectionId": this.SectionId,
						"QuestionId": this.QuestionId,
						"Comment": Comment,
						"Location": ""
					});
					oNewModel.setData(values);
					tblComments.setModel(oNewModel);
				}

			} else {
				values.CommentsSet.push({
					"Id": this.Id,
					"SectionId": this.SectionId,
					"QuestionId": this.QuestionId,
					"Comment": Comment,
					"Location": ""
				});

				oNewModel.setData(values);
				tblComments.setModel(oNewModel);
			}

			if (txtcomment.getValue() !== "") {
				this.btnComment.setVisible(true);
			} else {
				this.btnComment.setVisible(false);
			}

			this._CommentoDialog.close();
			if (this._CommentoDialog) {
				this._CommentoDialog.destroy();
				this._CommentoDialog = false; // make it falsy so that it can be created next time
			}
		},

		onSavePhotoVideo: function () {
			debugger;
			var tblPhotoVideo = this.getView().byId("tblPhotoVideo");
			var oUploadCollection = sap.ui.getCore().byId("UploadCollection");
			var aItems = oUploadCollection.getModel().getData().items;
			var txtTempQueID = this.getView().byId("txtQueId");

			//var sUploadedFile = oEvent.getParameter("files")[0].fileName;

			var oNewModel = new sap.ui.model.json.JSONModel();

			var oModelPhotoVideo = tblPhotoVideo.getModel();
			if (oModelPhotoVideo !== undefined) {
				var values = oModelPhotoVideo.getData();
				if (values.PhotoVideoSet === undefined) {
					values = {
						PhotoVideoSet: []
					};
				}

			} else {
				values = {
					PhotoVideoSet: []
				};
			}

			var that = this;
			if (tblPhotoVideo.getItems().length > 0) {
				for (var j = 0; j < aItems.length; j++) {
					for (var i = 0; i < values.PhotoVideoSet.length; i++) {
						var query1 = aItems[j].documentId;

						var oFilter1;
						var allFilter = "";
						if (query1.length > 0) {
							oFilter1 = new sap.ui.model.Filter("DocumentId", sap.ui.model.FilterOperator.EQ, query1);

							allFilter = new sap.ui.model.Filter([oFilter1], false);

						}
						var obinding = tblPhotoVideo.getBinding("items");
						obinding.filter(allFilter);
						if (tblPhotoVideo.getItems().length === 0) {
							values.PhotoVideoSet.push({
								"Id": this.Id,
								"SectionId": this.SectionId,
								"QuestionId": this.QuestionId,
								"FileName": aItems[j].fileName,
								"DocumentId": aItems[j].documentId,
								"Location": ""
							});
							oNewModel.setData(values);
							tblPhotoVideo.setModel(oNewModel);
						}
						break;
					}

				}

			} else {
				debugger;
				for (var j = 0; j < aItems.length; j++) {
					values.PhotoVideoSet.push({
						"Id": this.Id,
						"SectionId": this.SectionId,
						"QuestionId": this.QuestionId,
						"FileName": aItems[j].fileName,
						"DocumentId": aItems[j].documentId,
						"Location": ""
					});
				}

				oNewModel.setData(values);
				tblPhotoVideo.setModel(oNewModel);
				//	oUploadCollection.getModel().setData(null);

			}

			/*	if (tblPhotoVideo.getItems().length > 0) {
					var Valresult = that.isInArray(this.Id, this.SectionId, this.QuestionId, values.PhotoVideoSet);

					if (Valresult === true) {
						for (var i = 0; i < values.PhotoVideoSet.length; i++) {
							if (this.Id === values.PhotoVideoSet[i].Id && this.SectionId === values.PhotoVideoSet[i].SectionId && this.QuestionId === values
								.PhotoVideoSet[i].QuestionId) {
								for (var j = 0; j < aItems.length; j++) {
									if (aItems[j].documentId !== tblPhotoVideo.getModel().getData().PhotoVideoSet[i].DocumentId) {
										values.PhotoVideoSet.push({
											"Id": this.Id,
											"SectionId": this.SectionId,
											"QuestionId": this.QuestionId,
											"FileName": aItems[j].fileName,
											"DocumentId": aItems[j].documentId,
											"Location": ""
										});

										oNewModel.setData(values);
										tblPhotoVideo.setModel(oNewModel);
										break;
									} else {
										this._PVDialog.close();
									}

								}
									break;

							} 

						}
					} else {
						debugger;
						for (var j = 0; j < aItems.length; j++) {
							values.PhotoVideoSet.push({
								"Id": this.Id,
								"SectionId": this.SectionId,
								"QuestionId": this.QuestionId,
								"FileName": aItems[j].fileName,
								"DocumentId": aItems[j].documentId,
								"Location": ""
							});
								oNewModel.setData(values);
						tblPhotoVideo.setModel(oNewModel);
						break;
						}
					
						
					}

				} else {
					debugger;
					for (var j = 0; j < aItems.length; j++) {
						values.PhotoVideoSet.push({
							"Id": this.Id,
							"SectionId": this.SectionId,
							"QuestionId": this.QuestionId,
							"FileName": aItems[j].fileName,
							"DocumentId": aItems[j].documentId,
							"Location": ""
						});
					}

					oNewModel.setData(values);
					tblPhotoVideo.setModel(oNewModel);
					//	oUploadCollection.getModel().setData(null);

				}*/

			if (aItems.length > 0) {
				this.btnPhoto.setVisible(true);
			} else {
				this.btnPhoto.setVisible(false);
			}

			this._PVDialog.close();
			if (this._PVDialog) {
				this._PVDialog.destroy();
				this._PVDialog = false; // make it falsy so that it can be created next time
			}
		},

		onSaveAction: function () {

			var tblActions = this.getView().byId("tblActions");

			var txtActionDesc = sap.ui.getCore().byId("txtActionDesc").getValue();
			var drpActionResponsible = sap.ui.getCore().byId("drpActionResponsible").getSelectedKey();
			var dpkDueDate = sap.ui.getCore().byId("dpkDueDate").getValue();
			var swtSolved = sap.ui.getCore().byId("swtSolved").getState();

			var oNewModel = new sap.ui.model.json.JSONModel();

			var oModelActions = tblActions.getModel();
			if (oModelActions !== undefined) {
				var values = oModelActions.getData();
				if (values.ActionsSet === undefined) {
					values = {
						ActionsSet: []
					};
				}

			} else {
				values = {
					ActionsSet: []
				};
			}

			var that = this;
			if (tblActions.getItems().length > 0) {
				var Valresult = that.isInArray(this.Id, this.SectionId, this.QuestionId, values.ActionsSet);
				if (Valresult === true) {
					for (var i = 0; i < values.ActionsSet.length; i++) {
						if (this.Id === values.ActionsSet[i].Id && this.SectionId === values.ActionsSet[i].SectionId && this.QuestionId === values.ActionsSet[
								i].QuestionId) {
							values.ActionsSet[i].ActionDescription = txtActionDesc;
							values.ActionsSet[i].ActionResponsible = drpActionResponsible;
							values.ActionsSet[i].DueDate = dpkDueDate;
							values.ActionsSet[i].Solved = swtSolved;
							//values.CommentsSet[i].Location = Location;
							oNewModel.setData(values);
							tblActions.setModel(oNewModel);
							break;
						}

					}
				} else {
					values.ActionsSet.push({
						"Id": this.Id,
						"SectionId": this.SectionId,
						"QuestionId": this.QuestionId,
						"ActionDescription": txtActionDesc,
						"ActionResponsible": drpActionResponsible,
						"DueDate": dpkDueDate,
						"Solved": swtSolved,
						"Location": ""
					});
					oNewModel.setData(values);
					tblActions.setModel(oNewModel);
				}

			} else {
				values.ActionsSet.push({
					"Id": this.Id,
					"SectionId": this.SectionId,
					"QuestionId": this.QuestionId,
					"ActionDescription": txtActionDesc,
					"ActionResponsible": drpActionResponsible,
					"DueDate": dpkDueDate,
					"Solved": swtSolved,
					"Location": ""
				});

				oNewModel.setData(values);
				tblActions.setModel(oNewModel);
			}

			if (txtActionDesc !== "" && drpActionResponsible !== "0" && dpkDueDate !== "") {
				this.btnAction.setVisible(true);
			} else {
				this.btnAction.setVisible(false);
			}

			this._ActionDialog.close();
			if (this._ActionDialog) {
				this._ActionDialog.destroy();
				this._ActionDialog = false; // make it falsy so that it can be created next time
			}
			//otblSections.getItems()[0].getCells()[0].getContent()[2].getItems()[0].getCells()[3]
		},

		deleteItemById: function (sItemToDeleteId) {
			var oData = sap.ui.getCore().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			jQuery.each(aItems, function (index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
			sap.ui.getCore().byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			sap.ui.getCore().byId("attachmentTitle").setText(this.getAttachmentTitleText());

		}

	});

});
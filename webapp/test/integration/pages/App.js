sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/demo/todo/test/integration/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/LabelFor",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press"
], function (Opa5, Common, AggregationLengthEquals, PropertyStrictEquals, Properties, LabelFor, EnterText, Press) {
	"use strict";

	var sViewName = "sap.ui.demo.todo.view.App";
	var sAddToItemInputId = "productForm";
	var sProductFormAddButton = "productFormAddButton";
	var sSearchTodoItemsInputId = "searchProductsInput";
	var sItemListId = "productList";
	var sClearUnavailableId = "clearUnavailable";
	var sItemsLeftLabelId = "totalValueLabel";

	Opa5.createPageObjects({
		onTheAppPage: {

			baseClass: Common,

			actions: {
				iEnterTextForNewProductAndPressEnter: function(name, quantity, price, unavailable) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.Input",
						matchers: new LabelFor({
							text: "Name"
						}),
						actions: new EnterText({text: name}),
						errorMessage: "Failed to fulfill Name input"
					}).waitFor({
						viewName: sViewName,
						controlType: "sap.m.Input",
						matchers: new LabelFor({
							text: "Quantity"
						}),
						actions: new EnterText({text: quantity}),
						errorMessage: "Failed to fulfill Quantity input"
					}).waitFor({
						viewName: sViewName,
						controlType: "sap.m.Input",
						matchers: new LabelFor({
							text: "Price"
						}),
						actions: new EnterText({text: price}),
						errorMessage: "Failed to fulfill Price input"
					}).waitFor({
						viewName: sViewName,
						controlType: "sap.m.CheckBox",
						matchers: new LabelFor({
							text: "Unavialable"
						}),
						actions: unavailable ? new Press() : [],
						errorMessage: "Failed to fulfill Unavialable checkbox"
					}).waitFor({
						id: sProductFormAddButton,
						viewName: sViewName,
						controlType: "sap.m.Button",
						actions: new Press(),
						errorMessage: "Form add button can not be pressed"
					});
				},
				iEnterTextForSearchAndPressEnter: function(text) {
					return this.waitFor({
						id: sSearchTodoItemsInputId,
						viewName: sViewName,
						actions: [new EnterText({ text: text })],
						errorMessage: "The text cannot be entered"
					});
				},
				iSelectTheLastItem: function(bSelected) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						// selectionChange
						actions: [function(oList) {
							var iLength = oList.getItems().length;
							var oListItem = oList.getItems()[iLength - 1];
							this._triggerCheckboxSelection(oListItem, bSelected);
						}.bind(this)],
						errorMessage: "Last checkbox cannot be pressed"
					});
				},
				iSelectAllItems: function(bSelected) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						actions: [function(oList) {
							oList.getItems().forEach(function(oListItem) {
								this._triggerCheckboxSelection(oListItem, bSelected)

							}.bind(this));
						}.bind(this)],
						errorMessage: "checkbox cannot be pressed"
					});
				},
				_triggerCheckboxSelection: function(oListItem, bSelected) {
					//determine existing selection state and ensure that it becomes <code>bSelected</code>
					if (oListItem.getSelected() && !bSelected || !oListItem.getSelected() && bSelected) {
						var oPress = new Press();
						//search within the ColumnListItem for the checkbox id ending with 'selectMulti-CB'
						oPress.controlAdapters["sap.m.ColumnListItem"] = "selectMulti-CB";
						oPress.executeOn(oListItem);
					}
				},
				iClearTheUnavailableItems: function() {
					return this.waitFor({
						id: sClearUnavailableId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "checkbox cannot be pressed"
					});
				},
				iFilterForItems: function(filterKey) {
					return this.waitFor({
						viewName: sViewName,
						controlType: "sap.m.SegmentedButtonItem",
						matchers: [
							new Properties({ key: filterKey })
						],
						actions: [new Press()],
						errorMessage: "SegmentedButton can not be pressed"
					});
				}
			},

			assertions: {
				iShouldSeeTheItemBeingAdded: function(iItemCount, sLastAddedText) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [new AggregationLengthEquals({
							name: "items",
							length: iItemCount
						}), function(oControl) {
							var iLength = oControl.getItems().length;
							var oInput = oControl.getItems()[iLength - 1].getCells()[0];
							return new PropertyStrictEquals({
								name: "value",
								value: sLastAddedText
							}).isMatching(oInput);
						}],
						success: function() {
							Opa5.assert.ok(true, "The table has " + iItemCount + " item(s), with '" + sLastAddedText + "' as last item");
						},
						errorMessage: "List does not have expected entry '" + sLastAddedText + "'."
					});
				},
				iShouldSeeTheLastItemBeingUnavailable: function(bSelected) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [function(oControl) {
							var iLength = oControl.getItems().length;
							var oInput = oControl.getItems()[iLength - 1].getCells()[0];
							return bSelected && !oInput.getEnabled() || !bSelected && oInput.getEnabled();
						}],
						success: function() {
							Opa5.assert.ok(true, "The last item is marked as completed");
						},
						errorMessage: "The last item is not disabled."
					});
				},
				iShouldSeeAllButOneItemBeingRemoved: function(sLastItemText) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [new AggregationLengthEquals({
							name: "items",
							length: 1
						}), function(oControl) {
							var oInput = oControl.getItems()[0].getCells()[0];
							return new PropertyStrictEquals({
								name: "value",
								value: sLastItemText
							}).isMatching(oInput);
						}],
						success: function() {
							Opa5.assert.ok(true, "The table has 1 item, with '" + sLastItemText + "' as Last item");
						},
						errorMessage: "List does not have expected entry '" + sLastItemText + "'."
					});
				},
				iShouldSeeTotalValuePrice: function(iTotalValuePrice) {
					return this.waitFor({
						id: sItemsLeftLabelId,
						viewName: sViewName,
						matchers: [new PropertyStrictEquals({
							name: "text",
							value: "Total available price value: " + iTotalValuePrice + " EUR"
						})
						],
						success: function() {
							Opa5.assert.ok(true, "" + iTotalValuePrice + " total value");
						},
						errorMessage: "Items are not selected."
					});
				},
				iShouldSeeItemCount: function(iItemCount) {
					return this.waitFor({
						id: sItemListId,
						viewName: sViewName,
						matchers: [new AggregationLengthEquals({
							name: "items",
							length: iItemCount
						})],
						success: function() {
							Opa5.assert.ok(true, "The table has " + iItemCount + " item(s)");
						},
						errorMessage: "List does not have expected number of items '" + iItemCount + "'."
					});
				}
			}

		}
	});

});

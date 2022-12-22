sap.ui.define([
    "sap/ui/core/mvc/Controller"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.lists.controller.ListTypes", {
            onInit: function () {
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oJSONModel.loadData("../localService/mockdata/ListData.json");

                this.getView().setModel(oJSONModel);
            },

            getGroupHeader: function(oGroup){
                var groupHeaderListItem = sap.m.GroupHeaderListItem({
                    title: oGroup.key,
                    upperCase: true
                })

                return groupHeaderListItem;
            },

            onShowSelectRows: function(){
                var standarList = this.getView().byId("standarList");
                var selectedItems = standarList.getSelectedItems();

                var i18nModels = this.getView().getModel("i18n").getResourceBundle();

                if (selectedItems.length === 0){
                    sap.m.MessageToast.show(i18nModels.getText("noSelection"));
                }else{
                    var textMessage = i18nModels.getText("selected");
                    selectedItems.forEach(element => {
                        var context = element.getBindingContext();
                        var oContext = context.getObject();

                        textMessage = textMessage + ' - ' + oContext.Material;
                    });

                    sap.m.MessageToast.show(textMessage);
                }
            },

            onDeleteSelectRows: function(){
                var standarList = this.getView().byId("standarList");
                var selectedItems = standarList.getSelectedItems();

                var i18nModels = this.getView().getModel("i18n").getResourceBundle();

                if (selectedItems.length === 0){
                    sap.m.MessageToast.show(i18nModels.getText("noSelection"));
                }else{
                    var textMessage = i18nModels.getText("selected");
                    
                    var arrayId = [];

                    var model = this.getView().getModel();
                    var products = model.getProperty("/Products")

                    selectedItems.forEach(element => {
                        var context = element.getBindingContext();
                        var oContext = context.getObject();

                        arrayId.push(oContext.Id);

                        textMessage = textMessage + ' - ' + oContext.Material;
                    });

                    products = products.filter(d => {
                        return !arrayId.includes(d.Id);
                    })

                    model.setProperty("/Products", products);

                    standarList.removeSelections();

                    sap.m.MessageToast.show(textMessage);
                }
            },

            onDeleteRow: function(oEvent){
                var selectedRow = oEvent.getParameter("listItem");
                var context = selectedRow.getBindingContext();
                var splitPath = context.getPath().split("/");
                var indexSelectedRow = splitPath[splitPath.length-1];
                var model = this.getView().getModel();
                var products = model.getProperty("/Products");

                products.splice(indexSelectedRow, 1);
                model.refresh();
            }
        });
    });

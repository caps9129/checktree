var treeData = [
    { title: "item1 with key and tooltip", tooltip: "Look, a tool tip!" },
    { title: "item2: selected on init", select: true },
    {
        title: "Folder", isFolder: true, key: "id3",
        children: [
            {
                title: "Sub-item 3.1",
                children: [
                    { title: "Sub-item 3.1.1", key: "id3.1.1" },
                    { title: "Sub-item 3.1.2", key: "id3.1.2" }
                ]
            },
            {
                title: "Sub-item 3.2",
                children: [
                    { title: "Sub-item 3.2.1", key: "id3.2.1" },
                    { title: "Sub-item 3.2.2", key: "id3.2.2" }
                ]
            }
        ]
    },
    {
        title: "Document with some children (expanded on init)", key: "id4", expand: true,
        children: [
            {
                title: "Sub-item 4.1 (active on init)", activate: true,
                children: [
                    { title: "Sub-item 4.1.1", key: "id4.1.1" },
                    { title: "Sub-item 4.1.2", key: "id4.1.2" }
                ]
            },
            {
                title: "Sub-item 4.2 (selected on init)", select: true,
                children: [
                    { title: "Sub-item 4.2.1", key: "id4.2.1" },
                    { title: "Sub-item 4.2.2", key: "id4.2.2" }
                ]
            },
            { title: "Sub-item 4.3 (hideCheckbox)", hideCheckbox: true },
            { title: "Sub-item 4.4 (unselectable)", unselectable: true }
        ]
    }
];
$(function () {

    $("#tree3").dynatree({
        checkbox: true,
        selectMode: 3,
        children: treeData,
        onSelect: function (select, node) {
            // Get a list of all selected nodes, and convert to a key array:
            var selKeys = $.map(node.tree.getSelectedNodes(), function (node) {
                return node.data.key;
            });
            $("#echoSelection3").text(selKeys.join(", "));

            // Get a list of all selected TOP nodes
            var selRootNodes = node.tree.getSelectedNodes(true);
            // ... and convert to a key array:
            var selRootKeys = $.map(selRootNodes, function (node) {
                return node.data.key;
            });
            $("#echoSelectionRootKeys3").text(selRootKeys.join(", "));
            $("#echoSelectionRoots3").text(selRootNodes.join(", "));
        },
        onDblClick: function (node, event) {
            node.toggleSelect();
        },
        onKeydown: function (node, event) {
            if (event.which == 32) {
                node.toggleSelect();
                return false;
            }
        },
        // The following options are only required, if we have more than one tree on one page:
        //				initId: "treeData",
        cookieId: "dynatree-Cb3",
        idPrefix: "dynatree-Cb3-"
    });

});
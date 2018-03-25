$(function () {

    // --- Initialize sample trees
    $("#tree1").dynatree({
        checkbox: true,
        // Override class name for checkbox icon:
        classNames: { checkbox: "dynatree-radio" },
        selectMode: 1,
        children: treeData,
        onActivate: function (node) {
            $("#echoActive1").text(node.data.title);
        },
        onSelect: function (select, node) {
            // Display list of selected nodes
            var s = node.tree.getSelectedNodes().join(", ");
            $("#echoSelection1").text(s);
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
        //      initId: "treeData",

    });
})
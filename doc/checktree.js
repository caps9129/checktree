var treeData = [
    { title: "item1 with key and tooltip", tooltip: "Look, a tool tip!" },
    { title: "item2: selected on init", select: false },
    {
        title: "folder", isFolder: true, key: "folder",
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
        title: "Document with some children", key: "Document with some children", expand: false,
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
    },
    { title: "EMAP", key: "EMAP", select: false },
    { title: "osm", key: "osm", select: false },
    { title: "B5000", key: "B5000", select: false },
    { title: "PHOTO2", key: "PHOTO2", select: false }
]





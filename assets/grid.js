$("#grid-selection").bootgrid({
    ajax: true,
    post: function ()
    {
        /* To accumulate custom parameter with the request object */
        return {
            id: "b0df282a-0d67-40e5-8558-c9e93b7befed"
        };
    },
    url: "/api/data/basic",
    selection: true,
    multiSelect: true,
    formatters: {
        "link": function(column, row)
        {
            return "<a href=\"#\">" + column.id + ": " + row.id + "</a>";
        }
    }
}).on("selected.rs.jquery.bootgrid", function(e, rows)
{
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i].id);
    }
    alert("Select: " + rowIds.join(","));
}).on("deselected.rs.jquery.bootgrid", function(e, rows)
{
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i].id);
    }
    alert("Deselect: " + rowIds.join(","));
});
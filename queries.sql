-- GET /list query --
-- returns JSON of all lists with an items value
--which is an array of any item with the same list_id as the current list.

-- First I created a table view that will sort our data automatically.
-- You can query this table view like a normal table
-- You can also flag these as temporary, but I just made them permanent views in my database
-- Questions for Instructors:
-- ? - Does this create 'duplicate' data? From my tests, if I delete something in the main table, the view updates as well. Just curious.
-- ? - I chose to use these because I was having trouble ordering the complicated JSON query
-- ? - ... so I am curious if there was a better way I could have queried to avoid the view table
CREATE VIEW my_lists ( id, name, active ) AS (SELECT * FROM list ORDER BY id);

SELECT
json_agg( -- Honestly, I don't think I need this, but the tutorial used it.
    json_build_object( -- Build a JSON object.
        'id', my_lists.id, -- References the `list` table
        'name', my_lists.name, -- References the `list` table
        'items', ( -- A new object key to store information from the `items` table
                    SELECT 
                    json_agg( -- Another one of these things again
                        json_build_object(  -- Build a JSON object
                            'id', item.id, -- Directly from the `item` table
                            'content', item.content, -- Ibid.
                            'status', item.status, -- Ibid.
                            'pinned', item.pinned, -- Ibid.
                            'active', item.active -- Ibid.
                        )
                    )
                    FROM item -- From the Item Table
                    WHERE list_id=my_lists.id -- Select only the `items` connected to the particular list
                )
    )
)
AS lists
FROM my_lists;
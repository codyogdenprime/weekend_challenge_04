# Mello

A fake Trello created for a homework assignment.

## Instal Instructions

Create a Postgres database named `mello.'

Run the following SQL commands to setup the tables:

### List Table

```sql
CREATE TABLE "public"."list" (
    "id" serial,
    "name" text,
    "status" int,
    PRIMARY KEY ("id")
);
```
### Items Table
```sql
CREATE TABLE "public"."item" (
    "id" serial,
    "content" text,
    "status" int,
    "pinned" boolean,
    "active" bool,
    "complete" bool DEFAULT FALSE,
    "list_id" int,
    "last_updated" date,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("list_id") REFERENCES "public"."list"("id")
);
```

### List View
```sql
CREATE VIEW "public"."my_lists" AS  SELECT list.id,
    list.name,
    list.status
   FROM list
  ORDER BY list.id;
```

### Items View
```sql
CREATE VIEW "public"."my_items" AS  SELECT item.id,
    item.content,
    item.status,
    item.pinned,
    item.active,
    item.complete,
    item.list_id
   FROM item
  ORDER BY item.status, item.complete, item.id;
```

## Run The App
Run index.js with node or nodemon. The app will load at http://localhost:3000

![](http://cjo.io/wp-content/uploads/2016/09/Screen-Shot-2016-09-19-at-8.33.01-AM.png)

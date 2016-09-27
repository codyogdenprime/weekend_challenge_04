---####--- Database, Table and View Creation ---####---

CREATE DATABASE mello;

-- Lists Table --
CREATE TABLE "public"."list" (
    "id" serial,
    "name" text,
    "status" int,
    PRIMARY KEY ("id")
);

-- Items Table --
CREATE TABLE "public"."list" (
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

CREATE VIEW "public"."my_items" AS  SELECT item.id,
    item.content,
    item.status,
    item.pinned,
    item.active,
    item.complete,
    item.list_id
   FROM item
  ORDER BY item.status, item.complete, item.id;

CREATE VIEW "public"."my_lists" AS  SELECT list.id,
    list.name,
    list.status
   FROM list
  ORDER BY list.id;
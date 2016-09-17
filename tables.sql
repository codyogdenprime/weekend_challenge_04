---####--- Table Creation ---####---

-- Lists Table --

CREATE TABLE "public"."list" (
    "id" serial,
    "name" text,
    PRIMARY KEY ("id")
);

-- Items Table --
CREATE TABLE "public"."item" (
    "id" serial,
    "content" text,
    "status" text,
    "pinned" text,
    "active" text,
    "list_id" text,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE CASCADE
);
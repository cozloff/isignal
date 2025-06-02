CREATE TABLE "business" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"employeeId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_employeeId_users_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idIndex" ON "users" USING btree ("id");
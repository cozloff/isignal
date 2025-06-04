export declare const listBusinesses: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "list_businesses";
    schema: undefined;
    columns: {
        listId: import("drizzle-orm/pg-core").PgColumn<{
            name: "list_id";
            tableName: "list_businesses";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        businessId: import("drizzle-orm/pg-core").PgColumn<{
            name: "business_id";
            tableName: "list_businesses";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const listBusinessesRelations: import("drizzle-orm").Relations<"list_businesses", {
    list: import("drizzle-orm").One<"list", true>;
    business: import("drizzle-orm").One<"business", true>;
}>;

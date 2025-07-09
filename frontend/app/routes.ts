import { type RouteConfig, index, layout, route, prefix } from "@react-router/dev/routes";

export default [
    layout("./layouts/RootLayout.tsx", [
        index("routes/home.tsx"),
        route("/login", "./routes/login.tsx"),
        ...prefix("register", [
            index("./routes/register.tsx"),
            route("confirm-email", "./routes/confirm-email.tsx"),
        ]),
    ]),
] satisfies RouteConfig;

import express from "express";
import { router as tvRouter } from "./tv.js";
import { router as seasonRouter } from "./season.js";
import { router as episodeRouter } from "./episode.js";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import session from "express-session";

import { router as authenticateRouter } from "./authenticate.js";
import passport from "./login.js";

dotenv.config();

const { PORT: port = 3000, SESSION_SECRET: sessionSecret } = process.env;

if (!sessionSecret) {
  console.error("Vantar gögn í env");
  process.exit(1);
}

const app = express();
app.use(express.json());

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, "../public")));

app.get("/", (req, res) => {
  res.json({
    tv: {
      series: { 
        href: "/tv", 
        methods: [
          "GET", 
          "POST"
        ]
      },
      serie: { 
        href: "/tv/{id}",
        methods: [
          "GET", 
          "PATCH",
          "DELETE"
        ]
      },
      rate: { 
        href: "/tv/{id}/rate",
        methods: [
          "POST", 
          "PATCH",
          "DELETE"
        ]
      },
      state: { 
        href: "/tv/{id}/state",
        methods: [
          "POST", 
          "PATCH",
          "DELETE"
        ] 
      },
    },
    seasons: {
      seasons: { 
        href: "/tv/{id}/season",
        methods: [
          "GET", 
          "POST"
        ]
      },
      season: {
        href: "/tv/{id}/season/{season}",
        methods: [
          "GET", 
          "DELETE"
        ]
      },
    },
    episodes: {
      episodes: { 
        href: "/tv/{id}/season/{season}/episode",
        methods: [
          "POST"
        ] 
      },
      episode: {
        href: "/tv/{id}/season/{season}/episode/{episode}",
        methods: [
          "GET", 
          "DELETE"
        ],
      },
    },
    genres: { 
      genres: { 
        href: "/genres",
          methods: [
            "GET", 
            "POST"
          ] 
        }
      },
    users: {
      users: { 
        href: "/users",
        methods: [
          "GET"
        ] 
      },
      user: { 
        href: "/users/{id}",
        methods: [
          "GET", 
          "PATCH"
        ] 
      },
      register: { 
        href: "/users/register",
        methods: [
          "POST"
        ] 
      },
      login: { 
        href: "/users/login",
        methods: [
          "POST"
        ]
      },
      me: { 
        href: "/users/me",
        methods: [
          "GET",
          "PATCH"
        ]
      },
    },
  });
});

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    maxAge: 20 * 1000, // 20 sek
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", authenticateRouter);

app.use("/tv", tvRouter);
app.use("/tv/:id/season", seasonRouter);
app.use("/tv/:id/season/:seasonId/episode", episodeRouter);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});

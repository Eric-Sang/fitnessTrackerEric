const express = require("express");
const app = express();
const router = express.Router();
const { getUserById } = require("../db");
//
//
//
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    res.status(401);
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      //   console.log(token);
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      res.status(401);
      next({ name, message });
    }
  } else {
    res.status(401);
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

router.use((req, res, next) => {
  if (req.user) {
    // console.log("User is set:", req.user);
  }

  next();
});
router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

// GET /api/health
router.get("/health", async (req, res, next) => {});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

module.exports = router;

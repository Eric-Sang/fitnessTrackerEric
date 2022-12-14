const express = require("express");
const {
  attachActivitiesToRoutines,
  getAllActivities,
} = require("../db/activities");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
} = require("../db/routines");
const {
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db/routine_activities");
const { requireUser } = require("./utils");
const router = express.Router();

// GET /api/routines
router.get("/", async (req, res, next) => {
  const result = await getAllPublicRoutines();
  res.send(result);
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const fields = req.body;

  const create = await createRoutine({ creatorId: req.user.id, ...fields });

  res.send(create);
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const fields = req.body;
  const check = await getRoutineById(routineId);
  // console.log(await getRoutineById(12333));

  console.log(check.creatorId);
  console.log(req.user.id);

  let error = {
    error: "Error",
    message: `User ${req.user.username} is not allowed to update ${check.name}`,
    name: "name errror",
  };
  let error2 = {
    error: "error",
    message: "no inputs found",
  };

  if (!fields) {
    res.send(error2);
  }

  if (check.creatorId !== req.user.id || !check.creatorId) {
    res.status(403);
    res.send(error);
  } else if (check.creatorId === req.user.id) {
    const update = await updateRoutine({ id: routineId, ...fields });
    res.send(update);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const check = await getRoutineById(routineId);
  let error = {
    error: "Error",
    message: `User ${req.user.username} is not allowed to delete ${check.name}`,
    name: "name errror",
  };
  if (check.creatorId !== req.user.id) {
    res.status(403);
    res.send(error);
  } else {
    const deleteRoutine = await destroyRoutine(routineId);
    res.send(deleteRoutine);
  }
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  //   const routine = await getRoutineById(routineId);
  let error = {
    error: "error",
    message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
    name: "error",
  };

  const activities = await getRoutineActivitiesByRoutine({ id: routineId });

  var duplicate = false;
  for (var key in activities) {
    var obj = activities[key];
    if (obj.id === activityId) {
      duplicate = true;
      break;
    }
  }
  if (duplicate) {
    res.send(error);
  } else {
    const addActivity = await addActivityToRoutine({
      routineId: routineId,
      activityId: activityId,
      count: count,
      duration: duration,
    });
    res.send(addActivity);
  }
});

module.exports = router;

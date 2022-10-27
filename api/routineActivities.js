const express = require("express");
const {
  getRoutineActivityById,
  canEditRoutineActivity,
  updateRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;

  const fields = req.body;

  const canEdit = await canEditRoutineActivity(routineActivityId, req.user.id);

  const getName = await getRoutineActivityById(routineActivityId);

  const getRoutineName = await getRoutineById(getName.routineId);

  let error = {
    error: "error",
    message: `User ${req.user.username} is not allowed to update ${getRoutineName.name}`,
    name: "test",
  };

  if (canEdit === true) {
    const update = await updateRoutineActivity({
      id: routineActivityId,
      ...fields,
    });
    res.send(update);
  } else {
    res.send(error);
  }
});
// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  console.log(routineActivityId);
  const fields = req.body;

  const canEdit = await canEditRoutineActivity(routineActivityId, req.user.id);

  const getName = await getRoutineActivityById(routineActivityId);

  const getRoutineName = await getRoutineById(getName.routineId);

  let error = {
    error: "error",
    message: `User ${req.user.username} is not allowed to delete ${getRoutineName.name}`,
    name: "user error",
  };

  if (canEdit === true) {
    const update = await destroyRoutineActivity(routineActivityId);
    res.send(update);
  } else {
    res.status(403);
    res.send(error);
  }
});

module.exports = router;

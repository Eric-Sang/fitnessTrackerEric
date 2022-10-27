const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  updateActivity,
  getActivityById,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  const activityId = req.params.activityId;

  try {
    const activity = await getActivityById(activityId);

    if (!activity) {
      res.status(500);
      res.send({
        error: "an error has occured",
        message: `Activity ${req.params.activityId} not found`,
        name: "No Activity",
      });
    } else {
      const routinesByAct = await getPublicRoutinesByActivity({
        id: activity.id,
      });
      res.send(routinesByAct);
    }
  } catch (error) {
    res.status(500);
    next({
      error: "an error has occured",
      message: `Activity ${req.params.activityId} not found`,
      name: "No Activity",
    });
  }
});

// GET /api/activities
router.get("/", async (req, res) => {
  try {
    const getActivities = await getAllActivities();
    res.send(getActivities);
  } catch (error) {
    throw error;
  }
});
// POST /api/activities
// NEED TO INCORPORATE LOGGED IN USER
router.post("/", async (req, res, next) => {
  const { name, description = "" } = req.body;
  let error = {
    error: "error",
    message: `An activity with name ${name} already exists`,
    name: name,
  };

  const checkAct = await getActivityByName(name);
  if (checkAct) {
    res.send(error);
  } else {
    const newAct = await createActivity({ name, description });
    res.send(newAct);
  }
});
// PATCH /api/activities/:activityId

router.patch("/:activityId", requireUser, async (req, res, next) => {
  const id = req.params.activityId;
  const fields = req.body;
  let error = {
    error: "error",
    message: `An activity with name ${fields.name} already exists`,
    name: "error name",
  };
  const check = await getActivityByName(fields.name);

  const activityToUpdate = await updateActivity({ id, ...fields });
  if (!activityToUpdate) {
    res.status(500);
    res.send({
      error: "an error has occurred",
      message: `Activity ${id} not found`,
      name: "noExistingActivityId",
    });
    return;
  }
  if (check) {
    res.send(error);
  } else {
    res.send(activityToUpdate);
  }

  //    catch (error) {
  //     res.status(500);

  //     res.send({
  //       error: "error",
  //       message: `An activity with name ${fields.name} already exists`,
  //     });
  //   }

  //   if (fields.name === activityToUpdate.name) {
  //     res.send({
  //
  //     });
  //   } else {
  //     res.send(activityToUpdate);
  //   }
});

module.exports = router;

//test
// const e = require("express");
// const express = require("express");
// const router = express.Router();

// const { requireUser } = require("./utils");

// const {
//   getAllActivities,
//   createActivity,
//   updateActivity,
//   getPublicRoutinesByActivity,
//   getActivityById,
// } = require("../db");

// // GET /api/activities/:activityId/routines
// router.get("/:activityId/routines", async (req, res, next) => {
//   const activityId = req.params.activityId;
//   console.log("params activityId being passed in: ", activityId);

//   try {
//     const activity = await getActivityById(activityId);
//     console.log("activity retrieved by id:", activity);

//     if (!activity) {
//       next({ message: "no activity found by id", error });
//     } else {
//       const routinesByActivityId = await getPublicRoutinesByActivity({
//         id: activity.id,
//       });

//       console.log("!!!!!!!", routinesByActivityId);

//       res.send(routinesByActivityId);
//       return;
//     }
//   } catch (error) {
//     res.status(500);

//     next({
//       error: "an error has occurred",
//       message: `Activity ${req.params.activityId} not found`,
//       name: "noActivityWithProvidedId",
//     });
//   }
// });

// // GET /api/activities
// router.get("/", async (req, res, next) => {
//   const activities = await getAllActivities();
//   //   console.log(activities);
//   res.send(activities);
// });

// // POST /api/activities
// router.post("/", requireUser, async (req, res, next) => {
//   const name = req.body.name;
//   const description = req.body.description;

//   //   console.log("name and description being passed in: ", name, description);

//   try {
//     if (!name || !description) {
//       next({ message: "missing name or description", error });
//       return;
//     }

//     const newActivity = await createActivity({ name, description });

//     // console.log("newActivity", newActivity);
//     res.send(newActivity);
//   } catch (error) {
//     res.status(500);

//     next({
//       error: "an error occurred",
//       message: `An activity with name ${name} already exists`,
//       name: "notUniqueName",
//     });
//   }
// });

// // PATCH /api/activities/:activityId
// router.patch("/:activityId", requireUser, async (req, res, next) => {
//   const id = req.params.activityId;
//   const fields = req.body;

//   try {
//     // console.log(fields.name, fields.description);

//     const activityToUpdate = await updateActivity({ id, ...fields });
//     // console.log(activityToUpdate);

//     if (!activityToUpdate) {
//       res.status(500);

//       res.send({
//         error: "an error has occurred",
//         message: `Activity ${id} not found`,
//         name: "noExistingActivityId",
//       });

//       return;
//     }

//     res.send(activityToUpdate);
//   } catch (error) {
//     res.status(500);

//     next({
//       error: "an error has occurred",
//       message: `An activity with name ${fields.name} already exists`,
//       name: "nameAlreadyExists",
//     });
//   }
// });

// module.exports = router;

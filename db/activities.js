const client = require("./client");

// database functions
async function getAllActivities() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM activities;`);
    // console.log("Eric Activity consolelog");
    // console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const activity = await client.query(
      `
    SELECT * FROM activities WHERE id=$1;`,
      [id]
    );
    // console.log(activity.rows[0]);
    return activity.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const activity = await client.query(
      `
    SELECT * FROM activities WHERE name=$1;`,
      [name]
    );
    return activity.rows[0];
  } catch (error) {
    throw error;
  }
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  // console.log(routines);
  const routineMap = routines.map(async (routine) => {
    // console.log(routine.id);
    const { rows } = await client.query(
      `
    SELECT activities.*, routine_activities.duration, routine_activities.count,
    routine_activities.id AS "routineActivityId", routine_activities."routineId" FROM routine_activities 
    JOIN activities
    ON activities.id = routine_activities."activityId"
    AND routine_activities."routineId" =$1;`,
      [routine.id]
    );
    routine.activities = rows;
    return routine;
  });
  const newRoutines = await Promise.all(routineMap);
  return newRoutines;
}

// return the new activity
async function createActivity({ name, description }) {
  try {
    const result = await client.query(
      `
    INSERT INTO activities (name, description) 
    VALUES($1, $2)
    RETURNING *;
    `,
      [name, description]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {
  // console.log(fields);
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // console.log(setString);
  if (setString.length > 0) {
    const update = await client.query(
      `
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );
    // console.log(update.rows[0]);
    return update.rows[0];
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};

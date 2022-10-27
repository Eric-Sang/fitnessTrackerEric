const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT * FROM routines 
    WHERE id=$1;`,
      [id]
    );
    // console.log(routine);
    return routine;
  } catch (error) {}
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM routines;`);

    return rows;
  } catch (error) {}
}

async function getAllRoutines() {
  try {
    const result = await client.query(`
    SELECT routines.*, users.username AS "creatorName" FROM routines
    JOIN users 
    ON routines."creatorId" = users.id;
    `);

    const attachRoutines = await attachActivitiesToRoutines(result.rows);
    // console.log(attachRoutines);
    return attachRoutines;
  } catch (error) {}
}

async function getAllRoutinesByUser({ username }) {
  try {
    const result = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName" FROM routines
    JOIN users 
    ON routines."creatorId" = users.id
    WHERE users.username = $1;`,
      [username]
    );
    // console.log(result.rows);
    // return result.rows[0];
    const attachRoutines = await attachActivitiesToRoutines(result.rows);
    // console.log(attachRoutines);
    return attachRoutines;
  } catch (error) {}
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const result = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName" FROM routines
      JOIN users 
      ON routines."creatorId" = users.id
      WHERE users.username = $1 AND
      "isPublic" = true;
    `,
      [username]
    );
    // console.log(result.rows[0]);
    // return result.rows[0];
    // console.log(result.rows);
    // return result.rows;
    const attachRoutines = await attachActivitiesToRoutines(result.rows);
    // console.log(attachRoutines);
    return attachRoutines;
  } catch (error) {}
}

async function getAllPublicRoutines() {
  try {
    const result = await client.query(`
    SELECT routines.*, users.username AS "creatorName" FROM routines
    JOIN users 
    ON routines."creatorId" = users.id
    WHERE "isPublic" = true;
    `);
    // return result.rows;
    const attachRoutines = await attachActivitiesToRoutines(result.rows);
    return attachRoutines;
  } catch (error) {}
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    let routines = await getAllPublicRoutines();
    // console.log(routines);

    let resultFilter = routines.filter((routine) => {
      const routineMap = routine.activities.map((activity) => activity.id);

      return routineMap.includes(id);
    });
    return resultFilter;
  } catch (error) {}
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const result = await client.query(
      `
    INSERT INTO routines ("creatorId", "isPublic", name, goal) 
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // console.log(setString);
  if (setString.length > 0) {
    const update = await client.query(
      `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );
    return update.rows[0];
  }
}

async function destroyRoutine(id) {
  try {
    const deleteRoutineAct = await client.query(
      `
    DELETE FROM routine_activities
    WHERE "routineId"=$1
    RETURNING *;
    `,
      [id]
    );
    deleteRoutineAct;
    const result = await client.query(
      `
    DELETE FROM routines
    WHERE id=$1
    RETURNING *;
    `,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};

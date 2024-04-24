const { db } = require("./connection");

const createTask = async ({
  title,
  description,
  status,
  priority,
  createdBy,
  assignedTo,
  listId,
}) => {
  const tasks = await getAllTaskByListId(listId, db);
  let position;
  if (tasks.length > 0) {
    position = tasks.length;
  } else {
    position = 0;
  }
  return await db.none(
    `insert into tasks(
        title,
        description,
        status,
        priority,
        created_by,
        assigned_to,
        position,
        list_id
    ) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      title,
      description,
      status,
      priority,
      createdBy,
      assignedTo,
      position,
      listId,
    ]
  );
};

async function getTaskDetailById(taskId) {
  return await db.one(
    `select tasks.*, json_build_object(
        'id', ls.id,
        'title', ls.title
    ) AS list from tasks inner join lists ls on tasks.list_id = ls.id where tasks.id = $1`,
    [taskId]
  );
  /*
    This is how we contruct an nested object using json_build_object
*/
  //   return await db.one(
  //     `select tasks.*, json_build_object(
  //         'id', ls.id,
  //         'title', ls.title
  //     ) AS list from tasks inner join lists ls on tasks.list_id = ls.id where tasks.id = $1`,
  //     [taskId]
  //   );
}

async function moveTask({
  taskId,
  sourceListId,
  destinationListId,
  destinationIndex,
}) {
  await db.tx(async (t) => {
    const task = await t.one(`select position from tasks where id = $1`, [
      taskId,
    ]);

    await t.none(
      `update tasks set position = position - 1 where position > $1 and tasks.list_id = $2`,
      [task.position, sourceListId]
    );

    await t.none(
      `update tasks set position = position + 1 where position >= $1 and tasks.list_id = $2`,
      [destinationIndex, destinationListId]
    );

    await t.none(
      `update tasks set position = $1, list_id = $2 where id = $3`,
      [destinationIndex, destinationListId, taskId]
    );
  });
}

async function getAllTaskByListId(listId, t) {
  return (
    (await t.any(`select tasks.* from tasks where list_id = $1`, [listId])) ||
    []
  );
}

module.exports = {
  createTask,
  getTaskDetailById,
  moveTask,
};

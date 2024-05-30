const { db } = require("./connection");

const createTask = async ({
  title,
  description,
  status,
  priority,
  createdBy,
  assignedTo,
  listId,
  fileUrl,
}) => {
  return db.tx(async (t) => {
    const tasks = await getAllTaskByListId(listId, t);
    let position;
    if (tasks.length > 0) {
      position = tasks.length;
    } else {
      position = 0;
    }

    const taskRes = await t.one(
      `insert into tasks(
        title,
        description,
        status,
        priority,
        created_by,
        assigned_to,
        position,
        list_id
    ) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`,
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
    let taskFileRes = {};
    if (fileUrl) {
      taskFileRes = await t.one(
        `insert into task_files(task_id, file_url, uploaded_by) values($1, $2, $3) returning *`,
        [taskRes.id, fileUrl, createdBy]
      ); // update key createdBy with uploadedBy userId
    }
    return {
      ...taskRes,
      file: taskFileRes,
    };
  });
};

async function getTaskDetailById(taskId) {
  return await db.one(
    `
  SELECT 
    tasks.*, 
    json_build_object(
        'id', tfs.id,
        'url', tfs.file_url
    ) AS file, 
  COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', com.id,
          'text', com.text,
          'created_at', com.created_at,
          'user', json_build_object(
            'user_id', usr.id,
            'name', usr.name
          )
        )
      ) FILTER (WHERE com.id IS NOT NULL), 
      '[]'
    ) AS comments, 
    json_build_object(
        'id', ls.id,
        'title', ls.title
    ) AS list
  FROM 
      tasks
  INNER JOIN 
      lists ls ON tasks.list_id = ls.id
  LEFT JOIN 
      task_files tfs ON tasks.id = tfs.task_id
  LEFT JOIN
      comments com ON tasks.id = com.task_id
  LEFT JOIN 
      users usr ON usr.id = com.user_id
  WHERE 
      tasks.id = $1
  GROUP BY
      tasks.id, tfs.id, ls.id
`,
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

async function updateTaskById(body, taskId) {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    createdBy,
    assignedTo,
  } = body;
  return db.none(
    `update tasks 
    set title=$1, description=$2, status=$3, priority=$4, due_date=$5, created_by=$6, assigned_to=$7 where id = $8;`,
    [
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy,
      assignedTo,
      taskId,
    ]
  );
}

async function moveTask(obj) {
  /*
    {
      listId: {
        taskId: position,
        taskId: position,
        taskId: position,
        taskId: position,
      },
      listId: {
        taskId: position,
        taskId: position,
        taskId: position,
        taskId: position,
      },
    }
    Object.entries(obj).map(([key, value]) => {
      let list = obj[key],
    })
  */
  const promises = [];
  for (let list in obj) {
    const listId = list;
    for (let taskId in obj[list]) {
      const pos = obj[list][taskId];
      const sql = `update tasks set position = $1, list_id = $2 where id = $3`;
      promises.push(db.none(sql, [pos, parseInt(listId), parseInt(taskId)]));
    }
  }
  return await db.tx((t) => t.batch(promises));
}

async function getAllTaskByListId(listId, t) {
  return (
    (await t.any(`select tasks.* from tasks where list_id = $1`, [listId])) ||
    []
  );
}

async function deleteTask(taskId) {
  return await db.none("delete tasks where id = $1", [taskId]);
}

async function getAllTask() {
  return await db.many(`SELECT 
  l.id AS list_id,
  l.title AS list_title,
  COALESCE(json_agg(
      json_build_object(
          'id', t.id,
          'title', t.title,
          'description', t.description,
          'status', t.status,
          'priority', t.priority,
          'due_date', t.due_date,
          'created_by', t.created_by,
          'assigned_to', t.assigned_to,
          'created_at', t.created_at,
          'position', t.position,
          'list_id', t.list_id
      )
  ) FILTER (WHERE t.id IS NOT NULL), '[]') AS tasks
FROM tasks t
RIGHT JOIN lists l ON t.list_id = l.id
GROUP BY l.id, l.title;
`);
}

async function commentOnTask(taskId, userId, commentData) {
  const { text } = commentData;
  return await db.one(
    `with 
      inserted_comment
     as (insert into 
      comments(text, task_id, user_id)
      values($1, $2, $3) 
      returning *)

    select 
      text, created_at,
      json_build_object(
        'id', usr.id,
        'name', usr.name
      ) as user
      from 
    inserted_comment ic
    inner join users usr on ic.user_id = usr.id
    `,
    [text, taskId, userId]
  );
  // return await getTaskDetailById(taskId);
}

module.exports = {
  createTask,
  getTaskDetailById,
  moveTask,
  updateTaskById,
  deleteTask,
  getAllTask,
  commentOnTask,
};

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {

    pgm.createTable('comments', {
        id: 'id',
        text: {
            type: 'string',
        },
        task_id: {
            type: 'integer',
            notNull: false,
            references: 'tasks',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('comments');
};

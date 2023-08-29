import {Sequelize} from "sequelize-typescript";

export default async function getLastMigrationState(sequelize: Sequelize) {
    const [
        lastExecutedMigration,
    ] = await sequelize.query(
        "SELECT name FROM SequelizeMeta ORDER BY name desc limit 1",
        {type: "SELECT"}
    );

    const lastRevision: number =
        lastExecutedMigration !== undefined
            ? parseInt(lastExecutedMigration["name"].split("-")[0])
            : -1;

    const [
        lastMigration,
    ] = await sequelize.query(
        `SELECT state
         FROM SequelizeMetaMigrations
         where revision = '${lastRevision}'`,
        {type: "SELECT"}
    );

    if (!lastMigration) {
        return undefined
    }

    try {
        // mariadb need a JSON parse
        return JSON.parse(lastMigration["state"])
    } catch (e) {
        // mysql does not
        return lastMigration["state"]
    }

}

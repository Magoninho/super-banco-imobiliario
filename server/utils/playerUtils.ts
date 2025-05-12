import { db } from "../config/db.ts";

export const removePlayerFromDb = (playerId: number) => {
    try {
        // db.query(`DELETE FROM players WHERE playerId = ?`, [playerId]);
        
        // const player = db.prepare(`SELECT * FROM players WHERE player_id = ?;`)
        //     .all(playerId);
        db.prepare("DELETE FROM players WHERE player_id = ?;").run(playerId);
        console.log("tentei");

    } catch (err) {
        console.log("deu erro");
        throw err;
    }
}
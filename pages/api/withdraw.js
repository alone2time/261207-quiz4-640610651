import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    //return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });
    if (!user || user.isAdmin)
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to withdraw",
      });
    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });
    if (amount < 1)
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });
    //find and update money in DB (if user has enough money)
    //return res.status(400).json({ ok: false, message: "You do not has enough money" });
    const users = readUsersDB();
    const userDollar = users.find((x) => x.username === user.username);
    if (userDollar.money < amount)
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });
    userDollar.money = userDollar.money - amount;
    writeUsersDB(users);

    //return response
    return res.status(200).json({ ok: true, money: userDollar.money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}

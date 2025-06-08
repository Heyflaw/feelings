// pages/api/join-whitelist.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

const MAX_WALLETS = 100;
const WHITELIST_PATH = path.join(process.cwd(), "data", "whitelist.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // -- GET : renvoyer le total et la liste
  if (req.method === "GET") {
    let list: string[];
    try {
      const file = await fs.readFile(WHITELIST_PATH, "utf8");
      list = JSON.parse(file);
      if (!Array.isArray(list)) throw new Error();
    } catch {
      list = [];
    }
    return res.status(200).json({ total: list.length, list, max: MAX_WALLETS });
  }

  // -- POST : on ajoute
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { address } = req.body;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ message: "Invalid address" });
  }

  let list: string[];
  try {
    const file = await fs.readFile(WHITELIST_PATH, "utf8");
    list = JSON.parse(file);
    if (!Array.isArray(list)) throw new Error();
  } catch {
    list = [];
  }

  if (list.length >= MAX_WALLETS) {
    return res.status(400).json({
      message:
        'Heads up! The list’s completely full right now, but we’re opening up more spots soon. Follow <a href="https://x.com/Heyflaw" target="_blank" rel="noopener noreferrer">@Heyflaw</a> on X and turn on notifications 🔔 to be the first to know!',
      total: list.length,
      list,
      max: MAX_WALLETS,
    });
  }

  if (list.includes(address)) {
    return res.status(409).json({
      message: "Address already on the list.",
      total: list.length,
      list,
      max: MAX_WALLETS,
    });
  }

  list.push(address);
  await fs.mkdir(path.dirname(WHITELIST_PATH), { recursive: true });
  await fs.writeFile(WHITELIST_PATH, JSON.stringify(list, null, 2), "utf8");

  return res.status(200).json({
    message: "You’re in! 🎉",
    total: list.length,
    list,
    max: MAX_WALLETS,
  });
}

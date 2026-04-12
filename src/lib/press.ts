import { promises as fs } from "fs";
import path from "path";
import type { PressFeature } from "@/types/content";

const DATA_PATH = path.join(process.cwd(), "content/press/press.json");

export async function getAllPress(): Promise<PressFeature[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data: PressFeature[] = JSON.parse(raw);
  data.sort((a, b) => {
    if (a.date && b.date)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return 0;
  });
  return data;
}

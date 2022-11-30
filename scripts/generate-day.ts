import commandLineArgs from "command-line-args";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const options = commandLineArgs([
  { name: "day", type: Number, defaultValue: Number(process.env.DAY) },
]);

const { day } = options;

console.info(`Generating Day ${day} file from template...`);

const template = fs.readFileSync("./src/day.template.ts").toString();
const data = template.replace("$$DAY$$", day);

try {
  fs.writeFileSync(`./src/day.${day}.ts`, data);
  console.info("Created file successfully!");
} catch (error: any) {
  console.error("Failed to create file: ", error.message);
}

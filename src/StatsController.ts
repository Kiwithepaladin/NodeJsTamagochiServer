import { NextFunction, Request, Response } from "express"
import { Stats } from "./Stats"

export const statToChange: { [stat: string]: string } = {
  hunger: "hunger",
  education: "education",
  happiness: "happiness",
  hygiene: "hygiene",
  energy: "energy",
}

export const testSubject = async () => {
  const moisheUfnik = new Stats({
    name: "moisheUfnik",
    education: 0,
    hunger: 0,
    happiness: 0,
    hygiene: 0,
    energy: 0,
  })
  await moisheUfnik.save(err => {
    console.log(err)
  })
}
export const pickRandomProperty = (obj: any) => {
  var result
  var count = 0
  for (var prop in obj) if (Math.random() < 1 / ++count) result = prop
  return result
}
export async function ReduceStatRecuirsive(stat: any, amount: number) {
  Stats.updateOne({ name: "moisheUfnik" }, { $inc: { [stat]: -amount } }).then(
    () => {
      console.log(`${stat} reduced by ${amount}`)
      setTimeout(() => {
        ReduceStatRecuirsive(pickRandomProperty(statToChange), amount)
      }, 2 * 1000)
    }
  )
}
export const getAllStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stats = await Stats.findOne(
    { name: "moisheUfnik" },
    "hunger education happiness hygiene energy"
  )
  const statsNoID = { ...stats._doc }
  delete statsNoID._id
  res.json(statsNoID)
  return next()
}

export async function broadcastAllStats() {
  const stats = await Stats.findOne(
    { name: "moisheUfnik" },
    "hunger education happiness hygiene energy"
  )
  delete stats._doc._id
  return JSON.stringify(stats)
}

export async function SetStat(stat: string, addition: number) {
  Stats.updateOne({ name: "moisheUfnik" }, { $inc: { [stat]: addition } }).then(
    () => {
      console.log(`Updating Stat ${stat} by ${addition}`)
    }
  )
}

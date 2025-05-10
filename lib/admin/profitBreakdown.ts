import ManualPayout from "@/models/ManualPayout";
import mongoose from "mongoose";

export const getProfitBreakdown = async () => {
  const daily = await ManualPayout.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        profit: { $sum: "$fees" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        profit: 1,
        _id: 0,
      },
    },
  ]);

  const weekly = await ManualPayout.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%U", date: "$createdAt" }, // Year-Week format
        },
        profit: { $sum: "$fees" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        profit: 1,
        _id: 0,
      },
    },
  ]);

  const monthly = await ManualPayout.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        profit: { $sum: "$fees" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        profit: 1,
        _id: 0,
      },
    },
  ]);

  return {
    daily,
    weekly,
    monthly,
  };
};

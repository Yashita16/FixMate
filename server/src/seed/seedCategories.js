import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.model.js";

dotenv.config();

const categories = [
  {
    name: "Plumber",
    slug: "plumber",
    icon: "🔧",
    description: "Plumbing and pipe repair services",
  },
  {
    name: "Electrician",
    slug: "electrician",
    icon: "⚡",
    description: "Electrical installation and repair",
  },
  {
    name: "Carpenter",
    slug: "carpenter",
    icon: "🪚",
    description: "Furniture and woodwork services",
  },
  {
    name: "Painter",
    slug: "painter",
    icon: "🎨",
    description: "Home and office painting services",
  },
  {
    name: "Cleaner",
    slug: "cleaner",
    icon: "🧹",
    description: "Home and office cleaning services",
  },
  {
    name: "AC Technician",
    slug: "ac-technician",
    icon: "❄️",
    description: "AC installation and repair",
  },
  {
    name: "Appliance Repair",
    slug: "appliance-repair",
    icon: "🔌",
    description: "Repair of household appliances",
  },
  {
    name: "Pest Control",
    slug: "pest-control",
    icon: "🐜",
    description: "Pest and termite control services",
  },
  {
    name: "Gardener",
    slug: "gardener",
    icon: "🌱",
    description: "Garden maintenance services",
  },
  {
    name: "Computer Repair",
    slug: "computer-repair",
    icon: "💻",
    description: "Computer and laptop repair",
  }
];

const seedCategories = async () => {
  try {
    console.log("DB URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    await Category.deleteMany({});
    console.log("Old categories removed");

    await Category.insertMany(categories);
    console.log(`✅ ${categories.length} categories seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
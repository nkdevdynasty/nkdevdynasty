import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Seeding large dataset of dummy users (25+)...");

  const majors = [
    "Computer Science",
    "Data Science",
    "Digital Media",
    "Information Systems",
    "Business Admin",
    "Cyber Security",
  ];
  const years = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Class of 2020",
    "Class of 2021",
    "Class of 2022",
    "Class of 2023",
    "Class of 2024",
  ];
  const locations = [
    "New York, NY",
    "Austin, TX",
    "San Francisco, CA",
    "Seattle, WA",
    "Remote",
    "London, UK",
    "Bangalore, IN",
  ];
  const companies = [
    "Google",
    "Meta",
    "Amazon",
    "Startup Inc",
    "VibeDesign",
    "TechCorp",
    "Freelance",
  ];
  const skillsList = [
    "React",
    "Python",
    "SQL",
    "UI/UX",
    "Node.js",
    "TypeScript",
    "AWS",
    "Figma",
    "Docker",
    "Go",
  ];

  const generateUser = (i: number) => {
    const isAlumni = i > 12;
    const role = isAlumni ? Role.ALUMNI : Role.STUDENT;
    const major = majors[i % majors.length];
    const year = years[i % years.length];

    // Pick 3 random skills
    const skills = [
      skillsList[i % skillsList.length],
      skillsList[(i + 2) % skillsList.length],
      skillsList[(i + 5) % skillsList.length],
    ];

    return {
      authentikId: `dummy-id-${i}`,
      email: `user${i}@university.edu`,
      name: `Dummy User ${i}`,
      role,
      major,
      year,
      bio: `This is a generated bio for dummy user ${i}. Passionate about ${major} and ${skills[0]}.`,
      skills,
      groups: [role.toLowerCase()],
      isActive: true,
      company: isAlumni ? companies[i % companies.length] : null,
      location: isAlumni ? locations[i % locations.length] : null,
    };
  };

  for (let i = 1; i <= 25; i++) {
    const user = generateUser(i);
    await prisma.user.upsert({
      where: { authentikId: user.authentikId },
      update: { ...user },
      create: { ...user },
    });
    if (i % 5 === 0) console.log(`✅ Upserted ${i} users...`);
  }

  console.log("🎉 Large scale seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

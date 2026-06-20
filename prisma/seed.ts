import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { hashSync } from "bcryptjs";
import path from "node:path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const libsql = createClient({ url: `file:${dbPath}` });
const adapter = new PrismaLibSql(libsql as never);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.missionSlot.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.event.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const pwd = hashSync("password123", 10);

  // Create admin user (Franck)
  const franck = await prisma.user.create({
    data: {
      name: "Franck Menelik",
      email: "franck@pixels.ca",
      passwordHash: pwd,
      role: "admin",
    },
  });

  // Create operator (Élia)
  const elia = await prisma.user.create({
    data: {
      name: "Élia",
      email: "elia@pixels.ca",
      passwordHash: pwd,
      role: "operator",
    },
  });

  // Create 8 artist users with profiles
  const artistsData = [
    { name: "Sophie Tremblay", email: "sophie@mail.com", stageName: "Sophie T", university: "McGill", program: "Jazz Performance", instruments: JSON.stringify([{name:"Piano",level:"Professionnel"},{name:"Voix",level:"Avancé"}]), genres: JSON.stringify(["Jazz","Soul","R&B"]), skills: JSON.stringify(["Arrangement","Lecture de partitions"]), canSing: true, vocalRange: "Alto", musicTraining: "Conservatoire" },
    { name: "Marcus Jean-Baptiste", email: "marcus@mail.com", stageName: "MarcusJB", university: "HEC Montréal", program: "Management", instruments: JSON.stringify([{name:"Guitare",level:"Avancé"},{name:"Basse",level:"Intermédiaire"}]), genres: JSON.stringify(["Jazz","Funk","Pop"]), skills: JSON.stringify(["Improvisation"]), canSing: false, musicTraining: "Autodidacte" },
    { name: "Amina Diallo", email: "amina@mail.com", university: "Polytechnique", program: "Génie informatique", instruments: JSON.stringify([{name:"Voix",level:"Professionnel"}]), genres: JSON.stringify(["R&B","Soul","Afro","Pop"]), skills: JSON.stringify(["Composition"]), canSing: true, vocalRange: "Soprano", musicTraining: "École de musique" },
    { name: "Léo Dumont", email: "leo@mail.com", university: "McGill", program: "Music Theory", instruments: JSON.stringify([{name:"Batterie",level:"Professionnel"},{name:"Percussion",level:"Avancé"}]), genres: JSON.stringify(["Jazz","Rock","Funk","Latin"]), skills: JSON.stringify(["Improvisation","Lecture de partitions"]), canSing: false, musicTraining: "Conservatoire", hasTransport: true, hasLicense: true },
    { name: "Clara Nguyen", email: "clara@mail.com", university: "HEC Montréal", program: "Finance", instruments: JSON.stringify([{name:"Violon",level:"Avancé"},{name:"Piano",level:"Intermédiaire"}]), genres: JSON.stringify(["Classique","Jazz","Pop"]), skills: JSON.stringify(["Lecture de partitions","Arrangement"]), canSing: false, musicTraining: "Conservatoire" },
    { name: "Yassine El-Khoury", email: "yassine@mail.com", university: "Polytechnique", program: "Génie mécanique", instruments: JSON.stringify([{name:"Saxophone",level:"Avancé"},{name:"Flûte",level:"Intermédiaire"}]), genres: JSON.stringify(["Jazz","Blues","Funk"]), skills: JSON.stringify(["Improvisation"]), canSing: false, musicTraining: "École de musique" },
    { name: "Jade Moreau", email: "jade@mail.com", stageName: "Jade M", university: "McGill", program: "Vocal Performance", instruments: JSON.stringify([{name:"Voix",level:"Professionnel"},{name:"Ukulélé",level:"Intermédiaire"}]), genres: JSON.stringify(["Pop","Folk","Jazz","Soul"]), skills: JSON.stringify(["Composition","Arrangement"]), canSing: true, vocalRange: "Soprano", musicTraining: "Conservatoire" },
    { name: "David Kim", email: "david@mail.com", university: "HEC Montréal", program: "Entrepreneuriat", instruments: JSON.stringify([{name:"Basse",level:"Professionnel"},{name:"Contrebasse",level:"Avancé"}]), genres: JSON.stringify(["Jazz","Funk","R&B","Hip-Hop"]), skills: JSON.stringify(["Improvisation","Composition"]), canSing: false, musicTraining: "Autodidacte", hasTransport: true, hasLicense: true },
  ];

  const artists = [];
  for (const a of artistsData) {
    const user = await prisma.user.create({
      data: {
        name: a.name,
        email: a.email,
        passwordHash: pwd,
        role: "artist",
        artist: {
          create: {
            stageName: a.stageName,
            university: a.university,
            program: a.program,
            instruments: a.instruments,
            genres: a.genres,
            skills: a.skills,
            canSing: a.canSing,
            vocalRange: a.vocalRange,
            musicTraining: a.musicTraining,
            hasTransport: a.hasTransport || false,
            hasLicense: a.hasLicense || false,
            bio: `Musicien passionné à ${a.university}`,
            status: "active",
            ratingAvg: 3.5 + Math.random() * 1.5,
          },
        },
      },
      include: { artist: true },
    });
    artists.push(user);
  }

  // Create 2 organizer users
  const org1User = await prisma.user.create({
    data: {
      name: "Association HEC",
      email: "asso@hec.ca",
      passwordHash: pwd,
      role: "organizer",
      organizer: {
        create: {
          orgName: "Association des étudiants HEC",
          orgType: "association",
          contactPhone: "514-555-0101",
        },
      },
    },
    include: { organizer: true },
  });

  const org2User = await prisma.user.create({
    data: {
      name: "Marie Dupont",
      email: "marie@gmail.com",
      passwordHash: pwd,
      role: "organizer",
      organizer: {
        create: {
          orgName: "Mariage Dupont-Martin",
          orgType: "particular",
          contactPhone: "514-555-0202",
        },
      },
    },
    include: { organizer: true },
  });

  // Create events
  const event1 = await prisma.event.create({
    data: {
      organizerId: org1User.organizer!.id,
      name: "Gala de fin d'année HEC",
      type: "access",
      segment: "access",
      dateStart: new Date("2026-09-15T18:00:00"),
      dateEnd: new Date("2026-09-15T22:00:00"),
      venueName: "Salle des fêtes HEC",
      venueAddress: "3000 Chemin de la Côte-Sainte-Catherine, Montréal",
      venueType: "indoor",
      guestCount: 200,
      description: "Gala annuel avec cocktail et remise de prix. Ambiance jazz et pop.",
      musicStyles: JSON.stringify(["Jazz", "Pop"]),
      musiciansCount: 4,
      duration: 4,
      hasPower: true,
      hasSound: true,
      hasParking: true,
      budget: 500,
      status: "new",
    },
  });

  const event2 = await prisma.event.create({
    data: {
      organizerId: org2User.organizer!.id,
      name: "Mariage Dupont-Martin",
      type: "premium",
      segment: "premium",
      dateStart: new Date("2026-10-12T16:00:00"),
      dateEnd: new Date("2026-10-12T22:00:00"),
      venueName: "Domaine des Érables",
      venueAddress: "1234 Chemin du Lac, Mont-Tremblant",
      venueType: "outdoor",
      guestCount: 120,
      description: "Mariage en extérieur. Cérémonie + cocktail + réception. Jazz/Bossa pour cérémonie, Pop/Soul pour réception.",
      musicStyles: JSON.stringify(["Jazz", "Bossa Nova", "Pop", "Soul"]),
      playlistSongs: JSON.stringify(["At Last - Etta James", "Fly Me to the Moon - Frank Sinatra", "Thinking Out Loud - Ed Sheeran", "All of Me - John Legend", "La Vie en Rose - Édith Piaf"]),
      musiciansCount: 5,
      duration: 6,
      hasPower: true,
      hasSound: false,
      hasStage: false,
      hasParking: true,
      budget: 2000,
      status: "accepted",
    },
  });

  // Create quote for event2
  const quote2 = await prisma.quote.create({
    data: {
      eventId: event2.id,
      amount: 1800,
      breakdown: JSON.stringify({
        musicians: "5 × 300$ = 1500$",
        transport: "200$ (2× Uber XL)",
        sound: "100$ (location système son)",
      }),
      terms: "Paiement 50% à la confirmation, 50% le jour J. Annulation gratuite 7j+ avant l'événement.",
      status: "accepted",
      signedAt: new Date("2026-08-01"),
    },
  });

  // Create mission for event2
  const mission2 = await prisma.mission.create({
    data: {
      eventId: event2.id,
      directorId: franck.id,
      status: "preparing",
      totalAmount: 1800,
      musiciansPct: 60,
      logisticsPct: 20,
      reservePct: 20,
    },
  });

  // Add slots to mission
  const artistRecords = artists.map(a => a.artist!);
  await prisma.missionSlot.createMany({
    data: [
      { missionId: mission2.id, artistId: artistRecords[0].id, instrument: "Piano", status: "accepted", payAmount: 216 },
      { missionId: mission2.id, artistId: artistRecords[1].id, instrument: "Guitare", status: "accepted", payAmount: 216 },
      { missionId: mission2.id, artistId: artistRecords[2].id, instrument: "Voix", status: "accepted", payAmount: 216 },
      { missionId: mission2.id, artistId: artistRecords[7].id, instrument: "Basse", status: "accepted", payAmount: 216 },
      { missionId: mission2.id, artistId: artistRecords[3].id, instrument: "Batterie", status: "invited", payAmount: 216 },
    ],
  });

  // Create a completed event with transactions
  const event3 = await prisma.event.create({
    data: {
      organizerId: org1User.organizer!.id,
      name: "Cocktail de lancement TechStart",
      type: "standard",
      segment: "standard",
      dateStart: new Date("2026-06-01T17:00:00"),
      dateEnd: new Date("2026-06-01T20:00:00"),
      venueName: "Centre des sciences de Montréal",
      venueAddress: "2 Rue de la Commune O, Montréal",
      venueType: "indoor",
      guestCount: 80,
      description: "Cocktail de lancement pour startup tech. Jazz ambiance.",
      musicStyles: JSON.stringify(["Jazz"]),
      musiciansCount: 3,
      duration: 3,
      hasPower: true,
      hasSound: true,
      budget: 1200,
      status: "paid",
    },
  });

  await prisma.quote.create({
    data: {
      eventId: event3.id,
      amount: 1200,
      breakdown: JSON.stringify({ musicians: "3 × 200$", transport: "120$" }),
      status: "accepted",
      signedAt: new Date("2026-05-15"),
    },
  });

  const mission3 = await prisma.mission.create({
    data: {
      eventId: event3.id,
      directorId: franck.id,
      status: "completed",
      totalAmount: 1200,
    },
  });

  // Transactions for completed mission
  await prisma.transaction.createMany({
    data: [
      { missionId: mission3.id, type: "income", amount: 1200, category: "event_payment", description: "Paiement Cocktail TechStart", status: "completed" },
      { missionId: mission3.id, type: "expense", amount: 240, category: "musician_payment", description: "Sophie Tremblay - Piano", fromTo: "Sophie Tremblay", status: "completed" },
      { missionId: mission3.id, type: "expense", amount: 240, category: "musician_payment", description: "Marcus JB - Guitare", fromTo: "Marcus Jean-Baptiste", status: "completed" },
      { missionId: mission3.id, type: "expense", amount: 240, category: "musician_payment", description: "Yassine - Saxophone", fromTo: "Yassine El-Khoury", status: "completed" },
      { missionId: mission3.id, type: "expense", amount: 120, category: "transport", description: "Uber XL aller-retour", status: "completed" },
      { missionId: mission3.id, type: "expense", amount: 120, category: "logistics", description: "Coordination", status: "completed" },
      { missionId: mission3.id, type: "income", amount: 240, category: "reserve", description: "Réserve financière (20%)", status: "completed" },
    ],
  });

  console.log("Seed completed!");
  console.log(`Created: ${artists.length} artists, 2 organizers, 3 events, 2 missions`);
  console.log("Login with any email + password: password123");
  console.log("Admin: franck@pixels.ca | Operator: elia@pixels.ca");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

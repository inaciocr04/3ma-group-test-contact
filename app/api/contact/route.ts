import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import nodemailer from "nodemailer";

// GET /api/contact : récupère la liste des contacts, triée par date décroissante
export async function GET() {
  try {
    const submissions = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Erreur GET /api/contact :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/contact : crée une nouvelle soumission et envoie un email de confirmation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Vérifie que tous les champs requis sont présents
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Crée la nouvelle entrée dans la base de données via Prisma
    const newContact = await prisma.contact.create({
      data: { name, email, message },
    });

    console.log("Contact créé dans la DB :", newContact);

    // Vérifie la présence des variables d'environnement pour l'email
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "NON DEFINI");

    // Configure Nodemailer avec les infos SMTP d'OVH
    const transporter = nodemailer.createTransport({
      host: "ssl0.ovh.net",
      port: 465,
      secure: true, // SSL sur le port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Définit le contenu du mail de confirmation
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "Nouvelle soumission de contact",
      text: `Nouvelle soumission reçue :
          Nom : ${name}
          Email : ${email}
          Message : ${message}
          Envoyé le : ${new Date().toLocaleString()}`,
    };

    console.log("Envoi mail avec :", mailOptions);

    await transporter.sendMail(mailOptions);

    // Retourne une réponse JSON indiquant le succès
    return NextResponse.json({ success: true, data: newContact });
  } catch (error: any) {
    console.error("Erreur dans POST /api/contact :", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
